<template>
  <b-container class="summary">
    <h2 class="title">{{ title }}</h2>
    <b-card>
      <b-row class="row" :key="item.key" v-for="item in data">
        <b-col sm="12" md="2">
          <span class="label">{{ item.key }}:</span>
        </b-col>
        <b-col sm="12" md="10">
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
              >{{ item.block }}</router-link
            >
            <span class="value"> ({{ item.value }})</span>
          </span>

          <!-- block-link -->
          <b-link
            href="#"
            @click="jump2BlcokPage(item.value)"
            v-if="item.type === 'block-link'"
            >#{{ item.value }}</b-link
          >

          <!-- address-link -->
          <router-link
            :to="{
              name: 'address',
              params: { address: item.value },
            }"
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
import StatusTag from "@/components/StatusTag.vue";

export default {
  components: { StatusTag },
  name: "DataList",
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
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  methods: {
    pgChange(val) {
      this.$emit("tablePaginationChange", val);
    },

    jump2BlcokPage(value) {
      this.$router.push(`/block/${value}`);
      window.location.reload();
    },
  },
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
}
</style>
