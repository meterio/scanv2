<template>
  <div class="mining">
    <!-- block statistic -->
    <DataDashboard v-bind:rows="pow_data"></DataDashboard>

    <HashRateChart class="px-0"></HashRateChart>

    <DataTable
      :title="mining_reward.title"
      :data="mining_reward.data"
      class="px-0"
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
import { fromNow } from "@/utils/time";

export default {
  name: "Mining",
  components: {
    DataDashboard,
    HashRateChart,
    DataTable
  },
  data() {
    return {
      pow_data: [
        [
          {
            content: "2351",
            label: "Block Height"
          },
          {
            content: "0.9 USD",
            label: "Price (MTR)"
          },
          {
            content: "233",
            label: "Circulations"
          }
        ],
        [
          {
            content: "1.2 PH/s",
            label: "Network Hash Rate"
          },
          {
            content: "12 MTR",
            label: "(TH/s)/Day"
          },
          {
            content: "4.5 USD",
            label: "MTR Cost Parity"
          }
        ]
      ],

      mining_reward: {
        title: "Mining Rewards",
        data: {
          fields: [
            {
              key: "pos_height",
              label: "Kblock Height (PoS)"
            },
            {
              key: "pow_height",
              label: "Height (PoW)"
            },
            {
              key: "amount",
              label: "Amount"
            },
            {
              key: "time",
              label: "Time"
            },

            {
              key: "more",
              label: "More"
            }
          ],
          items: []
        }
      }
    };
  },
  async mounted() {
    const res = await this.$api.metric.getAll();
    this.loading = false;
    const { mtr, mtrg, pos, pow, staking } = res;
    this.pow_data = [
      [
        {
          content: pow.best,
          label: "PoW Chain Height"
        },
        {
          content: "$ " + mtr.price,
          label: "MTR Price"
        },
        {
          content: new BigNumber(mtr.circulation).toFixed(0),
          label: "MTR Circulations"
        }
      ],
      [
        {
          content: `${new BigNumber(pow.hashrate)
            .dividedBy(1000000)
            .toFixed(0)} MH/s`,
          label: "Network Hash Rate"
        },
        {
          content: "12 MTR", // FIXME: fake stub
          label: "(TH/s)/Day"
        },
        {
          content: new BigNumber(pow.costParity).toFixed(2),
          label: "MTR Cost Parity"
        }
      ]
    ];

    const rres = await this.$api.pow.getRewards();
    const { rewards } = rres;

    this.mining_reward.data.items = [];
    for (const r of rewards) {
      const item = {
        pos_height: r.posBlock,
        pow_height: r.powBlock,
        amount: r.totalAmountStr,
        time: fromNow(r.timestamp * 1000),
        more: r.epoch
      };
      this.mining_reward.data.items.push(item);
    }
  }
};
</script>

<style lang="scss" scoped>
.mining {
  margin-top: 30px;
}
</style>
