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
          <a class="link" :href="data.value">Epoch Reward List</a>
        </div>
      </template>
    </data-table>
  </div>
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
    DataTable,
  },
  data() {
    return {
      pos_data: [
        [
          {
            content: "2351",
            label: "Validators",
          },
          {
            content: "2351",
            label: "Total Staking",
          },
        ],
        [
          {
            content: "2351",
            label: "Height",
          },
          {
            content: "12.4 USD",
            label: "Price",
          },
          {
            content: "79/90",
            label: "Online/ Total Node",
          },
        ],
      ],
      epoch_reward_data: {
        fields: [
          {
            key: "kblock_height",
            label: "Epoch",
          },
          {
            key: "height",
            label: "Height (PoW)",
          },
          {
            key: "amount",
            label: "Amount",
          },
          {
            key: "time",
            label: "Time",
          },

          {
            key: "more",
            label: "More",
          },
        ],
        items: [
          {
            kblock_height: "274",
            height: "1274",
            amount: "2,89,789 MTR",
            time: "12 sec ago",
            more: "tx 1",
          },
          {
            kblock_height: "274",
            height: "1274",
            amount: "2,89,789 MTR",
            time: "12 sec ago",
            more: "tx 1",
          },
        ],
      },
    };
  },

  async mounted() {
    const res = await this.$api.metric.getAll();
    this.loading = false;
    const { mtr, mtrg, pos, pow, staking } = res;
    this.pos_data = [
      [
        {
          content: staking.validators,
          label: "Validators",
        },
        {
          content: staking.totalStakedStr,
          label: "Total Staked",
        },
      ],
      [
        {
          content: pos.best,
          label: "PoS Chain Height",
        },
        {
          content: "$ " + mtr.price,
          label: "MTR Price",
        },
        {
          content: `${staking.onlineNodes}/${staking.totalNodes}`,
          label: "Online/ Total Node",
        },
      ],
    ];
  },
};
</script>

<style></style>
