<template>
  <b-container class="table-container data-table-container">
    <slot name="header"></slot>
    <b-card :title="title">
      <b-table
        v-if="isTableData"
        hover
        class="data-table"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :items="itemsLocal"
        :fields="fields"
        :busy.sync="loading"
        show-empty
        :style="{ minHeight: minHeight }"
        stacked="lg"
      >
        <template #table-busy>
          <div class="text-center text-primary my-2">
            <b-spinner small type="grow" class="align-middle mr-2"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template slot="empty">
          <div class="text-center pt15 text-grey" style="color: #5c6f8c">No data available.</div>
        </template>

        <template v-for="slotName in Object.keys($scopedSlots)" v-slot:[slotName]="slotScope">
          <slot :name="slotName" v-bind="slotScope"></slot>
        </template>

        <!-- Epoch column template -->
        <template v-slot:cell(epoch)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'epochDetail',
                params: { epoch: data.value },
              }"
              >{{ data.value }}</router-link
            >
          </div>
        </template>

        <!-- Duration column template-->
        <template v-slot:cell(duration)="data">
          <div class="dt-row">
            <span class="time">{{ formatDuration(data.value) }}</span>
          </div>
        </template>

        <!-- Time column template -->
        <template v-slot:cell(time)="data">
          <div class="dt-row">
            <span class="time">{{ data.value }}</span>
          </div>
        </template>
        <template v-slot:cell(timestamp)="data">
          <div class="dt-row">
            <time-tag :timestamp="data.value" />
          </div>
        </template>
        <template v-slot:cell(startTime)="data">
          <div class="dt-row">
            <time-tag :timestamp="data.value" />
          </div>
        </template>
        <template v-slot:cell(endTime)="data">
          <div class="dt-row" v-if="data.value">
            <time-tag :timestamp="data.value" />
          </div>
          <div class="dt-row" v-else>-</div>
        </template>

        <template v-slot:cell(direct)="data">
          <div class="dt-row">
            <DirectTag :direct="data.value" />
          </div>
        </template>

        <!-- Txhash column template -->
        <template v-slot:cell(txhash)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'txDetail',
                params: { hash: data.value },
              }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>

        <template v-slot:cell(txhashWithStatus)="data">
          <div class="dt-row">
            <span :style="{ display: !!data.value.status ? 'inline' : 'none' }" class="danger-icon">
              <b-icon icon="exclamation-circle-fill" variant="danger"></b-icon>
            </span>
            <router-link
              class="link"
              :to="{
                name: 'txDetail',
                params: { hash: data.value.hash },
              }"
              >{{ shortHash(data.value.hash) }}</router-link
            >
          </div>
        </template>

        <!-- Bucketid column template -->
        <template v-slot:cell(bucketid)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'bucket',
                params: { id: data.value },
              }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>

        <!-- fullAddress column template -->
        <template v-slot:cell(fullAddress)="data">
          <div class="dt-row">
            <address-link :address="data.value" />
          </div>
        </template>

        <!-- TxInfo column template -->
        <template v-slot:cell(txInfo)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'txDetail',
                params: { hash: data.value.txHash },
              }"
              >{{ shortHash(data.value.txHash) }}</router-link
            >
            <br />
            <router-link
              class="link"
              :to="{
                name: 'blockDetail',
                params: { revision: data.value.block.number },
              }"
              >#{{ data.value.block.number }}</router-link
            >
            <br />

            <span class="time">
              <time-tag :timestamp="data.value.block.timestamp" />
            </span>
          </div>
        </template>

        <!-- log column template -->
        <template v-slot:cell(log)="data">
          <div class="dt-row">
            {{ data.value.abi }}
            {{ data.value.decoded }}
          </div>
        </template>

        <!-- Event template -->
        <template v-slot:cell(event)="data">
          <div class="row pt-2 pb-2">
            <div class="breakable col-12 col-md-10">
              <div class="address-row">
                <span>Address: </span>
                <address-link :address="data.value.address" />
              </div>
              <div class="title-row" v-if="data.value.abi">{{ data.value.abi }}</div>
              <div class="title-row" v-if="data.value.topics.length > 0">Topics:</div>
              <div v-for="(topic, index) in data.value.topics" :key="index" class="topic-row">
                <span class="index">{{ index }}</span>
                <span>{{ topic }}</span>
              </div>

              <div v-if="data.value.datas && data.value.datas.length" class="mt-3">
                <h6 class="title-row">Data:</h6>
                <div v-for="(data, index) in data.value.datas" :key="index" class="data-row">
                  <span class="index">{{ index }}</span>
                  <span>{{ data }}</span>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-2">
              <b-button
                v-if="data.item.decoded"
                size="sm"
                variant="outline-secondary"
                @click="data.toggleDetails"
                class="mr-2 float-right"
              >
                <span v-if="!data.detailsShowing"> <b-icon icon="chevron-double-down"></b-icon> Decode</span>
                <span v-else> <b-icon icon="chevron-double-up"></b-icon> Hide</span>
              </b-button>
            </div>
          </div>
        </template>

        <!-- Address column template -->
        <template v-slot:cell(addressWithName)="data">
          <div class="dt-row">
            <address-link :address="data.address" :name="data.name" />
          </div>
        </template>
        <template v-slot:cell(address)="data">
          <div class="dt-row">
            <address-link :address="data.value" :short="true" />
          </div>
        </template>
        <template v-slot:cell(from)="data">
          <div class="dt-row">
            <address-link v-if="!data.value.address" :address="data.value" :short="true" />
            <address-link1 v-else :data="data.value" :short="true" />
          </div>
        </template>
        <template v-slot:cell(to)="data">
          <div class="dt-row" v-if="data.value">
            <address-link v-if="!data.value.address" :address="data.value" :short="true" />
            <address-link1 v-else :data="data.value" :short="true" />
          </div>
          <div v-else class="dt-row">-</div>
        </template>

        <!-- Block column template-->
        <template v-slot:cell(blocknum)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'blockDetail',
                params: { revision: data.value },
              }"
              >#{{ data.value }}</router-link
            >
          </div>
        </template>
        <template v-slot:cell(endKBlock)="data">
          <div class="dt-row" v-if="data.value >= 0">
            <router-link
              class="link"
              :to="{
                name: 'blockDetail',
                params: { revision: data.value },
              }"
              >#{{ data.value }}</router-link
            >
          </div>
          <div class="dt-row" v-else>-</div>
        </template>
        <template v-slot:cell(startKBlock)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'blockDetail',
                params: { revision: data.value },
              }"
              >#{{ data.value }}</router-link
            >
          </div>
        </template>

        <!-- Block hash column template -->
        <template v-slot:cell(blockhash)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'blockDetail',
                params: { revision: data.value },
              }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>

        <!-- Auction column template-->
        <template v-slot:cell(auctionid)="data">
          <div class="dt-row">
            <router-link :to="{ name: 'auctionDetail', params: { auctionID: data.value } }">Bids</router-link>
          </div>
        </template>

        <template v-slot:cell(auctionDetail)="data">
          <div class="dt-row">
            <router-link
              v-if="data.value.bidCount && data.value.bidCount > 0"
              :to="{
                name: 'auctionDetail',
                params: { auctionID: data.value.id },
              }"
              >{{ data.value.bidCount }}</router-link
            >
            <span v-else>{{ data.value.bidCount || 0 }}</span>
          </div>
        </template>

        <!-- Mining Reward -->
        <template v-slot:cell(powReward)="data">
          <div class="dt-row">
            <router-link :to="{ name: 'powRewards', params: { epoch: data.value } }"> Rewards </router-link>
          </div>
        </template>

        <!-- Pos Reward template -->
        <template v-slot:cell(posReward)="data">
          <div class="dt-row">
            <router-link :to="{ name: 'posRewards', params: { epoch: data.value } }">Rewards</router-link>
          </div>
        </template>

        <!-- Pos Reward template -->
        <template v-slot:cell(details)="data">
          <div class="dt-row">
            <div v-for="(topic, index) in data.value.topics" :key="index">
              <span class="mr-1">topic {{ index }}:</span>
              <span>{{ topic }}</span>
            </div>
            <div class="mt-3">
              <span class="mr-1">data:</span>
              <span>{{ data.value.data }}</span>
            </div>
          </div>
        </template>

        <!-- method name -->
        <template v-slot:cell(methodName)="data">
          <div class="dt-row">
            <DirectTag :direct="data.value" />
          </div>
        </template>

        <!-- method name -->
        <template v-slot:cell(method)="data">
          <div class="dt-row">
            {{ data.value | shortName }}
          </div>
        </template>

        <!-- NFT Tokens -->
        <template v-slot:cell(nftTokens)="data">
          <div class="dt-row breakable">
            <span v-for="(n, index) in data.value" :key="index" class="topic-row text-nowrap">
              <nft-link
                :address="n.address"
                :tokenId="n.id"
                :value="n.val"
                :disabled="n.nolink"
                :mediaUrl="n.mediaUrl"
              />
            </span>
          </div>
        </template>

        <!-- NFT -->
        <template v-slot:cell(nft)="data">
          <div class="dt-row breakable">
            <div v-if="data.value.account" class="address-row">
              <span>Account: </span>
              <address-link :address="data.value.account" />
            </div>

            <section v-if="data.value.nftBalances">
              <span v-for="(n, index) in data.value.nftBalances" :key="index" class="topic-row text-nowrap index">
                <nft-link
                  :address="data.value.address"
                  :tokenId="n.tokenId"
                  :value="n.value"
                  :disabled="data.value.nolink"
                  :mediaUrl="n.mediaUrl"
                />
              </span>
            </section>
          </div>
        </template>

        <template #row-details="data">
          <b-card>
            <!-- <div style="word-break: break-all"> -->
            <VueJsonPretty :data="data.item.decoded" />
            <!-- </div> -->
          </b-card>
        </template>

        <!-- default template -->
        <template v-slot:cell()="data">
          <div class="dt-row">
            <!-- amount tag -->
            <amount-tag
              v-if="data.value.type == 'amount'"
              :amount="data.value.amount"
              :token="data.value.token"
              :precision="data.value.precision"
              :decimals="data.value.decimals || 18"
            />
            <router-link
              v-if="data.value.type == 'block'"
              class="link"
              :to="{
                name: 'blockDetail',
                params: { revision: data.value.block },
              }"
              >#{{ data.value.block }}</router-link
            >
            <label v-if="data.value.type == 'percentage'">{{ Math.round(data.value.amount * 1000) / 10 }}%</label>

            <span v-if="!data.value.type">{{ data.value }}</span>
          </div>
        </template>
      </b-table>
      <slot v-else name="otherData"></slot>

      <div v-if="pagination.show && totalRows > pagination.perPage" class="data-pagination">
        <b-pagination
          :align="pagination.align"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="pagination.perPage"
          @change="pageChange"
        ></b-pagination>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import DirectTag from './DirectTag.vue';
