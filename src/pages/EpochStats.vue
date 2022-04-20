<template>
  <b-container>
    <div class="detail-page">
      <span v-for="(summary, round) in this.stats" :key="round">
        <span
          width="40"
          height="40"
          :id="'round-' + round"
          :title="memberAt(round).name"
          :class="summary.status == 1 ? 'success' : 'fail'"
          >&nbsp;
          {{ summary.status == 1 ? 'B' : 'F' }}
        </span>
        <b-tooltip :target="'round-' + round">
          <div>Round: {{ round }}</div>
          <div v-if="summary.status == 1">Block: {{ summary.b }}</div>
          <div v-else>Status: timeout</div>
          <div v-if="summary.status == 1">Proposer: {{ memberAt(round).name }}</div>
          <div v-else>Expected: {{ memberAt(round).name }}</div>
        </b-tooltip>
      </span>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'EpochDetail',
  components: {},
  data() {
    return {
      stats: [],
      memberMap: {},
    };
  },
  async mounted() {
    const { epoch } = this.$route.params;
    const res = await this.$api.epoch.getStats(this.network, epoch);
    this.loading = false;
    const { startBlock, endBlock, stats, members } = res;
    this.summaryTitle = 'Epoch Detail';
    this.stats = stats;
    this.members = members;
    members.forEach((m) => {
      this.memberMap[m.index] = m.name;
    });
  },
  computed: {},
  methods: {
    memberAt(round) {
      const size = this.members.length;
      return this.members[round % size];
    },
  },
};
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 15px;
}
.success {
  background: rgba(36, 174, 143, 0.08);
  color: #01aa78;
  border: 1px solid white;
  margin: 3px 3px 3px 1px;
  padding: 1px 2px 1px 5px;
}
.fail {
  background: rgb(255, 73, 95, 0.08);
  color: #ff495f;
  border: 1px solid #ff495f;
  margin: 3px 3px 3px 1px;
  padding: 1px 2px 1px 5px;
}
.normal {
  background: gray;
}
</style>
