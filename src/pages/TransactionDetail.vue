<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />

    <DataTable title="Clauses" :data="clauses.data">
      <template v-slot:cell(to)="data">
        <div class="dt-row">
          <router-link
            class="link"
            :to="{ name: 'address', params: { address: data.value } }"
            >{{ data.value }}</router-link
          >
        </div>
      </template>

      <template v-slot:cell(data)="data">
        <div style="word-break: break-all">
          {{ data.value }}
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import { fromNow, formatTime, shortHash, shortAddress } from "@/utils";
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
import DataSummary from "@/components/DataSummary.vue";

export default {
  components: {
    DataSummary,
    DataTable,
  },
  data() {
    return {
      summaryTitle: "",
      summary: [],
      tx: {},
      clauses: {
        data: {
          fields: [
            { key: "index", label: "Index" },
            { key: "to", label: "To" },
            { key: "amount", label: "Amount" },
            { key: "data", label: "Data" },
          ],
          items: [],
        },
      },
    };
  },
  async mounted() {
    const { hash } = this.$route.params;
    const res = await this.$api.transaction.getTxDetail(hash);
    this.loading = false;
    const { tx, summary } = res;
    this.summaryTitle = "Transaction";
    this.summary = [
      { key: "Hash", value: summary.hash },
      { key: "Type", value: summary.type },
      { key: "Origin", value: summary.origin, type: "address-link" },
      { key: "Amount", value: summary.totalAmountStrs[0] },
      { key: "Fee", value: summary.feeStr },
      {
        key: "Result",
        value: summary.reverted ? "reverted" : "success",
        type: "status",
      },
      { key: "Clause Count", value: summary.clauseCount },
      { key: "Block", value: summary.block.number, type: "block-link" },
    ];
    this.tx = tx;
    let clauses = [];
    if (tx.clauseCount > 0) {
      let index = 1;
      clauses = tx.clauses.map((c) => {
        const amount = new BigNumber(c.value).dividedBy(1e18).toFixed();
        return {
          ...c,
          amount: `${amount} ${c.token}`,
          index: index++,
        };
      });
    }
    this.clauses.data.items = clauses;
  },
  methods: {
    timeFromNow(time) {
      return fromNow(time * 1000);
    },
    address(addr) {
      return shortAddress(addr);
    },
    shortHash(hash) {
      return shortHash(hash);
    },
  },
};
</script>
