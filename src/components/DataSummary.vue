<template>
  <b-container class="summary">
    <h2 class="title">{{ title }}</h2>
    <b-card>
      <div class="loading" v-if="loading">
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-2"></b-spinner>
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

              <!-- block-link-with-note -->
              <span v-if="item.type == 'block-link-with-note'">
                <router-link
                  :to="{
                    name: 'blockDetail',
                    params: {
                      revision: item.block,
                    },
                  }"
                  >#{{ item.block }}</router-link
                >
                <span class="value" :title="item.time"> ({{ item.value }})</span>
              </span>

              <!-- block-link -->
              <b-link
                href="#"
                :to="{ name: 'blockDetail', params: { revision: item.value } }"
                v-if="item.type === 'block-link'"
                >#{{ item.value }}</b-link
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
                <span v-if="item.value">
                  <span>{{ fromNow(item.value) }}</span>
                  <span class="px-2">({{ formatTime(item.value) }})</span>
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
                <span class="ml-2"
                  ><b-link href="#" :to="{ name: 'blockDetail', params: { revision: item.ref } }"
                    >#{{ item.ref }}</b-link
                  ></span
                >
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

              <!-- status -->
              <span v-if="item.type === 'transfer-highlight'">
                <div class="d-flex justify-content-start" :key="index" v-for="(row, index) in computedTransfer">
                  <address-link class="mr-3" short :address="row.from" />
                  <span class="mr-3">to</span>
                  <address-link class="mr-3" short :address="row.to" />
                  <template v-if="row.type === 'ERC20'">
                    <AmountTag
                      :amount="row.amount"
                      :token="row.symbol"
                      :precision="row.decimals"
                      :decimals="row.decimals"
                    />
                  </template>
                  <template v-else-if="row.type === 'ERC721'">
                    <div class="small-font-size">
                      <div v-for="id in row.ids" :key="id">
                        <span class="mr-3">{{ `For ${row.type} Token ID [${id}] ${row.symbol}` }}</span>
                      </div>
                    </div>
                  </template>
                  <template v-else-if="row.type === 'ERC1155'">
                    <div class="small-font-size">
                      <div v-for="(id, indx) in row.ids" :key="id">
                        <span class="mr-3">{{
                          `For ${row.type} Token ID [${id}] ${row.values[indx]} ${row.symbol}`
                        }}</span>
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
              </template>
              <template v-else>
                <span>Not verified yet.</span>
              </template>
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

import { formatNum } from '@/utils';

export default {
  components: { StatusTag, AddressLink, AmountTag },
  name: 'DataList',
  props: {
    title: {
      type: String,
    },
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
  },
  data() {
    return {
      isShowAllTransfers: false,
    };
  },
  watch: {
    'data'() {
      const t = this.data.find(d => d.type === 'transfer-highlight')
      console.log('t', t)
      t && t.value.length > 10 ? this.isShowAllTransfers = false : this.isShowAllTransfers = true;
    }
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
      const temp = []

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
      console.log('data summary', this.data);
      const temp = [];
      for (const obj of this.data) {
        if (obj.key !== 'owner' && obj.key !== 'creationTxHash') {
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
    showMoreTransfers() {
      this.isShowAllTransfers = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.col-md-3 {
  padding-right: 0 !important;
}
.summary {
  .title {
    font-size: 19px;
    margin-bottom: 15px;
  }
  .row {
    padding: 8px 0;
  }
  .label {
    font-size: 90%;
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
</style>
