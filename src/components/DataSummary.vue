<template>
  <b-container class="summary">
    <h2 class="title">{{ title }}</h2>
    <b-card>
      <b-row class="row" :key="item.key" v-for="item in data">
        <b-col cols="2">
          <span class="label">{{ item.key }}:</span>
        </b-col>
        <b-col cols="10">
          <span v-if="!item.type" class="value">{{ item.value }}</span>

          <!-- block-link-with-note -->
          <span v-if="item.type == 'block-link-with-note'">
            <a :href="'/block/' + item.block">#{{ item.block }}</a>
            <span class="value"> ({{ item.value }})</span>
          </span>

          <!-- block-link -->
          <router-link
            :to="{ name: 'blockDetail', params: { revision: item.value } }"
            v-if="item.type === 'block-link'"
            >#{{ item.value }}</router-link
          >

          <!-- address-link -->
          <router-link
            :to="{ name: 'address', params: { address: item.value } }"
            v-if="item.type === 'address-link'"
            >{{ item.value }}</router-link
          >

          <!-- timestamp -->
          <span v-if="item.type === 'timestamp'">
            <span>{{ fromNow(item.value) }}</span>
            <span>({{ formatTime(item.value) }})</span>
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
import { shortHash, shortAddress, fromNow, formatTime } from "@/utils";
import StatusTag from "@/components/StatusTag.vue";

export default {
  components: { StatusTag },
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
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  methods: {
    pgChange(val) {
      this.$emit("tablePaginationChange", val);
    },
    fromNow(time) {
      return fromNow(time * 1000);
    },
    shortAddr(addr) {
      return shortAddress(addr);
    },
    shortHash(hash) {
      return shortHash(hash);
    },
    formatTime(time) {
      return formatTime(time * 1000);
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
    padding: 10px 0;
  }
  .label {
    color: #5c6f8c;
  }
}
</style>
