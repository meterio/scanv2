<template>
  <b-container>
    <h2 class="title">Validator Detail</h2>
    <b-card class="summary">
      <b-row>
        <b-col cols="6" class="info">
          <p class="label mb-0">Name</p>
          <h3 class="title">{{ validator.name }}</h3>
          <div>{{ validator.description }}</div>
          <b-row class="address">
            <b-col>
              <p class="label">Address</p>
              {{ validator.address }}
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="6">
          <b-row>
            <b-col cols="4">
              <pie-chart
                v-if="chart_load"
                :chart-data="delegated_chart.data"
                :options="delegated_chart.options"
              ></pie-chart>
            </b-col>
            <b-col cols="8" class="pt-3">
              <label
                >Total Votes: {{ delegated_chart_legend.total }}
                <span>VERSE</span></label
              >

              <b-row>
                <b-col cols="12" class="d-flex justify-content-between">
                  <span>Self: </span>
                  <span class="percent">
                    <amount-tag
                      :amount="delegated_chart_legend.self"
                      token="VERSE"
                      :precision="precision"
                    />
                    ({{ delegated_chart_legend.selfRatio }})</span
                  >
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12" class="d-flex justify-content-between">
                  <span>Others</span>
                  <span class="percent">
                    <amount-tag
                      :amount="delegated_chart_legend.others"
                      token="VERSE"
                      :precision="precision"
                    />
                    ({{ delegated_chart_legend.othersRatio }})</span
                  >
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>

    <b-row>
      <b-col cols="12" xl="6" class="no-padding">
        <DataTable
          :title="delegators.title"
          :data="delegators.data"
          :pagination="delegators.pagination"
          :paginateTotal="delegators.total"
          :paginateCurrentPage="delegators_current"
          @tablePaginationChange="delegatorPaginationChange"
          min-height="200px"
        >
        </DataTable>
      </b-col>

      <b-col cols="12" xl="6" class="no-padding">
        <DataTable
          :title="votes.title"
          :data="votes.data"
          :pagination="votes.pagination"
          min-height="200px"
          :paginateTotal="votes.total"
          :paginateCurrentPage="votes_current"
          @tablePaginationChange="votePaginationChange"
        >
          <template v-slot:cell(id)="data">
            <div class="dt-row">
              {{ shortHash(data.value, 10) }}
            </div>
          </template>
        </DataTable>
      </b-col>
    </b-row>

    <b-row>
      <DataTableV2
        :title="proposed.title"
        :fields="proposed.fields"
        :pagination="proposed.pagination"
        :loadItems="loadProposed"
      >
        <template v-slot:cell(block_hash)="data">
          <div class="dt-row">
            <router-link
              :to="{
                name: 'blockDetail',
                params: { revision: data.value },
              }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>
      </DataTableV2>
    </b-row>
  </b-container>
</template>

<script>
import PieChart from "@/charts/PieChart.js";
import DataTable from "@/components/DataTable.vue";
import DataTableV2 from "@/components/DataTableV2.vue";
import BigNumber from "bignumber.js";
import AmountTag from "@/components/AmountTag.vue";

