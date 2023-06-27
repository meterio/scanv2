<template>
  <b-container class="summary">
    <h2 class="title-row d-xl-flex">
      <div class="text-nowrap d-flex align-items-center">
        <img v-if="logoURI" class="mr-1" :src="logoURI" width="25" height="25" alt="" />
        <span class="title">{{ title }}</span>
      </div>
      <div class="text-break d-flex align-items-center">
        <span class="title-value">{{ titleValue }}</span>

        <span v-if="titleValue && titleCopyable">
          <b-button v-if="titleCopied" variant="outline-success" pill size="sm">
            <b-icon icon="check"></b-icon>
          </b-button>
          <b-button v-else @click="copyTitleToClipBoard(titleValue)" variant="light" pill size="sm">
            <b-icon icon="clipboard"></b-icon>
          </b-button>
        </span>
      </div>
    </h2>
    <b-card>
      <div class="loading" v-if="loading">
        <div class="text-center text-primary my-2">
          <b-spinner small type="grow" class="align-middle mr-2"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </div>

      <b-row v-else>
        <b-col :md="!isContract || 6">
          <b-row class="row" :key="item.key" v-for="item in computedData">
            <b-col sm="12" :md="labelCols">
              <span class="label">{{ item.key }}:</span>
            </b-col>
            <b-col sm="12" :md="contentCols">
              <span v-if="!item.type" class="value">{{ item.value }}</span>
              <span v-if="item.type == 'copyable'">
                {{ item.value }}
                <b-button v-if="copied" variant="outline-success" pill size="sm">
                  <b-icon icon="check"></b-icon>
                </b-button>
                <b-button v-else @click="copyToClipBoard(item.value)" variant="light" pill size="sm">
                  <b-icon icon="clipboard"></b-icon>
                </b-button>
              </span>

              <!-- block-link-with-time -->
              <span v-if="item.type == 'block-link-with-time'">
                <router-link
                  :to="{
                    name: 'blockDetail',
                    params: {
                      revision: item.block,
                    },
                  }"
                  >#{{ item.block }}</router-link
                >
                <span class="value" :title="item.time"> (<time-tag :timestamp="item.value" />)</span>
              </span>
              <span v-if="item.type == 'epoch-kblock-link'">
                <b-link href="#" :to="{ name: 'epochDetail', params: { revision: item.epoch } }">{{
                  item.epoch
                }}</b-link>
                <span class="ml-1 mr-1">/</span>
                <b-link href="#" :to="{ name: 'blockDetail', params: { revision: item.kblock } }"
                  >#{{ item.kblock }}</b-link
                >
              </span>

              <!-- block-link -->
              <b-link
                href="#"
                :to="{ name: 'blockDetail', params: { revision: item.value } }"
                v-if="item.type === 'block-link'"
                >#{{ item.value }}</b-link
              >

              <b-link
                href="#"
                :to="{ name: 'blockDetail', params: { revision: item.value } }"
                v-if="item.type === 'block-hash'"
                >{{ item.value }}</b-link
              >

              <!-- block-range -->
              <div v-if="item.type === 'block-range'">
                <b-link
                  href="#"
                  :to="{
                    name: 'blockDetail',
                    params: { revision: item.start },
                  }"
                  >#{{ item.start }}</b-link
                >
                <span class="mx-1">-</span>
                <b-link href="#" v-if="item.end" :to="{ name: 'blockDetail', params: { revision: item.end } }"
                  >#{{ item.end }}</b-link
                >
                <span v-else>active</span>
              </div>

              <!-- epoch-link -->
              <b-link
                href="#"
                :to="{ name: 'epochDetail', params: { epoch: item.value } }"
                v-if="item.type === 'epoch-link'"
                >#{{ item.value }}</b-link
              >

              <!-- epoch-range -->
              <div v-if="item.type === 'epoch-range'">
                <b-link href="#" :to="{ name: 'epochDetail', params: { epoch: item.start } }">{{ item.start }}</b-link>
                <span class="mx-1">-</span>
                <b-link href="#" v-if="item.end" :to="{ name: 'epochDetail', params: { epoch: item.end } }"
                  >{{ item.end }}
                </b-link>
                <span v-else>{{ item.start + 24 }}</span>
              </div>

              <!-- address-link -->
              <address-link :address="item.value" v-if="item.type === 'address-link'" />

              <!-- address-link -->
              <b-link :to="{ name: 'txDetail', params: { hash: item.value } }" v-if="item.type === 'tx-link'">{{
                item.value
              }}</b-link>

              <!-- contract-created-or-selfDestructed-link -->
              <div v-if="item.type === 'contract-created-or-selfDestructed-link'">
                <div v-for="(val, idx) in item.value" :key="idx">
                  <div v-for="addr in val.data" :key="addr">
                    <span>[{{ val.prefix }} </span>
                    <address-link :address="addr" />
                    <span> {{ val.suffix }}]</span>
                  </div>
                </div>
              </div>

              <!-- address-or-name-link -->
              <router-link
                :to="{
                  name: 'address',
                  params: { address: item.value.address },
                }"
                v-if="item.type === 'address-or-name-link' && !!item.value.name"
                >{{ item.value.name }}</router-link
              >

              <!-- timestamp -->
              <span v-if="item.type === 'timestamp'">
                {{ item.value }}
                <span v-if="item.value">
                  <time-tag :timestamp="item.value" />
                </span>
                <span v-else>-</span>
              </span>

              <!-- timestamp -->
              <span v-if="item.type === 'full-timestamp'">
                <span v-if="item.value">
                  <full-time-tag :timestamp="item.value" />
                </span>
                <span v-else>-</span>
              </span>

              <!-- duration -->
              <span v-if="item.type === 'duration'">
                <span>{{ formatDuration(item.value) }}</span>
              </span>

              <!--epochStats-->
              <span v-if="item.type === 'epoch-with-stats'">
                <span>{{ item.value }}</span>
                <span class="pl-2">(</span>
                <b-link :to="{ name: 'epochStats', params: { epoch: item.value } }">Stats</b-link>
                <span>)</span>
              </span>

              <!-- blockRef -->
              <span v-if="item.type === 'blockRef'">
                <span>{{ item.value }}</span>
                <span class="ml-2">
                  <b-link href="#" :to="{ name: 'blockDetail', params: { revision: item.ref } }"
                    >#{{ item.ref }}
                  </b-link>
                </span>
              </span>
              <!-- balance -->
              <span v-if="item.type === 'balance'">
                <AmountTag
                  :amount="item.mtr"
                  :token="item.mtrToken"
                  :precision="item.precision"
                  :decimals="item.decimals"
                ></AmountTag>
                <br />
                <AmountTag
                  :amount="item.mtrg"
                  :token="item.mtrgToken"
                  :precision="item.precision"
                  :decimals="item.decimals"
                ></AmountTag>
              </span>

              <!-- amount -->
              <span v-if="item.type === 'amount'">
                <AmountTag
                  :amount="item.value"
                  :token="item.token"
                  :precision="item.precision"
                  :decimals="item.decimals"
                ></AmountTag>
              </span>

              <span v-if="item.type === 'bucket-highlight'">
                <div
                  class="d-flex justify-content-start flex-wrap mt-0"
                  :key="index"
                  v-for="(row, index) in item.value"
                >
                  <BucketHighlight :row="row" />
                </div>
              </span>
              <!-- transfer-highlight -->
              <span v-if="item.type === 'transfer-highlight'">
                <div
                  class="d-flex justify-content-start flex-wrap mt-0"
                  :key="index"
                  v-for="(row, index) in computedTransfer"
                >
                  <span class="mr-2"><b>From</b></span>
                  <address-link class="mr-2" short :address="row.from" :name="row.fromName" />
                  <span class="mr-2"><b>To</b></span>
                  <address-link class="mr-2" short :address="row.to" :name="row.toName" />
                  <span class="mr-2"><b>For</b></span>
                  <template v-if="row.type === 'ERC20'">
                    <AmountTag
                      :amount="row.amount"
                      :token="row.symbol"
                      :precision="row.decimals"
                      :decimals="row.decimals"
                      :tokenAddr="row.tokenAddress"
                    />
                  </template>
                  <template v-else-if="row.type === 'ERC721'">
                    <div class="small-font-size">
                      <div v-for="(id, index) in row.ids" :key="id">
                        <span>{{ `For ${row.type} Token ID ` }}</span>
                        <nft-link
                          :address="row.tokenAddress"
                          :tokenId="id"
                          :value="row.values[index]"
                          :disabled="false"
                          :mediaUrl="row.mediaUrls[index] || ''"
                        />
                        <span>{{ row.symbol }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="row.type === 'ERC1155'">
                    <div class="small-font-size">
                      <div v-for="(id, index) in row.ids" :key="id">
                        <span class="mr-3">{{ `For ${row.type} Token ID` }}</span>
                        <nft-link
                          :address="row.tokenAddress"
                          :tokenId="id"
                          :value="row.values[index]"
                          :disabled="false"
                          :mediaUrl="row.mediaUrls[index] || ''"
                        />
                        <span>{{ row.symbol }}</span>
                      </div>
                    </div>
                  </template>
                </div>
                <div v-if="!isShowAllTransfers">
                  <span @click="showMoreTransfers">
                    <b-icon icon="chevron-double-down"></b-icon>
                  </span>
                </div>
              </span>

              <!-- status -->
              <span v-if="item.type === 'status'">
                <StatusTag :status="item.value"></StatusTag>
              </span>

              <!-- holders -->
              <span v-if="item.type === 'holders'">
                {{ item.value | formatNumber }}
              </span>

              <!-- transfers -->
              <span v-if="item.type === 'transfers'">
                {{ item.value | formatNumber }}
              </span>

              <!-- nft token image -->
              <span v-if="item.type === 'token-image'">
                <b-img-lazy thumbnail fluid :src="item.value" blank-color="#777" width="100" />
              </span>

              <span v-if="item.type === 'media'">
                <b-img-lazy v-if="item.value" thumbnail fluid :src="item.value" blank-color="#777" width="100" />
                <a
                  href="#"
                  @click="updateTokenInfo(item.network, item.address, item.tokenId)"
                  v-if="item.status == 'new'"
                  >update</a
                >
              </span>
            </b-col>
          </b-row>
        </b-col>
        <b-col v-if="isContract" md="6">
          <b-row>
            <b-col sm="12" :md="labelCols">
              <span class="label">Owner:</span>
            </b-col>
            <b-col sm="12" :md="contentCols">
              <address-link class="mr-3" short :address="computedOwner" />
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12" :md="labelCols">
              <span class="label">Creation Tx:</span>
            </b-col>
            <b-col sm="12" :md="contentCols">
              <router-link
                :to="{
                  name: 'txDetail',
                  params: {
                    hash: computedCreationTxHash,
                  },
                }"
                >{{ shortHash(computedCreationTxHash) }}</router-link
              >
            </b-col>
          </b-row>
          <b-row>
            <b-col sm="12" :md="labelCols">
              <span class="label">Verification:</span>
            </b-col>
            <b-col sm="12" :md="contentCols">
              <template v-if="verified">
                <span>{{ computedVerifiedDesc }}</span>
                <address-link v-if="verifiedFrom" :address="verifiedFrom" :short="true" />
              </template>
              <template v-else>
                <span>Not verified yet.</span>
              </template>
            </b-col>
          </b-row>
          <b-row v-if="!!deployStatus">
            <b-col sm="12" :md="labelCols">
              <span class="label">Deploy Status:</span>
            </b-col>
            <b-col sm="12" :md="contentCols">
              <span>{{ deployStatus }}</span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import StatusTag from '@/components/StatusTag.vue';
