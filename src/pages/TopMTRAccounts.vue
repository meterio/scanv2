<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    title="Top MTR Accounts",
    :fields="accounts.fields",
    :pagination="accounts.pagination",
    :loadItems="loadTopMTR"
  )
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
          { key: "fullAddress", label: "Address" },
          { key: "mtrBalanceStr", label: "MTR Balance" },
        ],
      },
    };
  },

  methods: {
    async loadTopMTR(network, page, limit) {
      const { accounts, totalRows } = await this.$api.account.getTopMTR(
        network,
        page,
        limit
      );
      const items = accounts.map((a) => {
        return { ...a, fullAddress: a.address };
      });
      return { items, totalRows };
    },
  },
};
</script>
