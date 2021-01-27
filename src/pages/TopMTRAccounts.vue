<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    title="Top MTR Accounts",
    :fields="accounts.fields",
    :pagination="accounts.pagination",
    :loadItems="loadTopMTR"
  )
    template(v-slot:cell(addrAndName)="data")
      .dt-row
        router-link.link(
          v-if="!!data.item.name",
          :to="{ name: 'address', params: { address: data.item.addrAndName.address } }"
        ) {{ data.item.addrAndName.name }}
        router-link.link(
          v-else,
          :to="{ name: 'address', params: { address: data.item.addrAndName.address } }"
        ) {{ data.item.addrAndName.address }}
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
export default {
  name: "TopMTRAccounts",
  components: {
    DataTableV2,
  },
  data() {
    return {
      accounts: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "mtrRank", label: "Rank" },
          { key: "addrAndName", label: "Address" },
          { key: "mtrBalanceStr", label: "MTR Balance" },
        ],
      },
    };
  },

  methods: {
    async loadTopMTR(network, page, limit) {
      const { accounts, totalPage } = await this.$api.account.getTopMTR(
        network,
        page,
        limit
      );
      const totalRows = totalPage * limit;
      const items = accounts.map((a) => {
        return { ...a, addrAndName: { address: a.address, name: a.name } };
      });
      return { items, totalRows };
    },
  },
};
</script>