import AmountTag from '@/components/AmountTag.vue';
import AddressLink from '@/components/AddressLink.vue';
import TimeTag from '@/components/TimeTag.vue';
import FullTimeTag from '@/components/FullTimeTag.vue';
import NftLink from './NftLink.vue';
import { formatNum } from '@/utils';
import BucketHighlight from '@/components/BucketHighlight.vue';

export default {
  components: { StatusTag, AddressLink, AmountTag, NftLink, TimeTag, FullTimeTag, BucketHighlight },
  name: 'DataList',
  props: {
    logoURI: {
      type: String,
    },
    title: {
      type: String,
    },
    titleValue: {
      type: String,
    },
    titleCopyable: { type: Boolean },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    wide: {
      type: Boolean,
      default: false,
    },
    isContract: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedDesc: {
      type: String,
      default: '',
    },
    verifiedFrom: {
      type: String,
      default: '',
    },
    deployStatus: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      titleCopied: false,
      copied: false,
      isShowAllTransfers: false,
    };
  },
  watch: {
    data() {
      const t = this.data.find((d) => d.type === 'transfer-highlight');
      t && t.value.length > 10 ? (this.isShowAllTransfers = false) : (this.isShowAllTransfers = true);
    },
  },
  computed: {
    loading() {
      return !(this.data instanceof Array && this.data.length > 0);
    },
    labelCols() {
      return this.wide ? 3 : 2;
    },
    contentCols() {
      return this.wide ? 9 : 10;
    },
    contractAddress() {
      return this.title.split(':')[1].trim();
    },
    computedTransfer() {
      const temp = [];

      for (const obj of this.data) {
        if (obj.type === 'transfer-highlight') {
          temp.push(...obj.value);
          break;
        }
      }

      if (temp.length > 10) {
        if (!this.isShowAllTransfers) {
          return temp.slice(0, 10);
        }
      }
      return temp;
    },
    computedData() {
      const temp = [];
      for (const obj of this.data) {
        if (obj.key !== 'owner' && obj.key !== 'creationTxHash' && obj.key !== 'deployStatus') {
          temp.push(obj);
        }
      }
      return temp;
    },
    computedOwner() {
      for (const obj of this.data) {
        if (obj.key === 'owner') {
          return obj.value;
        }
      }
      return '0x';
    },
    computedCreationTxHash() {
      for (const obj of this.data) {
        if (obj.key === 'creationTxHash') {
          return obj.value;
        }
      }
      return '0x';
    },
    computedVerifiedDesc() {
      if (this.verifiedDesc === 'perfect' || this.verifiedDesc === 'full') {
        return 'Contract Source Code and Metadata Fully Verified';
      }
      if (this.verifiedDesc === 'match') {
        return 'Deployed code matched with ';
      } else {
        return 'Contract Source Code Verified';
      }
    },
  },
  filters: {
    formatNumber(val) {
      return formatNum(val);
    },
  },
  methods: {
    async updateTokenInfo(network, address, tokenId) {
      await this.$api.nft.updateTokenInfo(network, address, tokenId);
      location.reload();
    },
    async copyTitleToClipBoard(text) {
      await navigator.clipboard.writeText(text);
      this.titleCopied = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(this.clearTitleCopied, 800);
    },
    clearTitleCopied() {
      this.titleCopied = false;
    },
    clearCopied() {
      this.copied = false;
    },
    async copyToClipBoard(text) {
      await navigator.clipboard.writeText(text);
      this.copied = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(this.clearCopied, 1000);
    },
    showMoreTransfers() {
      this.isShowAllTransfers = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.col-md-3 {
  // padding-right: 0 !important;
}

.summary {
  .title-row {
    font-size: 19px;
    margin-bottom: 15px;
    .title {
      margin-right: 8px;
    }
    .title-value {
      color: #77838f;
      margin-right: 5px;
    }
  }

  .row {
    padding: 8px 0;
  }
  font-size: 90%;

  b {
    font-weight: 600 !important;
  }

  .label {
    color: #5c6f8c;
  }

  .loading {
    opacity: 0.55;
    font-size: 14px;
    font-weight: bold;
  }

  .small-font-size {
    font-size: 90%;
  }
}
.flex-wrap {
  flex-wrap: wrap;
  margin-top: 10px;
}
</style>
