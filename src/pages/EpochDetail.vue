<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />

    <DataTableV2
      title="Committee Members"
      :fields="members.fields"
      :pagination="members.pagination"
      :loadItems="loadMembers"
    >
    </DataTableV2>
  </div>
</template>

<script>
import DataTableV2 from '@/components/DataTableV2.vue';
import DataSummary from '@/components/DataSummary.vue';
import { shortHash } from '@/utils';

export default {
  name: 'EpochDetail',
  components: {
    DataSummary,
    DataTableV2,
  },
  data() {
    return {
      summaryTitle: '',
      summary: [],
      members: {
        fields: [
          { key: 'index', label: 'Index' },
          { key: 'name', label: 'Name' },
          { key: 'fullAddress', label: 'Address' },
          { key: 'netAddr', label: 'IP Address' },
          { key: 'shortPubKey', label: 'Public Key' },
        ],
        pagination: { show: true, align: 'center', perPage: 20 },
      },
    };
  },
  async mounted() {
    const { epoch } = this.$route.params;
    const res = await this.$api.epoch.getEpoch(this.network, epoch);
    this.loading = false;
    const { summary, powBlocks } = res;
    this.summaryTitle = 'Epoch Detail';

    if (!!summary) {
      if (summary.endKBlock) {
        this.summary = [{ key: 'Epoch', value: summary.epoch, type: 'epoch-with-stats' }];
      } else {
        this.summary = [{ key: 'Epoch', value: summary.epoch }];
      }
      this.summary = this.summary.concat([
        { key: 'Start Block', value: summary.startKBlock, type: 'block-link' },
        { key: 'Start Time', value: summary.startTime, type: 'timestamp' },
        { key: 'End KBlock', value: summary.endKBlock, type: 'block-link' },
        { key: 'End Time', value: summary.endTime, type: 'timestamp' },
        {
          key: 'Duration',
          value: summary.duration * 1000,
          type: 'duration',
        },
        { key: 'Committee Size', value: summary.committeeSize },
      ]);

      if (this.currentChain.pow) {
        this.summary.push({ key: 'Pow Blocks Count', value: powBlocks ? powBlocks.length : 0 });
      }
    }
  },
  methods: {
    async loadMembers(network, page, limit) {
      const { epoch } = this.$route.params;
      const res = await this.$api.epoch.getMembers(network, epoch, page, limit);
      const { members, totalRows } = res;
      const items = members.map((m) => {
        return {
          ...m,
          shortPubKey: shortHash(m.pubKey),
          fullAddress: m.address,
        };
      });
      return { items, totalRows };
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 15px;
}
.vjs-tree {
  font-size: 12px !important;
  word-break: break-all !important;
  .vjs-key {
    font-size: 12px !important;
  }
  .vjs-value {
    font-size: 12px !important;
  }
}
</style>
