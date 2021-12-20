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
          { key: "methodName", label: "Method" },
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
      const { txs, totalRows } = await this.$api.transaction.getRecentTxs(
        network,
        page,
        limit
      );
      const items = txs.map((tx) => {
        let methodName = '';
        if (tx.knowMethod) {
          if (tx.knowMethod.abi) {
            methodName = JSON.parse(tx.knowMethod.abi).name;
          } else {
            methodName = tx.knowMethod.signature
          }
        }

        return {
          txhash: tx.hash,
          methodName,
          blocknum: tx.block.number,
          from: tx.origin,
          to: tx.majorTo,
          amount: {
            type: "amount",
            amount: tx.totalClauseAmount,
            precision: 6,
            token: tx.token,
          },
          timestamp: tx.block.timestamp,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
