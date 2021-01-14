<template lang="pug">
b-container
  b-row
    b-col
      pie-chart(:chart-data="pieCollections" :options="options", style="width: 300px")
    b-col(style="display: flex; flex-direction: column; justify-content: center;")
      div 67%
      div 5.78%
      div 23.4%
      div 15.68%
      div 5.44%
    b-col
      div 67890
      div 3590
      div 28920
      div 13920
      div 5920

</template>

<script>
import PieChart from "@/charts/PieChart";
export default {
  name: "PieChartComponent",
  data() {
    return {
      pieCollections: {
        datasets: [
          {
            data: [67, 5.78, 23.4, 15.68, 5.44],
            backgroundColor: [
              "#287df9",
              "#80d2e4",
              "#a6b5cc",
              "#b871ff",
              "#ffb84f"
            ]
          }
        ],
        labels: [
          "Total Avaliable",
          "Delegated",
          "Unbounded",
          "Reward",
          "Commision"
        ]
      },
      options: {
        legend: {
          position: "right",
          labels: {
            padding: 25,
            usePointStyle: true
          }
        }
      }
    };
  },
  components: {
    PieChart
  }
};
</script>
