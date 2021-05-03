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

      <b-row class="row" :key="item.key" v-for="item in data" v-else>
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
                  revision: item.block
                }
              }"
              >#{{ item.block }}</router-link
            >
            <span class="value"> ({{ item.value }})</span>
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
              :to="{ name: 'blockDetail', params: { revision: item.start } }"
              >#{{ item.start }}</b-link
            >
            <span class="mx-1">-</span>
            <b-link
              href="#"
              v-if="item.end"
              :to="{ name: 'blockDetail', params: { revision: item.end } }"
              >#{{ item.end }}</b-link
            >
            <span v-else>active</span>
          </div>

          <!-- epoch-range -->
          <div v-if="item.type === 'epoch-range'">
            <b-link
              href="#"
              :to="{ name: 'epochDetail', params: { epoch: item.start } }"
              >{{ item.start }}</b-link
            >
            <span class="mx-1">-</span>
            <b-link
              href="#"
              v-if="item.end"
              :to="{ name: 'epochDetail', params: { epoch: item.end } }"
              >{{ item.end }}
            </b-link>
            <span v-else>{{ item.start + 24 }}</span>
          </div>

          <!-- address-link -->
          <address-link
            :address="item.value"
            v-if="item.type === 'address-link'"
          />

          <!-- address-or-name-link -->
          <router-link
            :to="{
              name: 'address',
              params: { address: item.value.address }
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
            <div
              class="d-flex justify-content-start"
              :key="index"
              v-for="(row, index) in item.value"
            >
              <address-link class="mr-3" short :address="row.from" />
              <span class="mr-3">to</span>
              <address-link class="mr-3" short :address="row.to" />
              <AmountTag
                :amount="row.amount"
                :token="row.token"
                :precision="row.decimals"
                :decimals="row.decimals"
              />
            </div>
          </span>

          <!-- status -->
          <span v-if="item.type === 'status'">
            <StatusTag :status="item.value"></StatusTag>
          </span>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";
import AmountTag from "@/components/AmountTag.vue";
import AddressLink from "@/components/AddressLink.vue";

export default {
  components: { StatusTag, AddressLink, AmountTag },
  name: "DataList",
  props: {
    title: {
      type: String
    },
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    wide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPage: 1
    };
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
    }
  }
};
</script>
<style lang="scss" scoped>
.summary {
  .title {
    font-size: 19px;
    margin-bottom: 15px;
  }
  .row {
    padding: 8px 0;
  }
  .label {
    color: #5c6f8c;
  }

  .loading {
    opacity: 0.55;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>
