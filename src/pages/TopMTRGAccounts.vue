<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    title="Top MTRG Accounts",
    :fields="accounts.fields",
    :pagination="accounts.pagination",
    :loadItems="loadTopMTRG",
    :currentPage="currentPage",
    @tablePaginationChange="currentPageChange"
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
      currentPage: 1,
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
    currentPageChange(page) {
      console.log("page", page);
      this.currentPage = page;
    },
    async loadTopMTRG(network, page, limit) {
      console.log("load data");
      const { accounts, totalRows } = await this.$api.account.getTopMTRG(
        network,
        this.currentPage,
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
