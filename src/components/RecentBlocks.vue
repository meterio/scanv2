<template>
  <b-container class="container">
    <b-card body-class="block-card-body p-0" header="Recent Blocks">
      <b-card-text class="blk-card">
        <Loading v-if="loading" />

        <ul v-if="!loading" class="block-list">
          <li class="block-detail" :key="block.id" v-for="block in recent_blocks">
            <div class="height-view">
              <div class="block-icon"></div>

              <div class="height">
                <h4 class="number">
                  <router-link
                    :to="{
                      name: 'blockDetail',
                      params: { revision: block.number },
                    }"
                  >
                    {{ block.number }}</router-link
                  >
                </h4>

                <span class="ago"><time-tag :timestamp="block.timestamp" /></span>
              </div>
            </div>

            <div class="signed-view">
              <p>Proposer</p>
              <router-link
                class="link"
                v-if="block.beneficiaryName"
                :to="{
                  name: 'address',
                  params: { address: block.beneficiary },
                }"
                >{{ shortAddr(block.beneficiaryName, 12) }}</router-link
              >
              <router-link
                class="link"
                v-else
                :to="{
                  name: 'address',
                  params: { address: block.beneficiary },
                }"
                >{{ shortAddr(block.beneficiary, 12) }}</router-link
              >
            </div>
            <div class="detail-view">
              <span class="detail">{{ block.txCount }} tx</span>
            </div>
          </li>
        </ul>
      </b-card-text>
      <b-card-footer class="p-0">
        <b-btn class="p-2" variant="outline-primary" block size="sm" :to="{ name: 'blockList' }"
          >View all Blocks
          <b-icon icon="arrow-right"></b-icon>
        </b-btn>
      </b-card-footer>
    </b-card>
  </b-container>
</template>

<script>
import Loading from '@/components/Loading';
import { mapActions } from 'vuex';
import TimeTag from '@/components/TimeTag.vue';

export default {
  name: 'RecentBlocks',
  components: { Loading, TimeTag },
  data() {
    return {
      loading: true,
      recent_blocks: [],
      time: null,
      running: false,
    };
  },
  async mounted() {
    this.running = true;
    this.initData();
  },
  async beforeDestroy() {
    this.running = false;
  },
  methods: {
    ...mapActions(['configVal']),
    async initData() {
      try {
        const res = await this.$api.block.getRecentBlocks(this.network);
        this.loading = false;
        this.recent_blocks = res.blocks.splice(0, 10);
        if (this.recent_blocks.length > 0) {
          this.configVal({
            key: 'home_block_height',
            val: this.recent_blocks[0].number,
          });
        }
      } catch (e) {
        this.loading = false;
      }
      if (this.running) {
        setTimeout(this.initData, 3000);
      }
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
    padding: 0;

    li.block-detail {
      margin: 3px 0;
      padding: 8px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      border-bottom: 1px solid #efefef;
    }
  }
}

.blk-card {
  position: relative;
  height: 377px;
  overflow-y: auto;
  margin-bottom: 0;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.blk-card::-webkit-scrollbar {
  display: none;
  // width: 4px;
  // height: 4px;
  // background-color: #f5f5f5;
}
.blk-card::-webkit-scrollbar-thumb {
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
    background-image: url('~@/assets/block.png');
    background-color: #ebeef6;
    background-repeat: no-repeat;
    background-position: center;
    width: 42px;
    height: 42px;
    border-radius: 5px;
  }

  .height {
    margin-left: 20px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    a {
      font-size: 15px;
    }

    .number {
      font-size: 15px;
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

.btn-block.btn-outline-primary {
  color: $color-gray-450;
  border: none;
  border-radius: 0 0 0.75rem 0.75rem !important;
  &:hover {
    color: white;
  }
}
</style>
