<template>
  <div class="validator">
    <DataDashboard :rows="validator_data"></DataDashboard>

    <ValidatorTable class="px-0"></ValidatorTable>

    <DataTable :data="epoch_reward_data" class="px-0">
      <template v-slot:cell(more)="data">
        <div class="dt-row">
          <a class="link" :href="data.value">Epoch Reward List</a>
        </div>
      </template>
    </DataTable>
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
      validator_data: [
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
            label: "Kblock Height (PoS)",
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
};
</script>

<style></style>
