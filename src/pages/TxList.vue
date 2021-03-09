<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    title="Transactions",
    :fields="txs.fields",
    :pagination="txs.pagination",
    :loadItems="loadTxs"
  )
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import { fromWei } from "@/utils";

export default {
  name: "TxList",
  components: {
    DataTableV2,
  },
  data() {
    return {
      txs: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "txhash", label: "Hash" },
          { key: "blocknum", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "from", label: "From" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" },
        ],
      },
    };
  },

  methods: {
    async loadTxs(network, page, limit) {
      const { txs, totalPage } = await this.$api.transaction.getRecentTxs(
        network,
        page,
        limit
      );
      const totalRows = totalPage * limit;
      const items = txs.map((tx) => {
        const totalAmount = fromWei(tx.totalClauseAmount, -1, tx.token);
        return {
          txhash: tx.hash,
          blocknum: tx.block.number,
          from: tx.origin,
          to: tx.tos && t.tos.length > 0 ? t.tos[0].address : "",
          amount: totalAmount,
          timestamp: tx.block.timestamp,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
