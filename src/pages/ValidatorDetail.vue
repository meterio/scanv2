<template>
  <b-container>
    <h2 class="title">Validator</h2>
    <b-card class="summary">
      <b-row>
        <b-col cols="2">
          <b-img v-bind="mainProps" rounded alt="Rounded image"></b-img>
        </b-col>
        <b-col cols="10" class="info">
          <h3 class="title">{{ validator.name }}</h3>
          <div>{{ validator.description }}</div>
          <b-row class="address">
            <b-col>
              <p class="label">Address</p>
              {{ validator.address }}
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>

    <!-- delegated chart -->
    <b-card class="delegated">
      <b-row>
        <b-col cols="2">
          <pie-chart
            v-if="chart_load"
            :chart-data="delegated_chart.data"
            :options="delegated_chart.options"
          ></pie-chart>
        </b-col>
        <b-col cols="10">
          <label>Total</label>
          <p>45890 <span>MTRG</span></p>

          <b-row>
            <b-col cols="4" class="box border-r">
              <div class="top">
                <div class="legend">
                  <span class="dot self"></span>
                  <span>Self</span>
                </div>

                <span class="percent">25%</span>
              </div>

              <span class="value"> 7900 MTRG</span>
            </b-col>
            <b-col cols="4" class="box">
              <div class="top">
                <div class="legend">
                  <span class="dot others"></span>
                  <span>Others</span>
                </div>

                <span class="percent">25%</span>
              </div>

              <span class="value"> 7900 MTRG</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>

    <b-row>
      <b-col cols="12" lg="6" class="no-padding">
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

      <b-col cols="12" lg="6" class="no-padding">
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
      <DataTable
        :title="proposed.title"
        :data="proposed.data"
        :pagination="proposed.pagination"
        :paginateCurrentPage="current_page"
        :loading="load"
        :paginateTotal="proposed_total"
        @tablePaginationChange="proposedChange"
      >
        <template v-slot:cell(block_hash)="data">
          <div class="dt-row">
            <router-link
              :to="{
                name: 'blockDetail',
                params: { revision: data.value }
              }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>
      </DataTable>
    </b-row>
  </b-container>
</template>

<script>
import PieChart from "@/charts/PieChart.js";
import DataTable from "@/components/DataTable.vue";
import BigNumber from "bignumber.js";

export default {
  name: "ValidatorDetail",
  components: {
    PieChart,
    DataTable
  },
  data() {
    return {
      delegators_current: 1,
      delegators_array: [],
      votes_current: 1,
      votes_array: [],
      proposed_total: 0,
      chart_load: false,
      load: true,
      current_page: 1,
      validator: {
        name: "",
        description: "",
        address: "0x"
      },
      mainProps: {
        blank: true,
        blankColor: "#777",
        width: 100,
        height: 100,
        class: "m1"
      },
      delegated_chart: {
        options: {
          legend: {
            display: false
          }
        },
        data: {
          labels: ["Self", "Others"],
          datasets: []
        }
      },
      delegators: {
        title: "Delegators",
        total: 0,
        data: {
          fields: [
            { key: "address", label: "Delegator" },
            { key: "amountStr", label: "Amount" },
            { key: "percent", label: "Share" }
          ],
          items: []
        },
        pagination: { show: true, align: "right", perPage: 3 }
      },
      votes: {
        title: "Votes",
        total: 0,
        data: {
          fields: [
            { key: "id", label: "Bucket ID" },
            { key: "address", label: "Voter" },
            { key: "valueStr", label: "Amount" },
            { key: "timestamp", label: "Time" }
          ],
          items: []
        },
        pagination: { show: true, align: "right", perPage: 3 }
      },
      proposed: {
        title: "Proposed Blocks",
        data: {
          fields: [
            { key: "number", label: "Height" },
            { key: "blockhash", label: "Block Hash" },
            { key: "txCount", label: "Txs" },
            { key: "timestamp", label: "Time" }
          ],
          items: []
        },
        pagination: {
          show: true,
          align: "center",
          perPage: 8
        }
      }
    };
  },
  methods: {
    async init() {
      this.loadInfo();
      this.loadVotes();
      this.loadDelegators();
      this.loadProposed();
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
      this.votes_array = votes;
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
      console.log("self:", selfNum, "others:", othersNum, "total:", totalNum);
      this.delegated_chart.data.datasets = [
        {
          backgroundColor: ["#FFB84F", "#287DF9"],
          data: [selfNum, othersNum]
        }
      ];
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
      this.delegators_array = delegators;
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
    async loadProposed() {
      try {
        this.load = true;
        const { address } = this.$route.params;
        const { proposed, totalPage } = await this.$api.account.getProposed(
          this.network,
          address,
          this.current_page,
          this.page_size
        );
        this.proposed_total = totalPage * this.page_size;
        this.proposed.data.items = proposed.map(b => {
          return { ...b, blockhash: b.hash };
        });
        this.load = false;
      } catch (e) {
        console.error(e);
        this.load = false;
      }
    }
  }
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
      background-color: #287df9;
    }
  }
}

.no-padding {
  padding: 0;
}
</style>
