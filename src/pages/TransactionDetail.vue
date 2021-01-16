<template>
  <div class="detail">
    <b-container class="summary">
      <h2 class="title">Transaction Details</h2>

      <b-card>
        <b-row class="row" :key="item.key" v-for="item in summary">
          <b-col cols="2">
            <span class="label">{{ item.key }}</span>
          </b-col>
          <b-col cols="10">
            <span v-if="!item.type" class="value">{{ item.value }}</span>
            <router-link
              :to="{ name: 'blockDetail', params: { revision: item.value } }"
              v-if="item.type === 'block-link'"
              >#{{ item.value }}</router-link
            >
            <router-link
              :to="{ name: 'address', params: { address: item.value } }"
              v-if="item.type === 'account-link'"
              >{{ item.value }}</router-link
            >

            <span v-if="item.type === 'status'">
              <StatusTag :status="item.value"></StatusTag>
            </span>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
    <div>
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
  </div>
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import { fromNow, formatTime } from "@/utils/time";
import { shortHash, shortAddress } from "@/utils/address";
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
export default {
  components: {
    DataTable,
    StatusTag,
  },
  data() {
    return {
      summary: {},
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
    this.summary = [
      { key: "Hash", value: summary.hash },
      { key: "Type", value: summary.type },
      { key: "Origin", value: summary.origin, type: "account-link" },
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

<style lang="scss" scoped>
.detail {
  margin-top: 30px;
}

.summary {
  .title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }
}
</style>
