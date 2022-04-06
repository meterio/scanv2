<template lang="pug">
.detail-page
  data-summary(
    :title="title",
    :data="addressInfo.summary",
    wide,
    isContract,
    :verifyStatus="verifyStatus"
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
          :verifyStatus="verifyStatus",
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
          isERC20: false,
          address: "0x",
          summary: [],
        };
      },
    },
  },
  computed: {
    isERC20() {
      return this.addressInfo.isERC20;
    },
    address() {
      return this.addressInfo.address;
    },
    title() {
      if (this.isERC20) {
        return `Token: ${this.address}`;
      } else {
        return `Contract: ${this.address}`;
      }
    },
    tabs() {
      if (this.isERC20) {
        return this.token_tabs;
      }
      return this.contract_tabs;
    },
    fields() {
      switch (this.loadTarget) {
        case "txs":
          return this.txs.fields;
        case "holders":
          return this.holders.fields;
      }
      return this.txs.fields;
    },
    pagination() {
      switch (this.loadTarget) {
        case "txs":
          return this.txs.pagination;
        case "holders":
          return this.holders.pagination;
      }
      return this.txs.pagination;
    },
    loadItems() {
      switch (this.loadTarget) {
        case "txs":
          return this.loadTxs;
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
      filesLoading: true,
      verifyStatus: null,
      files: [],
      contract_tabs: [{ name: "Transactions" }, { name: "Contract" }],
      token_tabs: [
        { name: "Transfers" },
        { name: "Holders" },
        { name: "Contract" },
      ],
      tabValue: 0,
      loadTarget: "txs",
      holders: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "fullAddress", label: "Holder Address" },
          { key: "balance", label: "Amount" },
          { key: "percentage", label: "Percentage" },
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
    };
  },
  async created() {
    this.getVerifyStatus();
  },
  watch: {
    address() {
      this.navTabChange(0);
      this.getVerifyStatus();
    },
  },
  methods: {
    async getVerifyStatus() {
      this.filesLoading = true;
      const data = {
        address: this.address,
      };
      const filesRes = await this.$api.verify.files(this.network, data);
      let verifyStatus = "not find";
      if (filesRes.data) {
        if (filesRes.data.status === "partial") {
          verifyStatus = "partial";
        } else {
          verifyStatus = "perfect";
        }
        this.files = filesRes.data.files;
      }
      this.verifyStatus = verifyStatus;
      this.filesLoading = false;
    },
    navTabChange(val) {
      this.tabValue = val;

      this.getLoadTarget(val);
    },
    getLoadTarget(val) {
      if (this.isERC20) {
        switch (val) {
          case 0:
            this.loadTarget = "txs";
            break;
          case 1:
            this.loadTarget = "holders";
            break;
          case 2:
            this.loadTarget = "contract";
            break;
          default:
            this.loadTarget = "txs";
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
      const items = holders.map((h) => {
        return {
          ...h,
          fullAddress: h.address,
          balance: {
            type: "amount",
            amount: h.balance,
            precision: 6,
            decimals: token.decimals || 18,
            token: h.symbol,
          },
          percentage: {
            type: "percentage",
            amount: h.percentage,
          },
        };
      });
      return { items, totalRows: token.holdersCount };
    },
    async loadTxs(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTxs(network, address, page, limit);
      const { txs, totalRows } = res;
      const items = txs.map((t) => {
        let direct = "";
        const fromAddr = t.from;
        const toAddr = t.to;
        const amount = t.mtr || t.mtrg;
        const token = 0;

        if (fromAddr === toAddr) {
          direct = "Self";
        } else if (fromAddr === address.toLowerCase()) {
          direct = "Out";
        } else {
          direct = "In";
        }

        console.log("direct = ", direct);

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
            amount: amount || t.totalClauseAmount,
            token: token < 0 ? t.token : token == 0 ? "MTR" : "MTRG",
            precision: 8,
          },
          timestamp: t.block.timestamp,
        };
      });
      console.log(items);
      return { items, totalRows };
    },
    async loadTxs20(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTxs20(
        network,
        address,
        page,
        limit
      );
      const { transfers, totalRows } = res;
      const items = transfers.map((t) => ({
        txhashWithStatus: {
          hash: t.txHash,
          status: t.reverted,
        },
        blocknum: t.block.number,
        from: t.from === this.addressInfo.address ? t.from : t.tokenAddress,
        to: t.to === this.addressInfo.address ? t.to : t.tokenAddress,
        direct: t.from === this.addressInfo.address ? "Out" : "In",
        amount: {
          type: "amount",
          amount: t.amount,
          token: t.symbol || "ERC20",
          precision: 8,
          decimals: t.decimals || 18,
        },
        timestamp: t.block.timestamp,
      }));
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
