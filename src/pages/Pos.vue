<template>
  <div class="validator">
    <DataDashboard :rows="pos_data"></DataDashboard>

    <ValidatorTable class="px-0"></ValidatorTable>
    <DataTableV2
      title="Epoch Rewards"
      :fields="epoch_reward.fields"
      :pagination="epoch_reward.pagination"
      :loadItems="loadEpochRewards"
      class="px-0"
    >
    </DataTableV2>
  </div>
</template>

<script>
import DataDashboard from "@/components/DataDashboard.vue";
import ValidatorTable from "@/components/ValidatorTable.vue";
import DataTable from "@/components/DataTable.vue";
import DataTableV2 from "@/components/DataTableV2.vue";
import { fromWei } from "@/utils";

export default {
  name: "Validator",
  components: {
    DataDashboard,
    ValidatorTable,
    DataTableV2,
  },
  data() {
    return {
      load: true,
      total: 0,
      pos_data: [],
      current_page: 1,
      epoch_reward: {
        pagination: {
          show: true,
          align: "center",
          perPage: 8,
        },

        fields: [
          { key: "epoch", label: "Epoch" },
          { key: "height", label: "Height (PoW)" },
          { key: "amount", label: "Amount" },
          { key: "timestamp", label: "Time" },
          { key: "posReward", label: "More" },
        ],
      },
    };
  },

  beforeMount() {},
  methods: {
    init() {
      this.loadPostData();
    },
    async loadEpochRewards(network, page, limit) {
      this.load = true;
      const {
        rewards,
        totalPage,
      } = await this.$api.validator.getValidateReward(network, page, limit);
      const totalRows = totalPage * limit;
      const items = rewards.map((r) => {
        return {
          ...r,
          amount: fromWei(r.totalReward) + " MTR",
          posReward: r.epoch,
        };
      });
      return { items, totalRows };
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
