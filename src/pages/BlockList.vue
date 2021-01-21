<template lang="pug">
.detail-page
  data-table.mt-2pert.px-0(
    title="Blocks",
    :data="blocks",
    :loading="loading",
    :pagination="blocks.pagination",
    :paginateTotal="paginateTotal",
    :paginateCurrentPage="page",
    @tablePaginationChange="pgChange"
  )
    template(v-slot:cell(number)="data")
      .dt-row
        router-link.link(
          :to="{ name: 'blockDetail', params: { revision: data.item.number } }"
        ) {{ '#' + data.item.number }}

    template(v-slot:cell(beneficiary)="data")
      .dt-row
        router-link.link(
          :to="{ name: 'address', params: { address: data.item.beneficiary } }"
        ) {{ data.item.beneficiary }}
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
export default {
  name: "Address",
  components: {
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
      blocks: {
        pagination: {
          show: true,
          align: "center",
          perPage: 8,
        },
        fields: [
          { key: "number", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "txCount", label: "Txns" },
          { key: "beneficiary", label: "Proposer" },
        ],
        items: [],
      },
    };
  },
  methods: {
    init() {
      this.loadBlocks();
    },
    pgChange(val) {
      this.page = val;
      this.loadBlocks();
    },
    async loadBlocks() {
      this.loading = true;
      try {
        const { address } = this.$route.params;
        this.blocks.items = [];
        const { blocks, totalPage } = await this.$api.block.getRecentBlocks(
          this.network,
          this.page,
          this.limit
        );
        this.paginateTotal = totalPage * this.limit;
        this.blocks.items = blocks;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
  },
};
</script>
