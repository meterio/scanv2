<template>
  <div class="detail-page">
    <span v-for="(summary, round) in this.stats" :key="round">
      <span :id="'round-' + round" :title="memberAt(round).name" :class="summary.status == 1 ? 'success' : 'fail'">
        {{ summary.status }}
      </span>
      <b-tooltip :target="'round-' + round">
        <div>Round: {{ round }}</div>
        <div>Expected: {{ memberAt(round).name }}</div>
        <div>Block: {{ summary.b }}</div>
      </b-tooltip>
    </span>
  </div>
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
  background: green;
}
.fail {
  background: red;
}
.normal {
  background: gray;
}
</style>
