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
        let methodName = tx.method;
        if (String(tx.method).includes("(")) {
          const index = String(tx.method).indexOf("(");
          methodName = String(tx.method).substring(0, index);
        }
        return {
          txhash: tx.txHash,
          methodName,
          blocknum: tx.block.number,
          from: {
            address: tx.from,
            isContract: tx.fromIsContract
          },
          to: {
            address: tx.to,
            isContract: tx.toIsContract
          },
          amount: {
            type: "amount",
            amount: tx.mtr || tx.mtrg,
            precision: 6,
            token: tx.mtrg !== "" ? this.currentChain.gSymbol : this.currentChain.symbol,
          },
          timestamp: tx.block.timestamp,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
