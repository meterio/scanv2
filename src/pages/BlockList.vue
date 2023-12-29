<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    title="Blocks",
    :fields="blocks.fields",
    :pagination="blocks.pagination",
    :loadItems="loadBlocks"
  )
    template(v-slot:cell(number)="data")
      .dt-row
        router-link.link(
          :to="{ name: 'blockDetail', params: { revision: data.item.number } }"
        ) {{ '#' + data.item.number }}

    template(v-slot:cell(beneficiary)="data")
      .dt-row.text-break
        router-link.link(
          :to="{ name: 'address', params: { address: data.item.beneficiary } }"
        ) {{ data.item.beneficiary }}
</template>

<script>
import DataTableV2 from '@/components/DataTableV2.vue';
export default {
  name: 'BlockList',
  components: {
    DataTableV2,
  },
  data() {
    return {
      blocks: {
        pagination: { show: true, align: 'center', perPage: 25 },
        fields: [
          { key: 'number', label: 'Block' },
          { key: 'timestamp', label: 'Time' },
          { key: 'txCount', label: 'Txns' },
          { key: 'beneficiary', label: 'Proposer' },
        ],
      },
    };
  },
  methods: {
    async loadBlocks(network, page, limit) {
      this.loading = true;
      const { blocks, totalRows } = await this.$api.block.getRecentBlocks(network, page, limit);
      const items = blocks;
      return { items, totalRows };
    },
  },
};
</script>
