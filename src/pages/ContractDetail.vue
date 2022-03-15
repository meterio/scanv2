<template>
  <div class="my-2">
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
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";
import ContractReadFunction from "./ContractReadFunction.vue";
import ContractWriteFunction from "./ContractWriteFunction.vue";
import CodeTextArea from "@/components/CodeTextArea.vue";
import { ethers } from "ethers";
import { MATCH_CHAIN } from "@/config";

export default {
  name: "Contract",
  components: {
    ContractReadFunction,
    ContractWriteFunction,
    CodeTextArea,
  },
  props: {
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
    };
  },
  computed: {
    variantBtn() {
      if (this.account && this.chainId == MATCH_CHAIN[this.network]) {
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
    computedBtnText() {
      if (this.account) {
        if (this.chainId != MATCH_CHAIN[this.network]) {
          return `Wrong Network`;
        }
        return this.account.substr(0, 4) + "..." + this.account.substr(-2);
      } else {
        return "Connect";
      }
    },
    openable() {
      return (
        this.contract &&
        this.account &&
        this.chainId == MATCH_CHAIN[this.network]
      );
    },
  },
  async created() {
    this.initAbi();

    const provider = await detectEthereumProvider();
    this.provider = provider;
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
</style>