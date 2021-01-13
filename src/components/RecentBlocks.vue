<template>
  <b-container class="container">
    <b-card body-class="block-card-body p-0" header="Recent Blocks">
      <b-card-text>
        <Loading v-if="loading" />

        <ul v-if="!loading" class="block-list">
          <li
            class="block-detail"
            :key="block.id"
            v-for="block in recent_blocks"
          >
            <div class="height-view">
              <div class="block-icon"></div>

              <div class="height">
                <h4 class="number">
                  <router-link
                    :to="{
                      name: 'blockDetail',
                      params: { revision: block.number }
                    }"
                  >
                    {{ block.number }}</router-link
                  >
                </h4>

                <span class="ago">{{ timeFromNow(block.timestamp) }}</span>
              </div>
            </div>

            <div class="signed-view">
              <p>Signed by</p>
              <a href="#">{{ address(block.signer) }}</a>
            </div>
            <div class="detail-view">
              <span class="detail">{{ block.txCount }} tx</span>
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
import { setInterval } from "timers";

export default {
  name: "RecentBlocks",
  components: {
    Loading
  },
  data() {
    return {
      loading: true,
      recent_blocks: [],
      time: null
    };
  },
  async mounted() {
    this.initData();
    this.clearTime();
    const me = this;
    this.time = setInterval(function() {
      me.initData();
    }, 3000);
  },
  methods: {
    async initData() {
      try {
        const res = await this.$api.block.getRecentBlocks();
        this.loading = false;
        this.recent_blocks = res.blocks.splice(0, 5);
      } catch (e) {
        this.loading = false;
      }
    },
    clearTime() {
      if (this.time) {
        clearInterval(this.time);
      }
    },
    timeFromNow(time) {
      return fromNow(time * 1000);
    },
    address(addr) {
      return shortAddress(addr);
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
    background-image: url("~@/assets/block.png");
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
    width: 50px;
    text-align: center;
  }
}
</style>
