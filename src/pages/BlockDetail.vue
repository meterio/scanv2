<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />
    <DataTable title="Transactions" :data="txs" :pagination="pagination">
      <template v-slot:cell(hash)="data">
        <div class="dt-row">
          <router-link
            class="link"
            :to="{
              name: 'txDetail',
              params: { hash: data.value },
            }"
            >{{ shortHash(data.value) }}</router-link
          >
        </div>
      </template>

      <template v-slot:cell(type)="data">
        <div class="dt-row">
          <b-badge pill variant="primary">{{ data.value }}</b-badge>
        </div>
      </template>

      <template v-slot:cell(result)="data">
        <div class="dt-row">
          <StatusTag :status="data.value"></StatusTag>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import StatusTag from "@/components/StatusTag.vue";
import BigNumber from "bignumber.js";
import DataSummary from "@/components/DataSummary.vue";
export default {
  name: "BlockDetail",
  components: {
    DataTable,
    StatusTag,
    DataSummary,
  },
  data() {
    return {
      loading: false,
      summaryTitle: "",
      summary: [],
      pagination: {
        show: true,
        align: "center",
      },
      txs: {
        fields: [
          { key: "hash", label: "Hash" },
          { key: "type", label: "Type" },
          { key: "amount", label: "Amount" },
          { key: "fee", label: "Fee" },
          { key: "result", label: "Result" },
        ],
        items: [],
      },
    };
  },
  methods: {
    async init() {
      const { revision } = this.$route.params;
      this.loading = true;
      const res = await this.$api.block.getBlockDetail(this.network, revision);
      const b = res.block;
      this.summaryTitle = `Block: #${b.number}`;
      this.summary = [
        { key: "Hash", value: b.hash },
        { key: "Number", value: b.number },
        { key: "Block Type", value: b.blockType === 1 ? "KBlock" : "MBlock" },
        { key: "KBlock Height", value: b.lastKBlockHeight, type: "block-link" },
        { key: "QC Height", value: b.qcHeight, type: "block-link" },
        { key: "Beneficiary", value: b.beneficiary, type: "address-link" },
        { key: "Gas Used", value: b.gasUsed },
        { key: "Txs Count", value: b.txCount },
        { key: "Time", value: b.timestamp, type: "timestamp" },
      ];

      let items = [];
      if (res.block.txSummaries) {
        items = res.block.txSummaries.map((tx) => {
          return {
            hash: tx.hash,
            type: tx.type,
            amount: tx.totalAmountStrs[0],
            fee: tx.feeStr,
            result: tx.reverted ? "reverted" : "success",
          };
        });
      }
      this.txs.items = items;
      this.loading = false;
    },
  },
};
</script>


