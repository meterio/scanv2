<template lang="pug">
.home
  //- search-banner
  .search-banner
    .container
      h1.title {{ currentChain.title }} Blockchain Explorer
      auto-search-input(@selected='selected', large)
      //- search.mt25(:btnType='2', placeholder='Search Transation/Blocks/Address/Name', @click='searchKeyWords')
    //- block statistic
  data-dashboard.mt-n5(v-bind:rows='data', :ncols="4", v-if='data.length > 0')
    //- node statistic
  b-container.px-0
    b-row
      b-col(cols='12', lg='6')
        recent-blocks
      b-col(cols='12', lg='6')
        recent-txs
  b-modal(v-model='modal_show', hide-footer, hide-header)
    .text-center Search No More Data
</template>

<script>
import Search from '@/components/Search.vue';
import DataDashboard from '@/components/DataDashboard.vue';
import RecentBlocks from '@/components/RecentBlocks.vue';
import RecentTxs from '@/components/RecentTxs.vue';
import { formatNum } from '@/utils';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import AutoSearchInput from '@/components/AutoSearchInput.vue';

export default {
  name: 'Home',

  components: {
    Search,
    DataDashboard,
    RecentBlocks,
    RecentTxs,
    AutoSearchInput,
  },
  computed: {
    ...mapState({
      home_block_height: (state) => state.home_block_height,
    }),
  },

  data() {
    return {
      running: false,
      modal_show: false,
      // top nav tabs
      nav_tabs: ['PoS', 'PoW'],
      // fake data
      msg: 'Welcome to Index!!!',
      data: [],
    };
  },
  watch: {
    home_block_height(newVal) {
      for (const item of this.data) {
        if (item.label === 'Block Height') {
          item['content'] = newVal;
          return;
        }
      }
    },
  },
  mounted() {
    this.running = true;
  },
  methods: {
    async init() {
      const res = await this.$api.metric.getAll(this.network);
      this.loading = false;
      const { mtr, mtrg, pos, pow, staking, committee } = res;

      const stakingAPY = new BigNumber(staking.stakingAPY);
      this.data = [
        { label: 'Block Height', content: pos.best, cols: 3 },
        { label: 'Epoch', content: pos.epoch, cols: 3 },
        { label: 'Transactions', content: pos.txsCount, cols: 3 },
        { label: 'Avg Block Time', content: pos.avgBlockTime + ' sec', cols: 3 },
        {
          label: 'Healthy / Total Nodes',
          content: `${staking.healthyNodes} / ${staking.candidates}`,
          cols: 3,
        },
        {
          label: 'Staking APY',
          content: stakingAPY.times(100).toFixed(2) + '%',
          cols: 3,
          // content:
          //   new BigNumber(staking.totalCirculationStaked)
          //     .dividedBy(1e18)
          //     .dividedBy(mtrg.circulation)
          //     .times(100)
          //     .toFixed(2) + "%",
        },
        { label: 'Annual Network Inflation', content: pos.inflation, cols: 3 },
        // {
        //   label: "Avg Staking APY",
        //   content:
        //     new BigNumber(0.05)
        //       .dividedBy(stakingRatio)
        //       .times(100)
        //       .toFixed(2) + "%",
        // },
        {
          label: 'Address Count',
          content: pos.addressCount,
          cols: 3,
        },
      ];

      if (this.currentChain.priceEnable) {
        this.data.unshift(
          {
            label: `${this.currentChain.gSymbol} Price`,
            content: '$ ' + mtrg.price,
            change: mtrg.priceChange,
            cols: 3,
          },
          {
            label: `${this.currentChain.gSymbol} Circulation`,
            content: formatNum(mtrg.circulation, 0),
            cols: 3,
          },

          {
            label: `${this.currentChain.symbol} Price`,
            content: '$ ' + mtr.price,
            change: mtr.priceChange,
            cols: 3,
          },
          { label: `${this.currentChain.symbol} Circulation`, content: formatNum(mtr.circulation, 0), cols: 3 }
        );
      }

      if (this.running) {
        setTimeout(() => {
          this.init();
        }, 60 * 30 * 1000); // 30 min
      }
    },
    selected(item) {
      let jump_url = '';
      if (item.type === 'tx') {
        jump_url = `/tx/${item.hash}`;
      } else if (item.type == 'block') {
        jump_url = `/block/${item.number}`;
      } else if (item.type == 'address') {
        jump_url = `/address/${item.address}`;
      } else if (item.type == 'auction') {
        jump_url = `/auction/${item.id}`;
        // } else if (item.type == 'bid') {
        // jump_url = `/bid/${item.id}`;
      } else if (item.type == 'bucket') {
        jump_url = `/buckets/${item.id}`;
      } else {
        this.modal_show = true;
      }
      if (jump_url != this.$route.path && jump_url !== '' && !this.modal_show) {
        console.log('JUMP TO ', jump_url);
        this.$router.push(jump_url);
      } else {
      }
    },
    // async searchKeyWords(key) {
    //   try {
    //     const str = key.replace(/\r?\n|\r/g, '');
    //     const arr = str.match(/\([^\)]+\)/g);
    //     if (arr) {
    //       const address = arr[0].substring(1, arr[0].length - 1);
    //       this.$router.push('/address/' + address);
    //       return;
    //     }
    //     const { type } = await this.$api.search.searchKeyWord(this.network, str);
    //     if (type === 'tx') {
    //       this.$router.push('/tx/' + key);
    //     } else if (type == 'block') {
    //       this.$router.push('/block/' + key);
    //     } else if (type == 'address') {
    //       this.$router.push('/address/' + key);
    //     } else if (type == 'auction') {
    //       this.$router.push(`/auction/${key}`);
    //     } else if (type == 'bid') {
    //       this.$router.push(`/bid/${key}`);
    //     } else if (type == 'bucket') {
    //       this.$router.push(`/buckets/${key}`);
    //     } else {
    //       this.modal_show = true;
    //     }
    //   } catch (e) {
    //     console.error(e);
    //     this.modal_show = true;
    //   }
    // }
  },
  beforeDestroy() {
    this.running = false;
  },
};
</script>

<style lang="scss" scoped>
.search-banner {
  background: #003cb2;
  height: 230px;
  background-size: cover;
  display: flex;
  padding-top: 40px;
  // border-top: 1px solid rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: white;
  }
}

.card {
  margin: 1rem auto;
  padding: 1rem;

  hr {
    border-color: $border-light;
  }

  .border-r {
    border-right: 1px solid $border-light;
  }
}
</style>