import AmountTag from './AmountTag.vue';
import AddressLink from './AddressLink.vue';
import AddressLink1 from './AddressLink1.vue';
import NftLink from './NftLink.vue';
import VueJsonPretty from 'vue-json-pretty';
import TimeTag from './TimeTag.vue';
export default {
  components: { DirectTag, AddressLink, AddressLink1, AmountTag, NftLink, VueJsonPretty, TimeTag },
  name: 'DataTable',
  props: {
    sortBy: { type: String },
    sortDesc: { type: Boolean },
    title: {
      type: String,
    },
    minHeight: {
      type: String,
      default: 'auto',
    },
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
    fields: {
      type: Array,
      default: function () {
        return [];
      },
    },
    pagination: {
      type: Object,
      default: function () {
        return {
          show: false,
          align: 'right',
        };
      },
    },
    loadItems: {
      type: Function,
    },
    isTableData: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      itemsLocal: [],
      totalRows: 0,
      currentPage: 1,
      loading: true,
    };
  },
  created() {
    const q = this.$route.query;
    if (q.p) {
      this.currentPage = Number(q.p);
    }
  },
  computed: {
    passedItems() {
      if (this.items) {
        return this.items.map((i) => i);
      }
      return undefined;
    },
  },
  watch: {
    passedItems(to, from) {
      this.initWithPassed();
    },
    currentPage(to, from) {
      if (!this.loadItems) {
        this.initWithPassed();
      }
    },
  },
  methods: {
    async initWithPassed() {
      // passed in items
      if (!!this.passedItems && this.passedItems.length > 0) {
        this.loading = true;
        const start = (this.currentPage - 1) * this.pagination.perPage;
        let end = 0;
        if (this.passedItems.length >= this.currentPage * this.pagination.perPage) {
          end = this.currentPage * this.pagination.perPage;
        } else {
          end = this.passedItems.length;
        }
        this.itemsLocal = this.passedItems.slice(start, end);
        this.totalRows = this.passedItems.length;
        this.loading = false;
        return;
      } else {
        this.currentPage = 1;
        this.itemsLocal = [];
        this.totalRows = 0;
        this.loading = false;
      }
    },
    async init() {
      try {
        if (this.loadItems && this.isTableData) {
          this.loading = true;
          const res = await this.loadItems(this.network, this.currentPage, this.pagination.perPage);
          const { items, totalRows } = res;
          this.itemsLocal = items;
          this.totalRows = totalRows;
          this.loading = false;
          return;
        }
      } catch (e) {
        console.log(e);
        this.itemsLocal = [];
        this.totalRows = 0;
      }
    },
    async pageChange(val) {
      if (val === this.currentPage) {
        return;
      }
      this.currentPage = val;
      this.init();

      this.$router.replace({ query: { ...this.$route.query, p: val } });
    },
  },
};
</script>

<style lang="scss">
.data-table {
  .dt-row {
    margin: 0.02rem !important;
  }

  .danger-icon {
    margin-right: 2px;
  }
}

.data-table-container {
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;

  tr td[role='cell'] {
    padding: 0.1rem;
  }

  .card-title {
    color: #0c2954 !important;
    font-size: 20px;
    padding-bottom: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    border-bottom: 1px dotted #e5e5e5;
  }

  .data-table {
    thead {
      th {
        border: none;
      }
    }

    tbody {
      td {
        border-top: 1px solid #e5e5e5;
      }
    }
  }

  .data-pagination {
    margin-top: 15px;
  }
}
</style>
