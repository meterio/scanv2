<template>
  <b-container>
    <div v-if="loading" class="position-relative epoch-loading">
      <Loading />
    </div>
    <div v-else class="detail-page">
      <section class="d-flex justify-content-between flex-wrap">
        <span class="epoch-detail p-1 rounded" v-for="(value, key, indx) in detail" :key="indx">
          {{ key }}: {{ value }}
        </span>
      </section>
      <section class="d-flex justify-content-between flex-wrap mt-2">
        <span v-for="(summary, round) in stats" :key="round">
          <span
            :style="{cursor: 'pointer'}"
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
      </section>
    </div>
  </b-container>
</template>

<script>
import Loading from "../components/Loading.vue";

export default {
  name: 'EpochDetail',
  components: { Loading },
  data() {
    return {
      loading: false,
      stats: [],
      memberMap: {},
      detail: {
        Epoch: '1',
        Blocks: '2',
        Committee: '3',
        Timeouts: '4',
        Duration: '5',
      }
    };
  },
  async mounted() {
    this.loading = true;

    const { epoch } = this.$route.params;
    const res = await this.$api.epoch.getStats(this.network, epoch);
    
    const { startBlock, endBlock, committeeSize, stats, members } = res;
    this.detail = {
      Epoch: epoch,
      Blocks: endBlock.number - startBlock.number + 1,
      Committee: committeeSize,
      Timeouts: stats.filter(item => item.status !== 1).length,
      Duration: (endBlock.timestamp - startBlock.timestamp) / 60 + 'm',
    }
    this.stats = stats;
    this.members = members;
    members.forEach((m) => {
      this.memberMap[m.index] = m.name;
    });

    this.loading = false;
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
.epoch-detail {
  background-color: rgba(0, 0, 0, 0.125);
}
.epoch-loading {
  height: 200px;
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
