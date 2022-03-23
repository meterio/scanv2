<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    title="Top MTR Accounts",
    :fields="accounts.fields",
    :pagination="accounts.pagination",
    :loadItems="loadTopMTR",
    :currentPage="currentPage",
    @tablePaginationChange="currentPageChange"
  )
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import BigNumber from "bignumber.js";

export default {
  name: "TopMTRAccounts",
  components: {
    DataTableV2,
  },
  data() {
    return {
      currentPage: 1,
      accounts: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "mtrRank", label: "Rank" },
          { key: "fullAddress", label: "Address" },
          { key: "totalMTR", label: "MTR Balance" },
        ],
      },
    };
  },

  methods: {
    currentPageChange(page) {
      this.currentPage = page;
    },
    async loadTopMTR(network, page, limit) {
      const { accounts, totalRows } = await this.$api.account.getTopMTR(
        network,
        this.currentPage,
        limit
      );
      const items = accounts.map((a) => {
        return {
          totalMTR: {
            type: "amount",
            amount: new BigNumber(a.mtrBalance).plus(a.mtrBounded).toFixed(),
            token: "MTR",
            precision: 4,
          },
          fullAddress: a.address,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
