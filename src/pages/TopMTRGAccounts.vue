<template lang="pug">
.detail-page
  data-table.mt-2pert.px-0(
    title="Top MTRG Accounts",
    :data="accounts",
    :loading="loading",
    :pagination="accounts.pagination",
    :paginateTotal="paginateTotal",
    :paginateCurrentPage="page",
    @tablePaginationChange="pgChange"
  )
    template(v-slot:cell(number)="data")
      .dt-row
        router-link.link(
          :to="{ name: 'blockDetail', params: { network: $route.params.network, revision: data.item.number } }"
        ) {{ '#' + data.item.number }}

    template(v-slot:cell(signer)="data")
      .dt-row
        router-link.link(
          :to="{ name: 'address', params: { network: $route.params.network, address: data.item.signer } }"
        ) {{ data.item.signer }}
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import BigNumber from "bignumber.js";
import PieChart from "@/components/PieChart.vue";
import DataTable from "@/components/DataTable.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
export default {
  name: "Address",
  components: {
    PieChart,
    DataTable,
    NavTabs,
    DataSummary,
  },
  data() {
    return {
      paginateTotal: 0,
      loading: true,
      page: 1,
      limit: 20,
      accounts: {
        pagination: {
          show: true,
          align: "center",
          perPage: 8,
        },
        fields: [
          { key: "mtrgRank", label: "Rank" },
          { key: "fullAddress", label: "Address" },
          { key: "name", label: "Name" },
          { key: "mtrgBalanceStr", label: "MTRG Balance" },
        ],
        items: [],
      },
    };
  },

  methods: {
    init() {
      this.loadTopMTRG();
    },
    pgChange(val) {
      this.page = val;
      console.log("page change");
      this.loadTopMTRG();
    },
    async loadTopMTRG() {
      this.loading = true;
      try {
        this.accounts.items = [];
        const { accounts, totalPage } = await this.$api.account.getTopMTRG(
          this.$route.params.network,
          this.page,
          this.limit
        );
        console.log("accounts:", accounts, "totalPage:", totalPage);
        this.paginateTotal = totalPage * this.limit;
        this.accounts.items = accounts.map((a) => {
          return { ...a, fullAddress: a.address };
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
  },
};
</script>