export default {
  name: "ValidatorDetail",
  components: {
    PieChart,
    DataTable,
    DataTableV2,
    AmountTag,
  },
  data() {
    return {
      precision: 2,
      delegators_current: 1,
      delegators_array: [],
      votes_current: 1,
      votes_array: [],
      chart_load: false,
      load: true,
      current_page: 1,
      validator: {
        name: "",
        description: "",
        address: "0x",
      },
      mainProps: {
        blank: true,
        blankColor: "#777",
        width: 100,
        height: 100,
        class: "m1",
      },
      delegated_chart_legend: {
        total: "",
        self: "0",
        selfRatio: "0%",
        others: "0",
        othersRatio: "0%",
      },
      delegated_chart: {
        options: {
          legend: {
            display: false,
          },
        },
        data: {
          labels: ["Self", "Others"],
          datasets: [],
        },
      },
      delegators: {
        title: "Delegators",
        total: 0,
        data: {
          fields: [
            { key: "address", label: "Delegator" },
            { key: "amount", label: "Amount" },
            { key: "percent", label: "Share" },
          ],
          items: [],
        },
        pagination: { show: true, align: "center", perPage: 3 },
      },
      votes: {
        title: "Votes",
        total: 0,
        data: {
          fields: [
            { key: "bucketid", label: "Bucket ID" },
            { key: "address", label: "Voter" },
            { key: "value", label: "Amount" },
            { key: "timestamp", label: "Time" },
          ],
          items: [],
        },
        pagination: { show: true, align: "center", perPage: 3 },
      },
      proposed: {
        title: "Proposed Blocks",
        fields: [
          { key: "number", label: "Height" },
          { key: "blockhash", label: "Block Hash" },
          { key: "txCount", label: "Txs" },
          { key: "reward", label: "Reward" },
          { key: "timestamp", label: "Time" },
        ],
        pagination: { show: true, align: "center", perPage: 8 },
      },
    };
  },
  methods: {
    async init() {
      this.loadInfo();
      this.loadVotes();
      this.loadDelegators();
    },
    proposedChange(val) {
      this.current_page = val;
      this.loadProposed();
    },
    async loadInfo() {
      const { address } = this.$route.params;
      const res = await this.$api.validator.getValidator(this.network, address);
      const { validator } = res;
      this.validator = validator;
    },
    async loadVotes() {
      const { address } = this.$route.params;
      const res = await this.$api.validator.getVotes(this.network, address);
      this.chart_load = false;
      const { votes } = res;
      this.votes_array = votes.map((v) => ({
        ...v,
        bucketid: v.id,
        value: { type: "amount", amount: v.value, precision: 4, token: "VERSE" },
      }));
      this.votes.total = votes.length;
      this.votes.data.items = this.votes_array.slice(
        (this.votes_current - 1) * 3,
        this.votes_current * 3
      );
      let self = new BigNumber(0);
      let others = new BigNumber(0);
      for (const v of votes) {
        if (v.address.toLowerCase() === address) {
          self = self.plus(v.value);
        } else {
          others = others.plus(v.value);
        }
      }
      let selfNum = self.dividedBy(1e18).toNumber();
      let othersNum = others.dividedBy(1e18).toNumber();
      let totalNum = selfNum + othersNum;
      this.delegated_chart.data.datasets = [
        {
          backgroundColor: ["#6171ff", "#42DCFE"],
          data: [selfNum, othersNum],
        },
      ];
      if (totalNum > 0) {
        this.delegated_chart_legend = {
          total: totalNum,
          selfRatio: Math.floor((selfNum * 10000) / totalNum) / 100 + "%",
          self: self.toFixed(),
          others: others.toFixed(),
          othersRatio: Math.floor((othersNum * 10000) / totalNum) / 100 + "%",
        };
      } else {
        this.delegated_chart_legend = {
          total: 0,
          selfRatio: "0%",
          self: 0,
          others: 0,
          othersRatio: "0%",
        };
      }
      this.chart_load = true;
    },
    votePaginationChange(val) {
      this.votes_current = val;
      this.votes.data.items = this.votes_array.slice(
        (this.votes_current - 1) * 3,
        this.votes_current * 3
      );
    },
    async loadDelegators() {
      const { address } = this.$route.params;
      const res = await this.$api.validator.getDelegators(
        this.network,
        address
      );
      const { delegators } = res;
      this.delegators_array = delegators.map((d) => ({
        ...d,
        amount: {
          type: "amount",
          amount: d.amount,
          token: "VERSE",
          precision: 4,
        },
      }));
      this.delegators.total = delegators.length;
      this.delegators.data.items = this.delegators_array.slice(
        (this.delegators_current - 1) * 3,
        this.delegators_current * 3
      );
      // this.delegators.data.items = delegators;
    },
    delegatorPaginationChange(val) {
      this.delegators_current = val;
      this.delegators.data.items = this.delegators_array.slice(
        (this.delegators_current - 1) * 3,
        this.delegators_current * 3
      );
    },
    async loadProposed(network, page, limit) {
      this.load = true;
      const { address } = this.$route.params;
      const { proposed, totalRows } = await this.$api.account.getProposed(
        network,
        address,
        page,
        limit
      );

      const items = proposed.map((b) => {
        return {
          ...b,
          blockhash: b.hash,
          reward: {
            type: "amount",
            amount: b.actualReward,
            token: "STPT",
            precision: 8,
          },
        };
      });
      return { items, totalRows };
    },
  },
};
</script>

<style lang="scss" scoped>
h2.title {
  margin-top: 30px;
  font-size: 20px;
}

.summary {
  margin: 20px 0;

  .info {
    .title {
      color: #0c2954;
      font-size: 20px;
    }

    .address {
      margin-top: 20px;

      .label {
        color: #5c6f8c;
        margin: 0;
      }

      .link {
        font-size: 14px;
      }
    }
  }
}

.delegated {
  .box {
    display: flex;
    flex-direction: column;

    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .value {
      text-align: right;
    }
  }

  .border-r {
    border-right: 1px solid #ebeef7;
  }

  .dot {
    height: 15px;
    width: 15px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;

    &.self {
      background-color: #ffb84f;
    }

    &.others {
      background-color: #6171ff;
    }
  }
}

.no-padding {
  padding: 0;
}
</style>
