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
import BigNumber from "bignumber.js";

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
          { key: "totalMTRG", label: "MTRG Balance" },
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
        return {
          totalMTRG: {
            type: "amount",
            amount: new BigNumber(a.mtrgBalance).plus(a.mtrgBounded).toFixed(),
            precision: 4,
            token: "MTRG",
          },
          fullAddress: a.address,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
