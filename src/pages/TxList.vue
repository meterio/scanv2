<template lang="pug">
.detail-page
  data-table.mt-2pert.px-0(
    title="Transactions",
    :data="txs",
    :loading="txs_load",
    :pagination="txs.pagination",
    :paginateTotal="paginateTotal",
    :paginateCurrentPage="page",
    @tablePaginationChange="pgChange"
  )
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
export default {
  name: "Address",
  components: {
    DataTable,
    NavTabs,
    DataSummary,
  },
  data() {
    return {
      paginateTotal: 0,
      txs_load: true,
      page: 1,
      limit: 20,
      txs: {
        pagination: {
          show: true,
          align: "center",
          perPage: 8,
        },
        fields: [
          { key: "txhash", label: "Hash" },
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

  methods: {
    init() {
      this.loadTxs();
    },
    pgChange(val) {
      this.page = val;
      this.loadTxs();
    },
    async loadTxs() {
      this.txs_load = true;
      try {
        const { address } = this.$route.params;
        this.txs.items = [];
        const { txs, totalPage } = await this.$api.transaction.getRecentTxs(
          this.network,
          this.page,
          this.limit
        );
        this.paginateTotal = totalPage * this.limit;
        for (const t of txs) {
          this.txs.items.push({
            txhash: t.hash,
            blocknum: t.block.number,
            from: t.origin,
            to: t.tos && t.tos.length > 0 ? t.tos[0].address : "nobody",
            amount: t.totalAmountStrs[0],
            timestamp: t.block.timestamp,
          });
        }
        this.txs_load = false;
      } catch (e) {
        this.txs_load = false;
      }
    },
  },
};
</script>
