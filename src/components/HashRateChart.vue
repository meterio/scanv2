<template>
  <b-container class="hash-chart">
    <b-card title="Daily Hashrate and Reward" class="text-center">
      <line-chart :chart-data="datacollection" :options="options" v-if="dataCollection.labels"></line-chart>
    </b-card>
  </b-container>
</template>

<script>
import LineChart from '@/charts/LineChart.js';

export default {
  name: 'HashRateChart',
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
              id: 'LEFT',
              gridLines: {
                display: true
              },
              position: 'left'
            },
            {
              id: 'RIGHT',
              gridLines: { display: false },
              position: 'right'
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
          position: 'bottom',
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
            label: 'Network Hashrate',
            fill: false,
            borderColor: '#003CB2',
            pointBorderColor: '#003CB2',
            pointBackgroundColor: '#003CB2',
            data: this.dataCollection.values,
            yAxisID: 'LEFT'
          },
          {
            label: 'Mining Reward (TH/s)',
            fill: false,
            borderColor: '#42DCFE',
            pointBorderColor: '#42DCFE',
            pointBackgroundColor: '#42DCFE',
            data: this.dataCollection.diffs,
            yAxisID: 'RIGHT'
          }
        ]
      };
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
