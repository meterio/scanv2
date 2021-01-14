<template lang="pug">
b-container.address-container
  h4 Address Details
  b-card.mt20
    b-row
      b-col Address
      b-col Total Balance(MTR)
    b-row
      b-col sdfffffffffffffff
      b-col 677788
  
  b-card.mt-2pert
    pie-chart.px-0
  data-table.mt-2pert.px-0(title="Buckets",:data="txs.data",:pagination="pagination")
    
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import PieChart from "@/components/PieChart.vue";
export default {
  data() {
    return {
      pagination: {
        show: true,
        align: "center"
      },
      txs: {
        data: {
          fields: [
            {
              key: "Candidate Address",
              label: "Candidate Address"
            },
            {
              key: "vote",
              label: "Vote"
            },
            {
              key: "time",
              label: "Time"
            },
            {
              key: "bounded",
              label: "Bounded"
            }
          ],
          items: []
        }
      }
    };
  },
  components: {
    DataTable,
    PieChart
  }
};
</script>
<style lang="scss" scoped>
.address-container {
  padding-top: 5%;
  padding-bottom: 15%;
  box-sizing: border-box;
  .mt-2pert {
    margin-top: 2.6%;
  }
}
</style>
