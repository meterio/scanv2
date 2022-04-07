<template>
  <div class="detail-page">
    <div v-for="(statsRound, round) in this.stats" :key="round">
      <span> Round {{ round }}</span>
      <span
        :title="memberMap[index]"
        v-for="(stat, index) in statsRound"
        :key="index"
        :class="stat == 0 ? 'gray' : stat == 1 ? 'success' : 'fail'"
      >
        {{ stat }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "EpochDetail",
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
    this.summaryTitle = "Epoch Detail";
    this.stats = stats;
    this.members = members;
    members.forEach((m) => {
      this.memberMap[m.index] = m.name;
    });
  },
  methods: {},
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