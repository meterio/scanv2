<template>
  <b-container class="hash-chart">
    <b-card title="Hash rate by Day" class="text-center">
      <line-chart
        :chart-data="datacollection"
        :options="options"
        v-if="dataCollection.labels"
      ></line-chart>
    </b-card>
  </b-container>
</template>

<script>
import LineChart from "@/charts/LineChart.js";
import _ from "lodash";

export default {
  name: "HashRateChart",
  props: {
    dataCollection: {
      type: Object,
      required: true
    }
  },
  components: {
    LineChart
  },
  data() {
    return {
      datacollection: {},
      options: {
        scales: {
          yAxes: [
            {
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            usePointStyle: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  mounted() {
    this.fillData();
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: this.dataCollection.labels,
        datasets: [
          {
            label: "Network Hash Rate",
            fill: false,
            borderColor: "#287DF9",
            pointBorderColor: "#287DF9",
            pointBackgroundColor: "#287DF9",
            data: this.dataCollection.values
          }
          // {
          //   label: "MTR/(TH/s)/Day",
          //   fill: false,
          //   borderColor: "#FFB84F",
          //   pointBorderColor: "#FFB84F",
          //   pointBackgroundColor: "#FFB84F",
          //   data: this.getRandoms()
          // }
        ]
      };
    },
    getRandomInt(max = 30) {
      return Math.floor(Math.random() * max);
    },
    getRandoms(size = 6) {
      return _.range(size).map(() => this.getRandomInt());
    }
  }
};
</script>

<style>
.hash-chart {
  width: 100%;
  padding: 0;
  margin: 30px auto;
}
</style>
