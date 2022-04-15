<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    :title="title",
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
          { key: "name", label: "Name" },
          { key: "fullAddress", label: "Address" },
          { key: "totalMTRG", label: "Balance" },
        ],
      },
    };
  },
  computed: {
    title() {
      return `Top ${this.currentChain.gSymbol} Accounts`
    }
  },
  methods: {
    async loadTopMTRG(network, page, limit) {
      console.log("load data");
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
            token: this.currentChain.gSymbol,
          },
          fullAddress: a.address,
          mtrgRank: a.mtrgRank,
          name: a.name || '-',
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
