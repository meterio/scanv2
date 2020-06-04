<template>
  <div class="mining">
    <!-- block statistic -->
    <DataDashboard v-bind:rows="block_data"></DataDashboard>

    <HashRateChart></HashRateChart>
  </div>
</template>

<script>
import DataDashboard from "@/components/DataDashboard.vue";
import HashRateChart from "@/components/HashRateChart.vue";

export default {
  name: "Mining",
  components: {
    DataDashboard,
    HashRateChart
  },
  data() {
    return {
      block_data: [
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
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.mining {
  margin-top: 30px;
}
</style>
