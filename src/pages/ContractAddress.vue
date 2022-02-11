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
        contract-detail(:files="files")
</template>

<script>
import DataTableV3 from "@/components/DataTableV3.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
import ContractDetail from "./ContractDetail.vue";
export default {
  name: "ContractAddress",
  components: {
    DataTableV3,
    NavTabs,
    DataSummary,
    ContractDetail,
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
    title() {
      const { isERC20, address } = this.addressInfo;
      if (isERC20) {
        return `Token: ${address}`;
      } else {
        return `Contract: ${address}`;
      }
    },
    tabs() {
      return this.contract_tabs;
    },
    fields() {
      switch (this.loadTarget) {
        // case "transfers":
        // return this.transfers.fields;
        case "txs":
          return this.txs.fields;
        case "holders":
          return this.holders.fields;
      }
      return this.txs.fields;
    },
    pagination() {
      switch (this.loadTarget) {
        // case "transfers":
        // return this.transfers.pagination;
        case "txs":
          return this.txs.pagination;
        case "holders":
          return this.holders.pagination;
      }
      return this.txs.pagination;
    },
    loadItems() {
      switch (this.loadTarget) {
        // case "transfers":
        // return this.loadTransfers;
        case "txs":
          return this.loadTxs;
        case "holders":
          return this.loadHolders;
      }
      return this.loadTxs;
    },
    isTableData() {
      console.log("loadTarget", this.loadTarget);
      if (this.loadTarget === "contract") {
        return false;
      }

      return true;
    },
  },
  data() {
    return {
      verifyStatus: null,
      files: [],
      contract_tabs: [
        // { name: "Transfers" },
        { name: "Transactions" },
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
    "addressInfo.address"() {
      this.navTabChange(0);
      this.getVerifyStatus();
    },
  },
  methods: {
    async getVerifyStatus() {
      const data = {
        address: this.addressInfo.address,
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
    },
    navTabChange(val) {
      this.tabValue = val;
      switch (val) {
        // case 0:
        // this.loadTarget = "transfers";
        // break;
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
    },
    async loadHolders(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getHolders(network, address, page, limit);
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
      return { items, totalRows: items.length };
    },

    async loadTransfers(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTransfers(
        network,
        address,
        page,
        limit
      );
      const { transfers, totalRows } = res;
      const items = transfers.map((t) => {
        let direct = "";
        if (t.from.toLowerCase() === t.to.toLowerCase()) {
          direct = "Self";
        } else {
          direct =
            t.to.toLowerCase() === this.addressInfo.address.toLowerCase()
              ? "In"
              : "Out";
        }
        let decimals = 18;
        let from = t.from;
        let to = t.to;
        if (t.erc20 && t.erc20.address) {
          decimals = t.erc20.decimals || 18;
          if (from === "0x0000000000000000000000000000000000000000") {
            from = t.tokenAddress;
          }
          if (to === "0x0000000000000000000000000000000000000000") {
            to = t.tokenAddress;
          }
        }
        return {
          from: from,
          direct,
          to: to,
          amount: {
            type: "amount",
            amount: t.amount,
            token: t.token,
            precision: 8,
            decimals,
          },
          txhashWithStatus: {
            hash: t.txHash,
            status: t.reverted,
          },
          blockNum: t.block.number,
          timestamp: t.block.timestamp,
        };
      });
      return { items, totalRows };
    },
    async loadTxs(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTxs(network, address, page, limit);
      const { txSummaries, totalRows } = res;
      const items = txSummaries.map((t) => {
        let direct = "";
        let fromAddr = t.origin;
        let toAddr = t.majorTo;
        let amount = t.value;
        let token = 0;

        const { relatedTransfers } = t;
        let relatedTransfer;
        if (relatedTransfers && relatedTransfers.length >= 1) {
          for (const tr of relatedTransfers) {
            console.log("TR:", tr);
            if (
              tr.sender.toLowerCase() ===
                this.addressInfo.address.toLowerCase() ||
              tr.recipient.toLowerCase() ===
                this.addressInfo.address.toLowerCase()
            ) {
              relatedTransfer = tr;
              break;
            }
          }
          if (!relatedTransfer) {
            relatedTransfer = relatedTransfers[0];
          }
        }
        if (relatedTransfer) {
          fromAddr = relatedTransfer.sender;
          toAddr = relatedTransfer.recipient;
          amount = relatedTransfer.amount;
          token = relatedTransfer.token;
        }

        if (
          t.clauseCount === 1 &&
          t.origin.toLowerCase() === t.majorTo.toLowerCase()
        ) {
          direct = "Self";
        } else {
          if (fromAddr === address.toLowerCase()) {
            direct = "Out";
          } else if (toAddr === address.toLowerCase()) {
            direct = "In";
          } else {
            direct = "Transfer";
          }
        }
        console.log("direct = ", direct);

        let methodName = "";
        if (t.knowMethod) {
          if (t.knowMethod.abi) {
            methodName = JSON.parse(t.knowMethod.abi).name;
          } else {
            methodName = t.knowMethod.signature;
          }
        }

        return {
          txhashWithStatus: {
            hash: t.hash,
            status: t.reverted,
          },
          methodName,
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
}
</style>
