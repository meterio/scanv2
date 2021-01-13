<template>
  <b-container class="validator">
    <DataDashboard :rows="validator_data"></DataDashboard>

    <ValidatorTable class="px-0"></ValidatorTable>
    <data-table
      hover
      :data="epoch_reward_data"
      class="px-0"
      title="Epoch Rewards"
    >
      <template v-slot:cell(more)="data">
        <div class="dt-row">
          <a class="link" :href="data.value">Epoch Reward List</a>
        </div>
      </template>
    </data-table>
  </b-container>
</template>

<script>
import DataDashboard from "@/components/DataDashboard.vue";
import ValidatorTable from "@/components/ValidatorTable.vue";
import DataTable from "@/components/DataTable.vue";

export default {
  name: "Validator",
  components: {
    DataDashboard,
    ValidatorTable,
    DataTable
  },
  data() {
    return {
      current_page: 1,
      validator_data: [
        [
          {
            content: "2351",
            label: "Validators"
          },
          {
            content: "2351",
            label: "Total Staking"
          }
        ],
        [
          {
            content: "2351",
            label: "Height"
          },
          {
            content: "12.4 USD",
            label: "Price"
          },
          {
            content: "79/90",
            label: "Online/ Total Node"
          }
        ]
      ],
      epoch_reward_data: {
        fields: [
          {
            key: "kblock_height",
            label: "Epoch"
          },
          {
            key: "height",
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
        items: [
          {
            kblock_height: "274",
            height: "1274",
            amount: "2,89,789 MTR",
            time: "12 sec ago",
            more: "tx 1"
          },
          {
            kblock_height: "274",
            height: "1274",
            amount: "2,89,789 MTR",
            time: "12 sec ago",
            more: "tx 1"
          }
        ]
      }
    };
  },
  async mounted() {
    try {
      const pos_data = await this.$api.metric.getPos();
      this.validator_data[0][0]["content"] = pos_data.staking.validators;
      this.validator_data[0][1]["content"] = pos_data.staking.totalStaked;
      this.validator_data[1][2]["content"] =
        pos_data.staking.onlineNodes + "/" + pos_data.staking.totalNodes;
      // FIXME post_data height value / price value

      this.loadRewards();
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    async loadRewards() {
      try {
        // TODO no detail data
        const res = await this.$api.validator.getValidateReward(
          this.current_page,
          this.limit
        );
        console.log("rewards:>>", res);
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<style></style>
