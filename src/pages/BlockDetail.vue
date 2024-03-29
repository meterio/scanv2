<template>
  <div class="detail-page">
    <DataSummary :data="summary" title="Block" :titleValue="summaryTitleValue" />
    <DataTableV2 title="Transactions" :fields="txs.fields" :items="txs.items" :pagination="txs.pagination">
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
import DataTableV2 from '@/components/DataTableV2.vue';
import StatusTag from '@/components/StatusTag.vue';
import DataSummary from '@/components/DataSummary.vue';
import BigNumber from 'bignumber.js';
export default {
  name: 'BlockDetail',
  components: {
    DataTableV2,
    StatusTag,
    DataSummary,
  },
  data() {
    return {
      loading: false,
      summaryTitleValue: '',
      summary: [],
      txs: {
        pagination: { show: true, align: 'center', perPage: 10 },
        fields: [
          { key: 'hash', label: 'Hash' },
          { key: 'method', label: 'Method' },
          { key: 'amount', label: 'Amount' },
          { key: 'fee', label: 'Fee' },
          { key: 'clauseCount', label: 'nClause' },
          { key: 'result', label: 'Result' },
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
      this.summaryTitleValue = `${b.number}`;
      if (b) {
        this.summary = [
          { key: 'Hash', value: b.hash },
          { key: 'Number', value: b.blockType + ' ' + b.number },
          { key: 'Timestamp', value: b.timestamp, type: 'full-timestamp' },
          { key: 'QC', value: b.qcHeight, type: 'block-link' },
          // { key: 'Block Type', value:  },
          { key: 'Epoch / KBlock', epoch: b.epoch, kblock: b.lastKBlockHeight, type: 'epoch-kblock-link' },
          // {
          //   key: 'KBlock Height',
          //   value: b.lastKBlockHeight,
          //   type: 'block-link',
          // },
          {
            key: 'Proposer',
            value: { address: b.beneficiary, name: b.beneficiaryName },
            type: 'address-or-name-link',
          },
          { key: 'Gas Used', value: b.gasUsed },
          { key: 'Txs Count', value: b.txCount },
          { key: 'Parent Hash', value: b.parentID, type: 'block-hash' },
          { key: 'State Root', value: b.stateRoot },
          // {
          //   key: 'Reward',
          //   value: b.actualReward,
          //   type: 'amount',
          //   precision: -1,
          //   token: this.currentChain.symbol,
          // },
        ];
      }
      let items = [];
      if (res.block.txSummaries) {
        items = res.block.txSummaries.map((tx) => {
          let totalClauseAmount = new BigNumber(0);
          if (tx.clauses) {
            for (const c of tx.clauses) {
              totalClauseAmount = totalClauseAmount.plus(c.value);
            }
          }
          return {
            hash: tx.hash,
            method: tx.selector,
            amount: {
              type: 'amount',
              amount: totalClauseAmount.toFixed(),
              token: tx.token,
              precision: 8,
            },
            fee: {
              type: 'amount',
              amount: tx.paid,
              token: this.currentChain.symbol,
              precision: 8,
            },
            result: tx.reverted ? 'reverted' : 'success',
            clauseCount: tx.clauseCount,
          };
        });
      }
      this.txs.items = items;
      this.loading = false;
    },
  },
};
</script>
