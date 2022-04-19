<template lang="pug">
.detail-page
  data-summary(
    :title="title",
    :data="addressInfo.summary",
    wide,
    isContract,
    :verified="verified"
    :verifiedDesc="verifiedDesc"
  )

  b-container.summary
    .mt-2pert.px-5
    data-table-v3.mt-2pert.px-0(
      :isTableData="isTableData",
      :loadItems="loadItems",
      :fields="fields",
      :pagination="pagination",
      :key="loadTarget"
    )
      div(slot="header")
        nav-tabs.px-0(
          :tabs="tabs",
          :value="tabValue",
          :verified="verified",
          @changeTab="navTabChange"
        )
      div(slot="otherData")
        <div class="loading" v-if="filesLoading">
          <div class="text-center text-primary my-2">
            b-spinner.align-middle.mr-2
            strong Loading...
          </div>
        </div>
        contract-detail(v-else, :files="files", :address="addressInfo.address")
</template>

<script>
import DataTableV3 from "@/components/DataTableV3.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
import ContractDetail from "./ContractDetail.vue";
import Loading from "@/components/Loading.vue";
export default {
  name: "ContractAddress",
  components: {
    DataTableV3,
    NavTabs,
    DataSummary,
    ContractDetail,
    Loading,
  },
  props: {
    addressInfo: {
      type: Object,
      default() {
        return {
          isContract: true,
          tokenType: '',
          address: "0x",
          summary: [],
        };
      },
    },
    contractDataCount: {
      type: Object,
      required: true,
    }
  },
  computed: {
    isToken() {
      if (['ERC20', 'ERC721', 'ERC1155'].includes(this.addressInfo.tokenType)) {
        return true
      }
      return false
    },
    address() {
      return this.addressInfo.address;
    },
    verified() {
      return this.addressInfo.verified;
    },
    verifiedDesc() {
      return this.addressInfo.verifiedDesc;
    },
    title() {
      if (this.isToken) {
        return `Token: ${this.address}`;
      } else {
        return `Contract: ${this.address}`;
      }
    },
    tabs() {
      if (this.isToken) {
        return [
          { name: this.contractDataCount.transfersCount > 0 ? `Transfers(${this.contractDataCount.transfersCount})` : 'Transfers' },
          { name: this.contractDataCount.holdersCount > 0 ? `Holders(${this.contractDataCount.holdersCount})` : 'Holders' },
          { name: "Contract" },
        ];
      }
      return [
        { name: this.contractDataCount.txCount > 0 ? `Transactions(${this.contractDataCount.txCount})` : 'Transactions' },
        { name: "Contract" }
      ];
    },
    fields() {
      switch (this.loadTarget) {
        case "txs":
          return this.txs.fields;
        case "transfers":
          return this.transfers.fields;
        case "holders":
          return this.holders.fields;
      }
      return this.txs.fields;
    },
    pagination() {
      switch (this.loadTarget) {
        case "txs":
          return this.txs.pagination;
        case "transfers":
          return this.transfers.pagination;
        case "holders":
          return this.holders.pagination;
      }
      return this.txs.pagination;
    },
    loadItems() {
      switch (this.loadTarget) {
        case "txs":
          return this.loadTxs;
        case "transfers":
          return this.loadTransfers;
        case "holders":
          return this.loadHolders;
      }
      return this.loadTxs;
    },
    isTableData() {
      if (this.loadTarget === "contract") {
        return false;
      }

      return true;
    },
  },
  data() {
    return {
      filesLoading: false,
      files: [],
      tabValue: 0,
      loadTarget: "transfers",
      holders: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "rank", label: "Rank" },
          { key: "fullAddress", label: "Address" },
          { key: "balance", label: "Balance" },
        ],
      },
      txs: {
        pagination: {
          show: true,
          align: "center",
          perPage: 20,
        },
        fields: [
          { key: "txhashWithStatus", label: "Hash" },
          { key: "methodName", label: "Method" },
          { key: "blocknum", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "from", label: "From" },
          { key: "direct", label: "" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" },
        ],
        items: [],
      },
      transfers: {
        pagination: {
          show: true,
          align: "center",
          perPage: 20,
        },
        fields: [
          { key: "txhashWithStatus", label: "Hash" },
          { key: "blocknum", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "from", label: "From" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" },
        ],
        items: [],
      },
    };
  },
  watch: {
    address() {
      this.getContractFiles();
    },
  },
  created() {
    this.getLoadTarget();
    this.getContractFiles();
  },
  methods: {
    async getContractFiles() {
      this.filesLoading = true;
      const { files } = await this.$api.contract.getContractFiles(this.network, this.address);
      this.files = files;

      this.filesLoading = false;
    },
    navTabChange(val) {
      this.tabValue = val;

      this.getLoadTarget(val);
    },
    getLoadTarget(val) {
      if (this.isToken) {
        switch (val) {
          case 0:
            this.loadTarget = "transfers";
            break;
          case 1:
            this.loadTarget = "holders";
            break;
          case 2:
            this.loadTarget = "contract";
            break;
          default:
            this.loadTarget = "transfers";
        }
      } else {
        switch (val) {
          case 0:
            this.loadTarget = "txs";
            break;
          case 1:
            this.loadTarget = "contract";
            break;
          default:
            this.loadTarget = "txs";
        }
      }
    },
    async loadHolders(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getHolders(
        network,
        address,
        page,
        limit
      );
      const { holders, token } = res;
      const pageNum = page ? Number(page) : 1;
      const limitNum = limit ? Number(limit) : 10;
      const items = holders.map((h, index) => {
        return {
          ...h,
          rank: index + 1 + (pageNum - 1) * limitNum,
          fullAddress: h.address,
          balance: {
            type: "amount",
            amount: h.balance,
            precision: 6,
            decimals: token.decimals || 18,
            token: token.symbol,
          },
        };
      });
      return { items, totalRows: token.holdersCount };
    },
    async loadTxs(network, page, limit) {
      console.log("LOAD TXS");
      const { address } = this.$route.params;
      const res = await this.$api.account.getTxs(network, address, page, limit);
      const { txs, totalRows } = res;
      const items = txs.map((t) => {
        let direct = "";
        const fromAddr = t.from;
        const toAddr = t.to;
        let amount = t.mtr;

        let token = this.currentChain.symbol;
        if (t.mtrg !== '0') {
          amount = t.mtrg;
          token = this.currentChain.gSymbol;
        }

        if (fromAddr === toAddr) {
          direct = "Self";
        } else if (fromAddr === address.toLowerCase()) {
          direct = "Out";
        } else {
          direct = "In";
        }

        // console.log('direct = ', direct);

        return {
          txhashWithStatus: {
            hash: t.txHash,
            status: t.reverted,
          },
          methodName: t.method,
          blocknum: t.block.number,
          from: fromAddr,
          direct,
          to: toAddr || "nobody",
          amount: {
            type: "amount",
            amount: amount,
            token: token,
            precision: 8,
          },
          timestamp: t.block.timestamp,
        };
      });
      console.log(items);
      return { items, totalRows };
    },

    async loadTransfers(network, page, limit) {
      console.log("LOAD TRANSFERS");
      const { address } = this.$route.params;
      const res = await this.$api.account.getTransfers(
        network,
        address,
        page,
        limit
      );
      const { transfers, totalRows, contract } = res;
      const items = transfers.map((t) => {
        return {
          txhashWithStatus: {
            hash: t.txHash,
            status: false,
          },
          methodName: t.method,
          blocknum: t.block.number,
          from: t.from,
          to: t.to,
          amount: {
            type: "amount",
            amount: t.amount,
            token: contract.symbol,
            decimals: contract.decimals,
            precision: 8,
          },
          timestamp: t.block.timestamp,
        };
      });
      console.log(items);
      return { items, totalRows };
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }
  .mt-2pert {
    margin-top: 2.6%;
  }
  .loading {
    opacity: 0.55;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
