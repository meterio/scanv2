<template>
  <b-container class="container">
    <b-card body-class="block-card-body p-0" header="Recent Transactions">
      <b-card-text class="txs-card">
        <Loading v-if="loading" />

        <ul v-if="!loading" class="block-list">
          <li class="block-detail" :key="tx.txHash + index" v-for="(tx, index) in recent_txs">
            <div class="height-view">
              <div class="block-icon"></div>

              <div class="height">
                <router-link
                  :to="{
                    name: 'txDetail',
                    params: { hash: tx.txHash }
                  }"
                  >{{ shortHash(tx.txHash, 10) }}</router-link
                >
                <span class="ago"><time-tag :timestamp="tx.block.timestamp"/></span>
              </div>
            </div>

            <div class="signed-view">
              <p>
                <span class="d-none d-sm-inline mr-1">From:</span>
                <router-link class="link" :to="{ name: 'address', params: { address: tx.from } }">{{
                  shortAddr(tx.from, 12)
                }}</router-link>
              </p>
              <p>
                <span class="d-none d-sm-inline mr-1">To:</span>
                <router-link v-if="tx.to" class="link" :to="{ name: 'address', params: { address: tx.to } }">{{
                  shortAddr(tx.to, 12)
                }}</router-link>
                <span v-else>nobody</span>
              </p>
            </div>
            <div class="detail-view">
              <span class="detail">{{ tx.totalAmount }}</span>
            </div>
          </li>
        </ul>
      </b-card-text>
      <b-card-footer>
        <b-btn variant="outline-primary" block size="sm" :to="{ path: 'txs' }">View all Transactions</b-btn>
      </b-card-footer>
    </b-card>
  </b-container>
</template>

<script>
import Loading from '@/components/Loading';
import { fromWei } from '@/utils';
import { BigNumber } from 'bignumber.js';
import TimeTag from '@/components/TimeTag.vue';
export default {
  name: 'RecentTxs',
  components: { Loading, TimeTag },
  data() {
    return {
      loading: true,
      recent_txs: [],
      time: null
    };
  },
  mounted() {
    this.initData();
    this.clearTime();
    const me = this;
    this.time = setInterval(function() {
      me.initData();
    }, 3000);
  },
  beforeDestroy() {
    this.clearTime();
  },
  methods: {
    clearTime() {
      if (this.time) {
        clearInterval(this.time);
      }
    },
    async initData() {
      try {
        const res = await this.$api.transaction.getRecentTxs(this.network);
        this.recent_txs = res.txs.slice(0, 10).map(tx => {
          try {
            let totalAmount = '';
            if (tx.mtr && new BigNumber(tx.mtr).isGreaterThan(0)) {
              totalAmount = fromWei(tx.mtr, 4, this.currentChain.symbol);
            } else {
              totalAmount = fromWei(tx.mtrg, 4, this.currentChain.gSymbol);
            }

            return { ...tx, totalAmount };
          } catch (e) {
            console.log(e);
          }
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    jump(url) {
      this.$router.push(url);
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 20px auto;
  padding: 0;

  ul.block-list {
    margin: 0;
    padding: 0;

    li.block-detail {
      margin: 3px 0;
      padding: 8px 15px;
      @media only screen and (max-width: 500px) {
        padding: 8px 4px;
      }
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      border-bottom: 1px solid #efefef;
    }
  }
}

.txs-card {
  position: relative;
  height: 377px;
  overflow-y: auto;
  margin-bottom: 0;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.txs-card::-webkit-scrollbar {
  display: none;
  // width: 4px;
  // height: 4px;
  // background-color: #f5f5f5;
}
.txs-card::-webkit-scrollbar-thumb {
  // background-color: #dedede;
  // width: 4px;
  // border-radius: 10px;
}

.block-card-body {
  position: relative;
  // min-height: 400px;
}

.height-view {
  display: flex;

  .block-icon {
    background-image: url('~@/assets/transaction.png');
    background-color: #ebeef6;
    background-repeat: no-repeat;
    background-position: center;
    width: 42px;
    height: 42px;
    border-radius: 5px;
  }

  .height {
    margin-left: 20px;
    @media only screen and (max-width: 500px) {
      margin-left: 8px !important;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 14px;

    .number {
      font-size: 1rem;
      color: #0c2954;
      margin: 0;
      padding: 0;
    }

    .ago {
      font-size: 13px;
      color: #a6b5cc;
    }
  }
}

.signed-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  p {
    font-size: 14px;
    color: #5c6f8c;
    margin: 0;
  }

  a {
    font-size: 14px;
  }
}

.detail-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  .detail {
    padding: 3px 6px;
    font-size: 13px;
    color: #5c6f8c;
    background: #ebeef6;
    border-radius: 5px;
    max-width: 70px;
    text-align: center;
  }
}
</style>
