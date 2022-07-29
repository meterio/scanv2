<template>
  <b-container>
    <div v-if="loading" class="position-relative epoch-loading">
      <Loading />
    </div>
    <div v-else class="detail-page">
      <section class="d-flex justify-content-center title-row">
        <!-- <b-link class="link" :to="{ name: 'epochStats', params: { epoch: Number(epoch) - 1 } }">&lt;&lt;</b-link> -->
        Statistics for Epoch: {{ epoch }}
        <!-- <b-link class="link" :to="{ name: 'epochStats', params: { epoch: Number(epoch) + 1 } }"> &gt;&gt; </b-link> -->
      </section>
      <section class="d-flex justify-content-between flex-wrap">
        <span class="p-1 rounded" v-for="(value, key, indx) in detail" :key="indx"> {{ key }}: {{ value }} </span>
      </section>
      <section class="row">
        <div class="col-md-4"><span class="fail">F</span> - failed round, no block produced</div>
        <div class="col-md-4"><span class="success">B</span> - success round producing mBlock <br /></div>
        <div class="col-md-4"><span class="success">KB</span> - success round producing KBlock<br /></div>
        <div class="col-md-4"><span class="success delay-1m">B</span> - success round, with > 1min delay<br /></div>
        <div class="col-md-4"><span class="success delay-20s">B</span> - success round, with > 20s delay<br /></div>
        <div class="col-md-4"><span class="success delay-5s">B</span> - success round, with > 5s delay<br /></div>
      </section>
      <section class="d-flex flex-wrap mt-2">
        <span v-for="(summary, round) in stats" :key="round">
          <span
            :style="{ cursor: 'pointer' }"
            :id="'round-' + round"
            :title="memberAt(round).name"
            :class="
              (summary.status == 1 ? 'success' : 'fail') +
              ' ' +
              (summary.intvl > 60
                ? 'delay-1m'
                : summary.intvl > 20
                ? 'delay-20s'
                : summary.intvl > 5
                ? 'delay-5s'
                : 'no-delay')
            "
            >&nbsp;
            {{ summary.status == 1 ? (summary.k ? 'KB' : 'B') : 'F' }}
          </span>
          <b-tooltip :target="'round-' + round">
            <div>Round: {{ round }}</div>

            <div v-if="summary.status == 1">{{ summary.k ? 'K' : 'm' }}Block: {{ summary.b }}</div>
            <div v-else>Status: timeout</div>

            <div v-if="summary.status == 1">Used: {{ summary.intvl }} sec</div>

            <div v-if="summary.status == 1">Proposer: {{ memberAt(round).name }}</div>
            <div v-else>Expected: {{ memberAt(round).name }}</div>
          </b-tooltip>
        </span>
      </section>
    </div>
  </b-container>
</template>

<script>
import Loading from '../components/Loading.vue';
import { formatDuration } from '@/utils';
export default {
  name: 'EpochDetail',
  components: { Loading },
  data() {
    return {
      loading: false,
      epoch: 0,
      stats: [],
      memberMap: {},
      detail: {
        nBlocks: '0',
        'Committee Size': '0',
        'Timeout Count': '0',
        Duration: '0',
      },
    };
  },
  async mounted() {
    this.loading = true;

    const { epoch } = this.$route.params;
    this.epoch = epoch;
    const res = await this.$api.epoch.getStats(this.network, epoch);

    const { startBlock, endBlock, committeeSize, stats, members } = res;
    this.detail = {
      nBlocks: endBlock.number - startBlock.number + 1,
      'Committee Size': committeeSize,
      'Timeout Count': stats.filter((item) => item.status !== 1).length,
      Duration: formatDuration(1000 * (endBlock.timestamp - startBlock.timestamp)),
    };
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
.epoch-loading {
  height: 200px;
}
.link {
  margin-left: 10px;
  margin-right: 10px;
}
.kblock {
  border: 1px solid (36, 174, 143, 0.08);
  color: #3498db;
  border: 1px solid white;
  margin: 3px 3px 3px 1px;
  padding: 1px 3px 0px 4px;
}
.success {
  background: rgba(36, 174, 143, 0.08);
  color: #01aa78;
  border: 1px solid white;
  margin: 3px 3px 3px 1px;
  padding: 1px 3px 0px 4px;
}

.fail {
  background: rgb(255, 73, 95, 0.08);
  color: #ff495f;
  border: 1px solid #ff495f;
  border-radius: 5px;
  margin: 3px 3px 3px 1px;
  padding: 1px 3px 0px 4px;
}
.delay-1m {
  border: 1px solid #f39c12;
  color: #f39c12;
  border-radius: 5px;
}
.delay-20s {
  border: 1px solid #f1c40f;
  color: #f1c40f;
  border-radius: 5px;
}
.delay-5s {
  border: 1px solid #01aa78;
  border-radius: 5px;
}
.normal {
  background: gray;
}
.title-row {
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.4rem 0 1rem;
}
</style>
