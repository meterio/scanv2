<template>
  <b-container class="container">
    <b-card body-class="block-card-body p-0" header="Recent Transactions">
      <b-card-text>
        <Loading v-if="loading" />

        <ul v-if="!loading" class="block-list">
          <li class="block-detail" :key="tx.txID" v-for="tx in recent_txs">
            <div class="height-view">
              <div class="block-icon"></div>

              <div class="height">
                <router-link
                  :to="{ name: 'txDetail', params: { hash: tx.hash } }"
                  >{{ address(tx.hash) }}</router-link
                >
                <span class="ago">{{ timeFromNow(tx.block.timestamp) }}</span>
              </div>
            </div>

            <div class="signed-view">
              <p>
                From:
                <router-link
                  class="link"
                  :to="{ name: 'address', params: { address: tx.origin } }"
                  >{{ address(tx.origin) }}</router-link
                >
              </p>
              <p>
                To:
                <router-link
                  v-if="tx.tos.length > 0"
                  class="link"
                  :to="{
                    name: 'address',
                    params: { address: tx.tos[0].address },
                  }"
                  >{{ address(tx.tos[0].address) }}</router-link
                >
                <span v-else>nobody</span>
              </p>
            </div>
            <div class="detail-view">
              <span class="detail">{{ tx.totalAmountStrs[0] }}</span>
            </div>
          </li>
        </ul>
      </b-card-text>
    </b-card>
  </b-container>
</template>

<script>
import Loading from "@/components/Loading";
import { fromNow } from "@/utils/time";
import { shortAddress } from "@/utils/address";

export default {
  name: "RecentTxs",
  components: {
    Loading,
  },
  data() {
    return {
      loading: true,
      recent_txs: [],
    };
  },
  async mounted() {
    const res = await this.$api.transaction.getRecentTxs();
    this.loading = false;
    this.recent_txs = res.txs.splice(0, 5);
  },
  methods: {
    timeFromNow(time) {
      return fromNow(time * 1000);
    },
    address(addr) {
      return shortAddress(addr);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin: 20px auto;
  padding: 0;

  ul.block-list {
    margin: 0;

    li.block-detail {
      margin: 10px 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 60px;
    }
  }
}

.block-card-body {
  position: relative;
  min-height: 400px;
}

.height-view {
  display: flex;

  .block-icon {
    background-image: url("~@/assets/transaction.png");
    background-color: #ebeef6;
    background-repeat: no-repeat;
    background-position: center;
    width: 50px;
    height: 50px;
    border-radius: 5px;
  }

  .height {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;

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
  justify-content: center;
  align-items: flex-end;

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
