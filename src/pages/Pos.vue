<template>
  <div class="validator">
    <DataDashboard :rows="pos_data"></DataDashboard>

    <ValidatorTable class="px-0"></ValidatorTable>
    <data-table
      hover
      :data="epoch_reward_data"
      :loading="load"
      :paginateTotal="total"
      :paginateCurrentPage="current_page"
      :pagination="epoch_pagination"
      class="px-0"
      title="Epoch Rewards"
      @tablePaginationChange="paginationChange"
    >
      <template v-slot:cell(more)="data">
        <div class="dt-row">
          <router-link
            :to="{
              name: 'posRewards',
              params: { epoch: data.item.epoch },
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
      load: true,
      total: 0,
      pos_data: [],
      current_page: 1,
      epoch_pagination: {
        show: true,
        align: "center",
        perPage: 8,
      },
      epoch_reward_data: {
        fields: [
          { key: "epoch", label: "Epoch" },
          { key: "height", label: "Height (PoW)" },
          { key: "amount", label: "Amount" },
          { key: "timestamp", label: "Time" },
          { key: "more", label: "More" },
        ],
        items: [],
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
        this.load = true;
        const {
          rewards,
          totalPage,
        } = await this.$api.validator.getValidateReward(
          this.network,
          this.current_page,
          this.page_size
        );
        this.total = totalPage * this.page_size;
        this.epoch_reward_data.items = rewards.map((r) => {
          return { ...r, amount: fromWei(r.totalReward) + " MTR" };
        });
        this.load = false;
      } catch (e) {
        console.error(e);
        this.load = false;
      }
    },
    paginationChange(val) {
      this.current_page = val;
      this.loadEpochRewards();
    },
    async loadPostData() {
      try {
        const res = await this.$api.metric.getAll(this.network);
        this.loading = false;
        const { mtr, pos, staking, committee } = res;
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
              content: `${committee.healthy} / ${
                committee.invalid + committee.down
              } / ${committee.size}`,
              label: "Healthy / Invalid / Total Node",
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
