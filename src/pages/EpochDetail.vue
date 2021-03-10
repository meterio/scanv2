<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />

    <DataTableV2
      title="Committee Members"
      :fields="members.fields"
      :items="members.items"
    >
      <template v-slot:cell(to)="data">
        <div class="dt-row">
          <router-link
            class="link"
            :to="{
              name: 'address',
              params: { address: data.value },
            }"
            >{{ data.value }}</router-link
          >
        </div>
      </template>

      <template v-slot:cell(data)="row">
        <div class="dt-row breakable">
          {{ row.value }}
        </div>

        <div v-if="row.row_hovered"></div>
        <b-button
          v-if="row.item.decoded"
          size="sm"
          variant="outline-secondary"
          @click="row.toggleDetails"
          class="mr-2 float-right"
        >
          <span v-if="!row.detailsShowing">
            <b-icon icon="chevron-double-down"></b-icon> Show Decoded
          </span>
          <span v-else>
            <b-icon icon="chevron-double-up"></b-icon> Hide Decoded
          </span>
        </b-button>
      </template>
    </DataTableV2>
  </div>
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import DataSummary from "@/components/DataSummary.vue";
import { shortHash } from "@/utils";

export default {
  name: "EpochDetail",
  components: {
    DataSummary,
    DataTableV2,
  },
  data() {
    return {
      summaryTitle: "",
      summary: [],
      members: {
        fields: [
          { key: "index", label: "Index" },
          { key: "netAddr", label: "IP Address" },
          { key: "shortPubKey", label: "Public Key" },
        ],
        items: [],
      },
    };
  },
  async mounted() {
    const { epoch } = this.$route.params;
    const res = await this.$api.epoch.getEpoch(this.network, epoch);
    this.loading = false;
    const { summary, members, powBlocks } = res;
    this.summaryTitle = "Epoch Detail";
    console.log(summary);
    console.log(members);

    if (!!summary) {
      this.summary = [
        { key: "Epoch", value: summary.epoch },
        { key: "Start Block", value: summary.startKBlock, type: "block-link" },
        { key: "Start Time", value: summary.startTime, type: "timestamp" },
        { key: "End KBlock", value: summary.endKBlock, type: "block-link" },
        { key: "End Time", value: summary.endTime, type: "timestamp" },
        {
          key: "Duration",
          value: summary.duration * 1000,
          type: "duration",
        },
        { key: "Committee Size", value: summary.committeeSize },
        { key: "Pow Blocks Count", value: powBlocks ? powBlocks.length : 0 },
      ];
    }
    this.members.items = members.map((m) => ({
      ...m,
      shortPubKey: shortHash(m.pubKey),
    }));
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
