<template>
  <b-container>
    <h2 class="title">Validator Detail</h2>
    <b-card class="summary">
      <b-row>
        <b-col cols="2">
          <b-img v-bind="mainProps" rounded alt="Rounded image"></b-img>
        </b-col>
        <b-col cols="10" class="info">
          <h3 class="title">HashQuark</h3>
          <a href="#">https://www.hashquark.com</a>
          <b-row class="address">
            <b-col>
              <p class="label">Operator Address</p>
              <a class="link" href="#"
                >cosmosvaloper146kwpzhmleafmhtaxulfptyhnvwxzlvm87hwnm</a
              >
            </b-col>
            <b-col>
              <p class="label">Address</p>
              <a class="link" href="#"
                >cosmosvaloper146kwpzhmleafmhtaxulfptyhnvwxzlvm87hwnm</a
              >
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>

    <b-card class="delegated">
      <b-row>
        <b-col cols="2">
          <pie-chart
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
  </b-container>
</template>

<script>
import PieChart from "@/charts/PieChart.js";

export default {
  name: "ValidatorDetail",
  components: {
    PieChart
  },
  data() {
    return {
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
          datasets: [
            {
              backgroundColor: ["#FFB84F", "#287DF9"],
              data: [7900, 38100]
            }
          ]
        }
      }
    };
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
</style>
