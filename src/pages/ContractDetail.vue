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
      <b-tabs small pills content-class="mt-3">
        <b-tab title="Code" active>
          <b-row class="d-flex flex-wrap justify-content-between my-2">
            <b-col v-for="item in computedVerifyParams" :key="item.name" b-col sm="12" md="6">
              <span class="verify-params-name">{{ item.name }}</span>
              <b>{{ item.value }}</b>
            </b-col>
          </b-row>
          <code-text-area
            v-for="(item, index) in computedFiles"
            :key="item.path"
            :code="item"
            :index="index + 1"
            :total="computedFiles.length"
          />
        </b-tab>
        <b-tab v-if="contractCallEnable" title="Read">
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
        <b-tab v-if="contractCallEnable" title="Write">
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
        <b-tab v-if="proxyContract.isProxy" title="Read as Proxy">
          <div>
            ABI for the implemention contract at
            <address-link :address="proxyContract.implAddr" />
            <span v-if="proxyContract.implAddr !== proxyContract.prevImplAddr"
              >, Previously recorded to be on <address-link :address="proxyContract.prevImplAddr"
            /></span>
          </div>
          <b-button @click="connect" :variant="variantBtn" pill size="sm">
            {{ computedBtnText }}
          </b-button>
          <ContractReadFunction
            v-for="(item, index) in implReadAbi"
            :key="index"
            :abi="item"
            :contract="implContract"
            :open="implOpenable"
            :index="index + 1"
          />
        </b-tab>
        <b-tab v-if="proxyContract.isProxy" title="Write as Proxy">
          <div>
            ABI for the implemention contract at
            <address-link :address="proxyContract.implAddr" />
            <span v-if="proxyContract.implAddr !== proxyContract.prevImplAddr"
              >, Previously recorded to be on <address-link :address="proxyContract.prevImplAddr"
            /></span>
          </div>
          <b-button @click="connect" :variant="variantBtn" pill size="sm">
            {{ computedBtnText }}
          </b-button>
          <ContractWriteFunction
            v-for="(item, index) in implWriteAbi"
            :key="index"
            :abi="item"
            :contract="implContract"
            :open="implOpenable"
            :index="index + 1"
          />
        </b-tab>
      </b-tabs>
    </div>
    <span v-else class="d-flex justify-content-center">No Code.</span>
  </div>
</template>

<script>
import detectEthereumProvider from '@metamask/detect-provider';
import ContractReadFunction from './ContractReadFunction.vue';
import ContractWriteFunction from './ContractWriteFunction.vue';
import CodeTextArea from '@/components/CodeTextArea.vue';
import CopyData from '../components/CopyData.vue';
import { ethers } from 'ethers';
import AddressLink from '../components/AddressLink.vue';
import { mapActions, mapMutations, mapState } from 'vuex';
import { WalletBoardBus } from "@/WalletBoard"

