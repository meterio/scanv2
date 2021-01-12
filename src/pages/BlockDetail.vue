<template>
  <div class="block-detail">
    <b-container class="summary">
      <h2 class="title">Block #{{ block.Number }}</h2>

      <b-card>
        <b-row class="row" :key="value" v-for="(value, key) in block">
          <b-col cols="2">
            <span class="label">{{ key }}</span>
          </b-col>
          <b-col cols="10">
            <span class="value">{{ value }}</span>
          </b-col>
        </b-row>
      </b-card>
    </b-container>

    <DataTable title="Transaction" :data="txs.data" :pagination="pagination">
      <template v-slot:cell(hash)="data">
        <div class="dt-row">
          <router-link
            class="link"
            :to="{ name: 'txDetail', params: { hash: data.value } }"
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
import { fromNow, formatTime } from "@/utils/time";
import { shortHash, shortAddress } from "@/utils/address";
import BigNumber from "bignumber.js";
export default {
  name: "BlockDetail",
  components: {
    DataTable,
    StatusTag,
  },
  data() {
    return {
      block: {},
      pagination: {
        show: true,
        align: "center",
      },
      txs: {
        data: {
          fields: [
            {
              key: "hash",
              label: "Hash",
            },
            {
              key: "type",
              label: "Type",
            },
            {
              key: "amount",
              label: "Amount",
            },
            {
              key: "fee",
              label: "Fee",
            },
            {
              key: "result",
              label: "Result",
            },
          ],
          items: [],
        },
      },
    };
  },
  async mounted() {
    const { revision } = this.$route.params;
    const res = await this.$api.block.getBlockDetail(revision);
    this.loading = false;
    const b = res.block;
    this.block = {
      Hash: b.hash,
      Number: b.number,
      "Block Type": b.blockType === 1 ? "KBlock" : "MBlock",
      Epoch: b.epoch,
      "KBlock Height": b.lastKBlockHeight,
      "QC Height": b.qcHeight,
      Signer: b.signer,
      "Gas Used": b.gasUsed,
      "No. of Transactions": b.txCount,
      Timestamp:
        fromNow(b.timestamp * 1000) +
        " (" +
        formatTime(b.timestamp * 1000) +
        ")",
    };
    let items = [];
    if (res.block.txSummaries) {
      items = res.block.txSummaries.map((tx) => {
        return {
          hash: tx.hash,
          type: tx.type,
          amount: tx.amountStr,
          fee: tx.feeStr,
          result: tx.reverted ? "reverted" : "success",
        };
      });
    }
    this.txs.data.items = items;
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
.block-detail {
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
