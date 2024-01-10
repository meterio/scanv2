<template>
  <b-container>
    <b-card class="stats">
      <div v-if="loading" class="position-relative epoch-loading">
        <Loading />
      </div>
      <div v-else>
        <section class="d-flex justify-content-center title-row">
          <!-- <b-link class="link" :to="{ name: 'epochStats', params: { epoch: Number(epoch) - 1 } }">&lt;&lt;</b-link> -->
          Statistics for Epoch: {{ epoch }}
          <!-- <b-link class="link" :to="{ name: 'epochStats', params: { epoch: Number(epoch) + 1 } }"> &gt;&gt; </b-link> -->
        </section>

        <section class="row mt-1">
          <div class="col-md-4 d-flex align-center">
            <span class="success m-1 px-2">B</span> success round producing mBlock<br />
          </div>
          <div class="col-md-4 d-flex align-center">
            <span class="success m-1 px-2">KB</span> success round producing KBlock<br />
          </div>
          <div class="col-md-4 d-flex align-center">
            <span class="fail m-1 px-2">F</span> failed round, no block produced
          </div>
          <div class="col-md-4 d-flex align-center">
            <span class="success delay-5s m-1 px-2">B</span> success round, delays 5-20s<br />
          </div>
          <div class="col-md-4 d-flex align-center">
            <span class="success delay-20s m-1 px-2">B</span> success round, delays 20-60s<br />
          </div>
          <div class="col-md-4 d-flex align-center">
            <span class="success delay-1m m-1 px-2">B</span> success round, delays &gt; 1min<br />
          </div>
        </section>
        <hr />
        <section class="d-flex justify-content-between flex-wrap mb-1 hints">
          <span class="p-1 rounded" v-for="(value, key, indx) in detail" :key="indx"> {{ key }}: {{ value }} </span>
        </section>
        <section class="d-flex flex-wrap">
          <span v-for="(summary, round) in stats" :key="round">
            <span
              class="d-block m-1 px-2"
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
            >
              {{ summary.status == 1 ? (summary.k ? 'KB' : 'B') : 'F' }}
            </span>
            <b-tooltip :target="'round-' + round">
              <div>Round: {{ round }}</div>

              <div v-if="summary.status == 1">{{ summary.k ? 'K' : 'm' }}Block: {{ summary.b }}</div>
              <div v-else>
                <div>Status: timeout</div>
                <div>Expected Block: {{ summary.b }}</div>
              </div>

              <div v-if="summary.status == 1">Used: {{ summary.intvl }} sec</div>

              <div v-if="summary.status == 1">Proposer: {{ memberAt(round).name }}</div>
              <div v-else>Expected: {{ memberAt(round).name }}</div>
            </b-tooltip>
          </span>
        </section>
      </div>
    </b-card>
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
        Blocks: '0',
        'Committee Size': '0',
        Timeouts: '0',
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
      Blocks: endBlock.number - startBlock.number + 1,
      'Committee Size': committeeSize,
      Timeouts: stats.filter((item) => item.status !== 1).length,
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
  color: #f39c12;
  text-decoration: underline;
}
.delay-5s {
  text-decoration: underline;
}
.normal {
  background: gray;
}
.title-row {
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.4rem 0 1rem;
}
hr {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.stats {
  margin-top: 30px;
}
.hints {
  font-size: 90%;
}
</style>
