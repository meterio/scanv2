<template lang="pug">
.detail-page
  data-table-v2.mt-2pert.px-0(
    title="Epochs",
    :fields="epochs.fields",
    :pagination="epochs.pagination",
    :loadItems="loadEpochs"
  )
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import { formatDuration } from "@/utils";

export default {
  name: "EpochList",
  components: {
    DataTableV2,
  },
  data() {
    return {
      epochs: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "epoch", label: "Epoch" },
          { key: "startKBlock", label: "Start Block" },
          { key: "endKBlock", label: "End KBlock" },
          { key: "startTime", label: "Start Time" },
          { key: "duration", label: "Duration" },
          { key: "committeeSize", label: "nCommittee" },
          { key: "powBlockCount", label: "nPowBlocks" },
        ],
      },
    };
  },

  methods: {
    async loadEpochs(network, page, limit) {
      const res = await this.$api.epoch.getRecentEpochs(network, page, limit);
      const { epochs, totalRows } = res;
      const items = epochs.map((e) => {
        return {
          ...e,
          duration: e.active ? 0 : 1000 * (e.endTime - e.startTime),
          endKBlock: e.endKBlock == 0 ? -1 : e.endKBlock,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>
