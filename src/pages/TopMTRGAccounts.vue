<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    title="Top MTRG Accounts",
    :fields="accounts.fields",
    :pagination="accounts.pagination",
    :loadItems="loadTopMTRG"
  )
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";

export default {
  name: "TopMTRGAccounts",
  components: {
    DataTableV2,
  },
  data() {
    return {
      accounts: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "mtrgRank", label: "Rank" },
          { key: "fullAddress", label: "Address" },
          { key: "mtrgBalanceStr", label: "MTRG Balance" },
        ],
      },
    };
  },

  methods: {
    async loadTopMTRG(network, page, limit) {
      const { accounts, totalRows } = await this.$api.account.getTopMTRG(
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