export default {
  name: 'Contract',
  components: {
    ContractReadFunction,
    ContractWriteFunction,
    CodeTextArea,
    CopyData,
    AddressLink
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
    implFiles: {
      type: Array,
      default() {
        return [];
      },
    },
    address: {
      type: String,
      default: '',
    },
    proxyContract: {
      type: Object,
      default() {
        return {
          isProxy: false,
          proxyType: '',
          implAddr: '',
          prevImplAddr: '',
          adminAddr: '',
        };
      },
    },
    deployStatus: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      contract: null,
      abi: null,
      readAbi: [],
      writeAbi: [],
      bytecode: '',
      implAbi: null,
      implReadAbi: [],
      implWriteAbi: [],
      implContract: null,
    };
  },
  computed: {
    ...mapState('wallet', ['chainId', 'account', 'signer']),
    variantBtn() {
      if (this.account && this.chainId == this.currentChain.chainId) {
        return 'outline-success';
      } else {
        return 'outline-danger';
      }
    },
    computedFiles() {
      const files = [];
      for (const f of this.files) {
        if (f.name.includes('.sol')) {
          files.unshift(f);
        } else {
          files.push(f);
        }
      }
      return files;
    },
    computedVerifyParams() {
      const params = [];
      try {
        const metadata = this.files.find((f) => f.name === 'metadata.json');
        const jsonData = JSON.parse(metadata.content);
        const compilerVersion = jsonData.compiler.version;
        const settings = jsonData.settings;
        const contractName = Object.values(settings.compilationTarget)[0];
        const optimizationEnable = settings.optimizer.enabled
          ? `Yes with ${settings.optimizer.runs} runs`
          : `No with ${settings.optimizer.runs} runs`;
        const evmVersion = settings.evmVersion;

        params.push(
          {
            name: 'Contract Name: ',
            value: contractName,
          },
          {
            name: 'Optimization Enabled: ',
            value: optimizationEnable,
          },
          {
            name: 'Compiler Version: ',
            value: compilerVersion,
          },
          {
            name: 'EVM Version: ',
            value: evmVersion,
          }
        );
      } catch (e) {
        console.log('get verify params error', e.message);
      }

      return params;
    },
    computedBtnText() {
      if (this.account !== '0x') {
        if (this.chainId != this.currentChain.chainId) {
          return `Wrong Network`;
        }
        return `Connected: ` + this.account.substr(0, 4) + '...' + this.account.substr(-2);
      } else {
        return 'Connect to Web3';
      }
    },
    openable() {
      return this.contract && this.account && this.chainId == this.currentChain.chainId;
    },
    implOpenable() {
      return this.implContract && this.account && this.chainId == this.currentChain.chainId;
    },
    contractCallEnable() {
      return this.deployStatus !== 'selfDestructed';
    },
  },
  async created() {
    this.initAbi();
    this.initImplAbi();

    // const provider = await detectEthereumProvider();
    // this.provider = provider;

    // this.connect();

    if (!this.verified) {
      // this.getContractBytecode();
      this.emitImportApi();
    }
    if (this.verified && !this.files.length) {
      this.emitImportApi();
    }
  },
  watch: {
    async chainId(newVal, oldVal) {
      // if (!oldVal) {
      //   return;
      // }
      // this.removeAllListeners();
      // const provider = await detectEthereumProvider();
      // this.provider = provider;
      // this.connect();
    },
    signer(val) {
      if (val) {
        this.contract = new ethers.Contract(this.address, this.abi, val);
        if (this.implAbi) {
          this.implContract = new ethers.Contract(this.address, this.implAbi, val);
        }
      }
    },
    files() {
      this.initAbi();
    },
    implFiles(val) {
      this.initImplAbi();
    },
  },
  methods: {
    async emitImportApi() {
      console.log('emit import verified contract files');
      const res = await this.$api.known.emitImportApi(this.network, this.address);
      if (res && res.verified) {
        window.location.reload();
      } else {
        this.getContractBytecode();
      }
    },
    async getContractBytecode() {
      const data = await this.$api.contract.getContractBytecode(this.network, this.address);
      this.bytecode = data.contract.code;
    },
    initAbi() {
      if (!this.files.length) {
        return;
      }
      const readAbi = [];
      const writeAbi = [];
      const metadata = this.files.find((item) => item.name === 'metadata.json');
      const abi = JSON.parse(metadata.content).output.abi;
      for (const f of abi) {
        if (f.type === 'function') {
          if (f.stateMutability === 'view' || f.stateMutability === 'pure') {
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
    initImplAbi() {
      if (!this.implFiles.length) {
        this.implAbi = null;
        this.implReadAbi = [];
        this.implWriteAbi = [];
        return;
      }
      const readAbi = [];
      const writeAbi = [];
      const metadata = this.implFiles.find((item) => item.name === 'metadata.json');
      const abi = JSON.parse(metadata.content).output.abi;
      for (const f of abi) {
        if (f.type === 'function') {
          if (f.stateMutability === 'view' || f.stateMutability === 'pure') {
            readAbi.push(f);
          } else {
            writeAbi.push(f);
          }
        }
      }
      this.implAbi = abi;
      this.implReadAbi = readAbi;
      this.implWriteAbi = writeAbi;
    },
    connect() {
      WalletBoardBus.$emit('connect')
      // if (!this.signer) {
      //   return;
      // }
      // this.provider.on('chainChanged', this.chainChangedHandle);
      // this.provider.on('accountsChanged', this.accountsChangeHandle);

      // this.provider
      //   .request({ method: 'eth_requestAccounts' })
      //   .then((accounts) => {
      //     this.account = accounts[0];
      //     const signer = new ethers.providers.Web3Provider(this.provider).getSigner();
      //     this.contract = new ethers.Contract(this.address, this.abi, signer);
      //     if (this.implAbi) {
      //       this.implContract = new ethers.Contract(this.address, this.implAbi, signer);
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      // this.provider.request({ method: 'eth_chainId' }).then((chainId) => {
      //   this.chainId = chainId;
      // });
    },
    chainChangedHandle(chainId) {
      this.chainId = chainId;
    },
    accountsChangeHandle(accounts) {
      this.account = accounts[0];
    },
    removeAllListeners() {
      if (this.provider) {
        this.provider.removeListener('chainChanged', this.chainChangedHandle);
        this.provider.removeListener('accountsChanged', this.accountsChangeHandle);
      }
    },
  },
  beforeDestroy() {
    this.removeAllListeners();
  },
};
</script>

<style lang="scss" global>
.loading {
  opacity: 0.55;
  font-size: 14px;
  font-weight: bold;
}
.verify-params-name {
  color: '#77838f';
}
.btn.rounded-pill {
  border-radius: 0.75rem !important;
  padding-left: 0.3rem !important;
  padding-right: 0.3rem !important;
}
.nav-pills {
  .nav-item + .nav-item {
    margin-left: 8px;
  }
  .nav-item a {
    color: #192a56;
    justify-content: center;
    border-radius: 0.5rem;
    background-color: #e9ecef;
    padding: 4px 8px;
    &:hover {
      cursor: pointer;
      background-color: darken(#e9ecef, 10%);
      color: darken(#192a56, 10%);
    }
    &.active {
      font-weight: bold;
      color: #e9ecef;
      // border-bottom: 2px solid #003cb2;
      background-color: #003cb2;
      // border: 1px solid #ddd;
      // border-bottom: none;
      // border-radius: 5px 5px 0 0;
    }
  }
}
</style>
