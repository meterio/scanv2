<template>
  <div class="mining">
    <!-- block statistic -->
    <DataDashboard v-bind:rows="pow_data"></DataDashboard>

    <HashRateChart class="px-0" :chartData="{}"></HashRateChart>

    <DataTable
      :title="mining_reward.title"
      :data="mining_reward.data"
      class="px-0"
      :pagination="mining_pagination"
      :loading="load"
      :paginateTotal="mining_total"
      :paginateCurrentPage="mining_current_page"
      @tablePaginationChange="pgChange"
    >
      <template v-slot:cell(more)="data">
        <div class="dt-row">
          <a class="link" :href="'/pow/rewards/' + data.value"
            >Mining Reward List</a
          >
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataDashboard from "@/components/DataDashboard.vue";
import HashRateChart from "@/components/HashRateChart.vue";
import DataTable from "@/components/DataTable.vue";
import BigNumber from "bignumber.js";
import { fromNow } from "@/utils";

export default {
  name: "Mining",
  components: {
    DataDashboard,
    HashRateChart,
    DataTable,
  },
  data() {
    return {
      load: true,
      mining_pagination: {
        show: true,
        align: "center",
        perPage: 8,
      },
      mining_current_page: 1,
      mining_total: 0,
      pow_data: [
        [
          {
            content: "2351",
            label: "Block Height",
          },
          {
            content: "0.9 USD",
            label: "Price (MTR)",
          },
          {
            content: "233",
            label: "Circulations",
          },
        ],
        [
          {
            content: "1.2 PH/s",
            label: "Network Hash Rate",
          },
          {
            content: "12 MTR",
            label: "(TH/s)/Day",
          },
          {
            content: "4.5 USD",
            label: "MTR Cost Parity",
          },
        ],
      ],

      mining_reward: {
        title: "Mining Rewards",
        data: {
          fields: [
            {
              key: "pos_height",
              label: "Kblock Height (PoS)",
            },
            {
              key: "pow_height",
              label: "Height (PoW)",
            },
            {
              key: "amount",
              label: "Amount",
            },
            {
              key: "time",
              label: "Time",
            },

            {
              key: "more",
              label: "More",
            },
          ],
          items: [],
        },
      },
    };
  },
  beforeMount() {
    this.initData();
    this.loadRewards();
  },
  methods: {
    async initData() {
      try {
        const res = await this.$api.metric.getAll();
        const { mtr, mtrg, pos, pow, staking } = res;
        this.pow_data = [
          [
            {
              content: pow.best,
              label: "PoW Chain Height",
            },
            {
              content: "$ " + mtr.price,
              label: "MTR Price",
            },
            {
              content: new BigNumber(mtr.circulation).toFixed(0),
              label: "MTR Circulations",
            },
          ],
          [
            {
              content: `${new BigNumber(pow.hashrate)
                .dividedBy(1000000)
                .toFixed(0)} MH/s`,
              label: "Network Hash Rate",
            },
            {
              content: "12 MTR", // FIXME: fake stub
              label: "(TH/s)/Day",
            },
            {
              content: new BigNumber(pow.costParity).toFixed(2),
              label: "MTR Cost Parity",
            },
          ],
        ];
      } catch (e) {}
    },
    pgChange(val) {
      this.mining_current_page = val;
      this.loadRewards();
    },
    async loadRewards() {
      try {
        this.load = true;
        const { rewards, totalPage } = await this.$api.pow.getRewards(
          this.mining_current_page,
          this.page_size
        );

        this.mining_total = totalPage;
        this.mining_reward.data.items = [];
        for (const r of rewards) {
          const item = {
            pos_height: r.posBlock,
            pow_height: r.powBlock,
            amount: r.totalAmountStr,
            time: fromNow(r.timestamp * 1000),
            more: r.epoch,
          };
          this.mining_reward.data.items.push(item);
        }
        this.load = false;
      } catch (e) {
        this.load = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.mining {
  margin-top: 30px;
}
</style>
