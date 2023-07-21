<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    title="Epochs",
    :fields="epochs_fields",
    :pagination="epochs.pagination",
    :loadItems="loadEpochs"
  )
</template>

<script>
import DataTableV2 from '@/components/DataTableV2.vue';
import { formatDuration } from '@/utils';

export default {
  name: 'EpochList',
  components: {
    DataTableV2,
  },
  data() {
    return {
      epochs: {
        pagination: { show: true, align: 'center', perPage: 25 },
        fields: [
          { key: 'epoch', label: 'Epoch' },
          { key: 'startKBlock', label: 'Start Block' },
          { key: 'endKBlock', label: 'End KBlock' },
          { key: 'startTime', label: 'Start Time' },
          { key: 'duration', label: 'Duration' },
          { key: 'committeeSize', label: 'nCommittee' },
          { key: 'powBlockCount', label: 'nPowBlocks' },
        ],
      },
    };
  },
  computed: {
    epochs_fields() {
      if (this.currentChain.pow) {
        return this.epochs.fields;
      }
      return [
        { key: 'epoch', label: 'Epoch' },
        { key: 'startKBlock', label: 'Start Block' },
        { key: 'endKBlock', label: 'End KBlock' },
        { key: 'startTime', label: 'Start Time' },
        { key: 'duration', label: 'Duration' },
        { key: 'committeeSize', label: 'nCommittee' },
      ];
    },
  },
  methods: {
    async loadEpochs(network, page, limit) {
      const res = await this.$api.epoch.getRecentEpochs(network, page, limit);
      const { epochs, totalRows } = res;
      const items = epochs.map((e) => {
        return {
          ...e,
          duration: e.active ? new Date().getTime() - 1000 * e.startTime : 1000 * (e.endTime - e.startTime),
          endKBlock: e.endKBlock == 0 ? -1 : e.endKBlock,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
