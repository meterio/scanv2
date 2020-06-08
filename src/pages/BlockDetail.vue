<template>
  <div class="block-detail">
    <b-container class="summary">
      <h2 class="title">Block / #788494</h2>

      <b-card>
        <b-row class="row" :key="index" v-for="(row, index) in summary_info">
          <b-col cols="2">
            <span class="label">{{ row.label }}</span>
          </b-col>
          <b-col cols="10">
            <span class="value">{{ row.value }}</span>
          </b-col>
        </b-row>
      </b-card>
    </b-container>

    <DataTable
      :title="transaction.title"
      :data="transaction.data"
      :pagination="transaction.pagination"
    >
      <template v-slot:cell(trx_hash)="data">
        <div class="dt-row">
          <a class="link" :href="data.value">{{ data.value }}</a>
        </div>
      </template>

      <template v-slot:cell(type)="data">
        <div class="dt-row">
          <b-badge pill variant="primary">{{ data.value }}</b-badge>
        </div>
      </template>

      <template v-slot:cell(result)="data">
        <div class="dt-row">
          <b-badge pill :variant="data.value">
            <b-icon :icon="resultIcon(data.value)"></b-icon>
            <span>{{ data.value }}</span>
          </b-badge>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
export default {
  name: "BlockDetail",
  components: {
    DataTable
  },
  methods: {
    resultIcon: function(result) {
      if (result === "success") {
        return "check";
      }

      if (result === "failed") {
        return "x";
      }
      return null;
    }
  },
  data() {
    return {
      summary_info: [
        {
          label: "Height",
          value: "78923"
        },
        {
          label: "Block Time",
          value: "13h ago ( 2020-05-01 07:47:22 )"
        },
        {
          label: "No of Transactions",
          value: "3"
        },
        {
          label: "Block Hash",
          value:
            "77F71E09756E38CA5FD928C933E98EAD92E8BAC7C8FEE36E615C24FFB18BDD6E"
        }
      ],

      transaction: {
        title: "Transactions",
        data: {
          fields: [
            {
              key: "trx_hash",
              label: "Trx Hash"
            },
            {
              key: "type",
              label: "Type"
            },
            {
              key: "height",
              label: "Height"
            },
            {
              key: "amount",
              label: "Amount"
            },
            {
              key: "fees",
              label: "Fees"
            },
            {
              key: "result",
              label: "Result"
            },
            {
              key: "time",
              label: "Time"
            }
          ],
          items: [
            {
              trx_hash: "asdhfak...1231dsaf",
              type: "Multisend",
              height: "123545",
              amount: "894.2 MTR",
              fees: "0.05 MTR",
              result: "success",
              time: "13h ago"
            },
            {
              trx_hash: "asdhfak...1231dsaf",
              type: "Multisend",
              height: "123545",
              amount: "894.2 MTR",
              fees: "0.05 MTR",
              result: "failed",
              time: "13h ago"
            }
          ]
        },
        pagination: {
          show: true,
          align: "center"
        }
      }
    };
  }
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
