<template>
  <div class="my-2">
    <b-tabs content-class="mt-3">
      <b-tab title="Code" active>
        <b-form @submit.prevent>
          <b-form-group
            v-for="item in computedFiles"
            :label="item.name"
            :key="item.path"
          >
            <b-form-textarea
              :value="item.content"
              type="text"
              placeholder=""
              :rows="item.rows"
              required
            ></b-form-textarea>
          </b-form-group>
        </b-form>
      </b-tab>
      <b-tab title="Read">
        <b-button @click="connect" variant="light" pill size="sm">
          {{ computedBtnText }}
        </b-button>
        <ContractReadFunction
          v-for="item in readAbi"
          :key="item.name"
          :abi="item"
          :contract="contract"
        />
      </b-tab>
      <b-tab title="Write">
        <b-button @click="connect" variant="light" pill size="sm">
          {{ computedBtnText }}
        </b-button>
        <ContractWriteFunction
          v-for="item in writeAbi"
          :key="item.name"
          :abi="item"
          :contract="contract"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import detectEthereumProvider from "@metamask/detect-provider";
import ContractReadFunction from "./ContractReadFunction.vue";
import ContractWriteFunction from "./ContractWriteFunction.vue";
import { ethers } from "ethers";

export default {
  name: "Contract",
  components: {
    ContractReadFunction,
    ContractWriteFunction,
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
      abi: null,
      readAbi: [],
    };
  },
  computed: {
    computedFiles() {
      return this.files.map((item) => {
        let rows = 2;
        if (item.content.includes("\n")) {
          rows = item.content.split("\n").length;
        } else {
          rows = Math.ceil(item.content.length / 100);
        }
        return {
          ...item,
          rows,
        };
      });
    },
    computedBtnText() {
      if (this.account) {
        return this.account.substr(0, 4) + "..." + this.account.substr(-2);
      } else {
        return "Connect";
      }
    },
  },
  async created() {
    console.log("file", this.files);
    const readAbi = [];
    const writeAbi = [];
    const metadata = this.files.find((item) => item.name === "metadata.json");
    const abi = JSON.parse(metadata.content).output.abi;
    for (const f of abi) {
      if (f.type === "function") {
        console.log(f);
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
    const provider = await detectEthereumProvider();
    this.provider = provider;
  },
  methods: {
    connect() {
      if (!this.provider) {
        return;
      }

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
    },
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