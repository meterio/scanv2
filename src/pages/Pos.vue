<template>
  <div class="validator">
    <DataDashboard :rows="pos_data"></DataDashboard>

    <ValidatorTable class="px-0"></ValidatorTable>
    <data-table
      hover
      :data="epoch_reward_data"
      class="px-0"
      title="Epoch Rewards"
    >
      <template v-slot:cell(more)="data">
        <div class="dt-row">
          <router-link
            :to="{
              name: 'posRewards',
              params: { network: $route.params.network, epoch: data.value },
            }"
            >Epoch Reward List</router-link
          >
        </div>
      </template>
    </data-table>
  </div>
</template>

<script>
import DataDashboard from "@/components/DataDashboard.vue";
import ValidatorTable from "@/components/ValidatorTable.vue";
import DataTable from "@/components/DataTable.vue";
import { fromWei } from "@/utils";

export default {
  name: "Validator",
  components: {
    DataDashboard,
    ValidatorTable,
    DataTable,
  },
  data() {
    return {
      pos_data: [],
      current_page: 1,
      epoch_reward_data: {
        fields: [
          { key: "kblock_height", label: "Epoch" },
          { key: "height", label: "Height (PoW)" },
          { key: "amount", label: "Amount" },
          { key: "time", label: "Time" },
          { key: "more", label: "More" },
        ],
        items: [
          {
            kblock_height: "274",
            height: "1274",
            amount: "2,89,789 MTR",
            time: "12 sec ago",
            more: "274",
          },
          {
            kblock_height: "275",
            height: "1275",
            amount: "2,89,789 MTR",
            time: "12 sec ago",
            more: "275",
          },
        ],
      },
    };
  },

  beforeMount() {},
  methods: {
    init() {
      this.loadPostData();
      this.loadEpochRewards();
    },
    async loadEpochRewards() {
      try {
        const res = await this.$api.validator.getValidateReward(
          this.$route.params.network,
          this.current_page,
          this.page_size
        );
        console.log(res);
      } catch (e) {
        console.error(e);
      }
    },
    async loadPostData() {
      try {
        const res = await this.$api.metric.getAll(this.$route.params.network);
        this.loading = false;
        const { mtr, mtrg, pos, pow, staking } = res;
        this.pos_data = [
          [
            { content: staking.validators, label: "Validators" },
            {
              content: fromWei(staking.totalStaked, 0) + " MTRG",
              label: "Total Staked",
            },
          ],
          [
            { content: pos.best, label: "PoS Chain Height" },
            { content: "$ " + mtr.price, label: "MTR Price" },
            {
              content: `${staking.onlineNodes}/${staking.totalNodes}`,
              label: "Online/ Total Node",
            },
          ],
        ];
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style>
.validator {
  margin-top: 30px;
}
</style>
