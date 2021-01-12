<template>
  <div class="mining">
    <!-- block statistic -->
    <DataDashboard v-bind:rows="block_data"></DataDashboard>

    <HashRateChart class="px-0"></HashRateChart>

    <DataTable
      :title="mining_reward.title"
      :data="mining_reward.data"
      class="px-0"
    >
      <template v-slot:cell(more)="data">
        <div class="dt-row">
          <a class="link" :href="data.value">Mining Reward List</a>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script>
import DataDashboard from "@/components/DataDashboard.vue";
import HashRateChart from "@/components/HashRateChart.vue";
import DataTable from "@/components/DataTable.vue";

export default {
  name: "Mining",
  components: {
    DataDashboard,
    HashRateChart,
    DataTable,
  },
  data() {
    return {
      block_data: [
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
              key: "kblock_height",
              label: "Kblock Height (PoS)",
            },
            {
              key: "height",
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
          items: [
            {
              kblock_height: "274",
              height: "1274",
              amount: "2,89,789 MTR",
              time: "12 sec ago",
              more: "tx 1",
            },
            {
              kblock_height: "274",
              height: "1274",
              amount: "2,89,789 MTR",
              time: "12 sec ago",
              more: "tx 1",
            },
          ],
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.mining {
  margin-top: 30px;
}
</style>
