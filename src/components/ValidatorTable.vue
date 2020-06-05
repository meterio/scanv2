<template>
  <b-container class="table-container data-table-container">
    <b-card>
      <div class="header">
        <b-row>
          <b-col>
            <h3 class="title">Validators</h3>
          </b-col>

          <b-col>
            <div class="btn-nav">
              <b-button-group>
                <b-button variant="primary">Delegates</b-button>
                <b-button variant="outline-primary">Candidates</b-button>
                <b-button variant="outline-primary">Jailed</b-button>
              </b-button-group>
            </div>
          </b-col>

          <b-col>
            <div class="form-group has-search">
              <span class="fa fa-search form-control-feedback"></span>

              <input type="text" class="form-control" placeholder="Search" />
            </div>
          </b-col>
        </b-row>
      </div>

      <b-table
        hover
        class="data-table"
        :items="validator_data.items"
        :fields="validator_data.fields"
      >
        <template v-slot:cell()="data">
          <div class="dt-row">
            <span>{{ data.value }}</span>
          </div>
        </template>
      </b-table>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: "ValidatorTable",
  data() {
    return {
      validator_data: {
        fields: [
          {
            key: "rank",
            label: "Rank"
          },
          {
            key: "validator",
            label: "Validator"
          },
          {
            key: "voting_power",
            label: "Voting power"
          },
          {
            key: "comalative_share",
            label: "Comalative share"
          },
          {
            key: "commision",
            label: "Commision"
          },
          {
            key: "uptime",
            label: "UpTime"
          }
        ],
        items: [
          {
            rank: 1,
            validator: "HashQuark",
            voting_power: "3478 MTRG",
            comalative_share: "3.5%",
            commision: "100%",
            uptime: "100%"
          },
          {
            rank: 1,
            validator: "HashQuark",
            voting_power: "3478 MTRG",
            comalative_share: "3.5%",
            commision: "100%",
            uptime: "100%"
          },
          {
            rank: 1,
            validator: "HashQuark",
            voting_power: "3478 MTRG",
            comalative_share: "3.5%",
            commision: "100%",
            uptime: "100%"
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 20px;

  .title {
    display: flex;
    align-items: center;
    height: 100%;
  }
}

.has-search .form-control {
  padding-left: 2.375rem;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: #aaa;
}
</style>
