<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />
    <DataTableV2
      title="Transactions"
      :fields="txs.fields"
      :items="txs.items"
      :pagination="txs.pagination"
    >
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
    </DataTableV2>
  </div>
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import StatusTag from "@/components/StatusTag.vue";
import DataSummary from "@/components/DataSummary.vue";
export default {
  name: "BlockDetail",
  components: {
    DataTableV2,
    StatusTag,
    DataSummary,
  },
  data() {
    return {
      loading: false,
      summaryTitle: "",
      summary: [],
      txs: {
        pagination: { show: true, align: "center", perPage: 10 },
        fields: [
          { key: "hash", label: "Hash" },
          { key: "type", label: "Type" },
          { key: "amount", label: "Amount" },
          { key: "fee", label: "Fee" },
          { key: "clauseCount", label: "nClause" },
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
      if (!!b) {
        this.summary = [
          { key: "Hash", value: b.hash },
          { key: "Number", value: b.number },
          { key: "Block Type", value: b.blockType === 1 ? "KBlock" : "MBlock" },
          { key: "Epoch", value: b.epoch },
          {
            key: "KBlock Height",
            value: b.lastKBlockHeight,
            type: "block-link",
          },
          { key: "QC Height", value: b.qcHeight, type: "block-link" },
          {
            key: "Proposer",
            value: { address: b.beneficiary, name: b.beneficiaryName },
            type: "address-or-name-link",
          },
          { key: "Gas Used", value: b.gasUsed },
          {
            key: "Reward",
            value: b.actualReward,
            type: "amount",
            precision: -1,
            token: "MTR",
          },
          { key: "Txs Count", value: b.txCount },
          { key: "Time", value: b.timestamp, type: "timestamp" },
        ];
      }
      let items = [];
      if (res.block.txSummaries) {
        items = res.block.txSummaries.map((tx) => {
          return {
            hash: tx.hash,
            type: tx.type,
            amount: {
              type: "amount",
              amount: tx.totalClauseAmount,
              token: tx.token,
              precision: 8,
            },
            fee: {
              type: "amount",
              amount: tx.paid,
              token: "MTR",
              precision: 8,
            },
            result: tx.reverted ? "reverted" : "success",
            clauseCount: tx.clauseCount,
          };
        });
      }
      console.log(items);
      this.txs.items = items;
      this.loading = false;
    },
  },
};
</script>
