<template>
  <div class="my-2">
    <div v-if="!verified" class="text-center">
      <section>
        <router-link
          :to="{
            name: 'verify',
            params: {
              address,
            },
          }"
          >VERIFY</router-link
        >
        <span> contract source code.</span>
      </section>
      <section v-if="bytecode">
        <copy-data class="my-2" :data="bytecode" />
        <b-form-textarea readonly rows="3" max-rows="16" :value="bytecode"></b-form-textarea>
      </section>
    </div>
    <div v-else-if="computedFiles.length">
      <section class="d-flex flex-wrap justify-content-between my-2">
        <div v-for="item in computedVerifyParams" :key="item.name" class="border rounded px-4 py-2 text-nowrap">
          <span class="verify-params-name">{{ item.name }}</span>
          <span>{{ item.value }}</span>
        </div>
      </section>
      <b-tabs content-class="mt-3">
        <b-tab title="Code" active>
          <code-text-area
            v-for="(item, index) in computedFiles"
            :key="item.path"
            :code="item"
            :index="index + 1"
            :total="computedFiles.length"
          />
        </b-tab>
        <b-tab title="Read">
          <b-button @click="connect" :variant="variantBtn" pill size="sm">
            {{ computedBtnText }}
          </b-button>
          <ContractReadFunction
            v-for="(item, index) in readAbi"
            :key="index"
            :abi="item"
            :contract="contract"
            :open="openable"
            :index="index + 1"
          />
        </b-tab>
        <b-tab title="Write">
          <b-button @click="connect" :variant="variantBtn" pill size="sm">
            {{ computedBtnText }}
          </b-button>
          <ContractWriteFunction
            v-for="(item, index) in writeAbi"
            :key="index"
            :abi="item"
            :contract="contract"
            :open="openable"
            :index="index + 1"
          />
        </b-tab>
      </b-tabs>
    </div>
    <span v-else class="d-flex justify-content-center">No Code.</span>
  </div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";
import ContractReadFunction from "./ContractReadFunction.vue";
import ContractWriteFunction from "./ContractWriteFunction.vue";
import CodeTextArea from "@/components/CodeTextArea.vue";
import CopyData from "../components/CopyData.vue";
import { ethers } from "ethers";

export default {
  name: "Contract",
  components: {
    ContractReadFunction,
    ContractWriteFunction,
    CodeTextArea,
    CopyData
  },
  props: {
    verified: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
      default() {
        return [];
      },
    },
    address: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      provider: null,
      contract: null,
      account: null,
      chainId: null,
      abi: null,
      readAbi: [],
      writeAbi: [],
      bytecode: '',
    };
  },
  computed: {
    variantBtn() {
      if (this.account && this.chainId == this.currentChain.chainId) {
        return "primary";
      } else {
        return "danger";
      }
    },
    computedFiles() {
      const files = [];
      for (const f of this.files) {
        if (f.name.includes(".sol")) {
          files.unshift(f);
        } else {
          files.push(f);
        }
      }
      return files;
    },
    computedVerifyParams() {
      const params = []
      try {
        const metadata = this.files.find(f => f.name === 'metadata.json')
        const jsonData = JSON.parse(metadata.content)
        const compilerVersion = jsonData.compiler.version
        const settings = jsonData.settings
        const contractName = Object.values(settings.compilationTarget)[0]
        const optimizationEnable = settings.optimizer.enabled
          ? `Yes with ${settings.optimizer.runs} runs`
          : `No with ${settings.optimizer.runs} runs`
        const evmVersion = settings.evmVersion

        params.push({
          name: 'Contract Name: ',
          value: contractName
        }, {
          name: 'Optimization Enabled: ',
          value: optimizationEnable
        }, {
          name: 'Compiler Version: ',
          value: compilerVersion
        }, {
          name: 'EVM Version: ',
          value: evmVersion
        })
      } catch(e) {
        console.log('get verify params error', e.message)
      }

      return params
    },
    computedBtnText() {
      if (this.account) {
        if (this.chainId != this.currentChain.chainId) {
          return `Wrong Network`;
        }
        return this.account.substr(0, 4) + "..." + this.account.substr(-2);
      } else {
        return "Connect";
      }
    },
    openable() {
      return (
        this.contract && this.account && this.chainId == this.currentChain.chainId
      );
    },
  },
  async created() {
    this.initAbi();

    const provider = await detectEthereumProvider();
    this.provider = provider;

    if (!this.verified) {
      this.getContractBytecode();
    }
  },
  watch: {
    async chainId(newVal, oldVal) {
      if (!oldVal) {
        return;
      }
      this.removeAllListeners();
      const provider = await detectEthereumProvider();
      this.provider = provider;
      this.connect();
    },
    files() {
      this.initAbi();
    },
  },
  methods: {
    async getContractBytecode() {
      const data = await this.$api.contract.getContractBytecode(this.network, this.address);
      // console.log(data.contract.code);
      this.bytecode = data.contract.code;
    },
    initAbi() {
      if (!this.files.length) {
        return;
      }
      const readAbi = [];
      const writeAbi = [];
      const metadata = this.files.find((item) => item.name === "metadata.json");
      const abi = JSON.parse(metadata.content).output.abi;
      for (const f of abi) {
        if (f.type === "function") {
          if (f.stateMutability === "view") {
            readAbi.push(f);
          } else {
            writeAbi.push(f);
          }
        }
      }
      this.abi = abi;
      this.readAbi = readAbi;
      this.writeAbi = writeAbi;
    },
    connect() {
      if (!this.provider) {
        return;
      }
      this.provider.on("chainChanged", this.chainChangedHandle);
      this.provider.on("accountsChanged", this.accountsChangeHandle);

      this.provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          this.account = accounts[0];
          const signer = new ethers.providers.Web3Provider(
            this.provider
          ).getSigner();
          this.contract = new ethers.Contract(this.address, this.abi, signer);
        })
        .catch((err) => {
          console.log(err);
        });
      this.provider.request({ method: "eth_chainId" }).then((chainId) => {
        this.chainId = chainId;
      });
    },
    chainChangedHandle(chainId) {
      this.chainId = chainId;
    },
    accountsChangeHandle(accounts) {
      this.account = accounts[0];
    },
    removeAllListeners() {
      if (this.provider) {
        this.provider.removeListener("chainChanged", this.chainChangedHandle);
        this.provider.removeListener(
          "accountsChanged",
          this.accountsChangeHandle
        );
      }
    },
  },
  beforeDestroy() {
    this.removeAllListeners();
  },
};
</script>

<style lang="scss" scoped>
.loading {
  opacity: 0.55;
  font-size: 14px;
  font-weight: bold;
}
.verify-params-name {
  color: '#77838f';
  font-size: .8rem;
}
</style>