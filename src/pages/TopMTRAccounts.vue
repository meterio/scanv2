<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    :title="title",
    :fields="accounts.fields",
    :pagination="accounts.pagination",
    :loadItems="loadTopMTR"
  )
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import BigNumber from "bignumber.js";
import { DEPLOY_DOMAIN, SYSTEM_COIN, SYSTEM_TOKEN } from "@/config";

export default {
  name: "TopMTRAccounts",
  components: {
    DataTableV2,
  },
  data() {
    return {
        title: "Top " + SYSTEM_COIN + " Accounts",
      accounts: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "mtrRank", label: "Rank" },
          { key: "fullAddress", label: "Address" },
          { key: "totalMTR", label: SYSTEM_COIN + " Balance" },
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
        return {
          totalMTR: {
            type: "amount",
            amount: new BigNumber(a.mtrBalance).plus(a.mtrBounded).toFixed(),
            token: SYSTEM_COIN,
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
