<template>
  <div class="mining">
    <!-- block statistic -->
    <DataDashboard v-bind:rows="pow_data"></DataDashboard>

    <HashRateChart
      class="px-0"
      :dataCollection="line_data"
      v-if="line_load"
    ></HashRateChart>

    <DataTableV2
      :title="mining_reward.title"
      :fields="mining_reward.fields"
      :pagination="mining_reward.pagination"
      class="px-0"
      :loadItems="loadRewards"
    >
    </DataTableV2>
  </div>
</template>

<script>
import DataDashboard from "@/components/DataDashboard.vue";
import HashRateChart from "@/components/HashRateChart.vue";
import DataTableV2 from "@/components/DataTableV2.vue";
import { formatNum, fromNow, bigNum, bigNumDiv } from "@/utils";

export default {
  name: "Mining",
  components: {
    DataDashboard,
    HashRateChart,
    DataTableV2,
  },
  data() {
    return {
      line_load: false,
      pow_data: [],
      line_data: {},
      mining_reward: {
        title: "PoW Mining Rewards",
        pagination: {
          show: true,
          align: "center",
          perPage: 8,
        },
        fields: [
          { key: "blockNum", label: "Kblock (PoS)" },
          { key: "pow_range", label: "PoW Height Range" },
          { key: "amount", label: "Amount" },
          { key: "time", label: "Time" },
          { key: "powReward", label: "More" },
        ],
      },
    };
  },
  methods: {
    init() {
      this.initData();
      this.getPowChart();
    },
    async initData() {
      try {
        const res = await this.$api.metric.getAll(this.network);
        const { mtr, pow } = res;
        this.pow_data = [
          [
            { content: pow.best, label: "PoW Chain Height" },
            { content: "$ " + mtr.price, label: "MTR Price" },
            {
              content: formatNum(mtr.circulation, 0),
              label: "MTR Circulations",
            },
          ],
          [
            {
              content: `${bigNum(bigNumDiv(pow.hashrate, 1000000), 0)} MH/s`,
              label: "Network Hash Rate",
            },
            {
              content: bigNum(pow.rewardPerDay, 3) + " MTR",
              label: "Reward (TH/s*Day)",
            },
            {
              content: "$ " + bigNum(pow.costParity, 3),
              label: "MTR Cost Parity",
            },
          ],
        ];
      } catch (e) {}
    },

    async loadRewards(network, page, limit) {
      const { rewards, totalRows } = await this.$api.pow.getRewards(
        network,
        page,
        limit
      );

      const items = rewards.map((r) => {
        return {
          blockNum: r.posBlock,
          pow_range: `${r.powStart} - ${r.powEnd}`,
          amount: {
            type: "amount",
            amount: r.totalAmount,
            token: "MTR",
            precision: -1,
          },
          time: fromNow(r.timestamp * 1000),
          powReward: r.epoch,
        };
      });
      return { items, totalRows };
    },

    async getPowChart() {
      try {
        this.line_load = false;
        const { hashrates, diffs } = await this.$api.metric.getChart(
          this.network
        );
        const network = this.currentChain.name.includes('Mainnet') ? 'mainnet' : 'testnet';
        this.line_data = {
          labels: [],
          values: [],
          diffs: [],
        };
        const data = hashrates[network];
        const me = this;
        data.map((itm) => {
          const time_str = me.formatLineTime(itm[0]);
          me.line_data.labels.push(time_str);
          me.line_data.values.push(itm[1]);
        });
        const diff_data = diffs[network];
        diff_data.map((itm) => {
          me.line_data.diffs.push(itm[1]);
        });
        this.line_load = true;
      } catch (e) {
        this.line_load = false;
        console.error(e);
      }
    },
    formatLineTime(time) {
      const b = new Date(time * 1000);
      const m = b.getMonth() + 1;
      return `${
        b.getDate() < 10 ? "0" + b.getDate() : b.getDate().toString()
      }/${m < 10 ? "0" + m : m.toString()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.mining {
  margin-top: 30px;
}
</style>
