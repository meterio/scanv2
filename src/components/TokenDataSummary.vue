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
        <b-col :md="6" :key="item.name" v-for="item in data">
          <b-row class="row">
            <b-col sm="12" :md="labelCols">
              <span class="label">{{ item.name }}:</span>
            </b-col>
            <b-col sm="12" :md="contentCols">
              <span v-if="item.type === 'span'" class="value">{{ item.value }}</span>
              <!-- address-link -->
              <router-link
                :to="{
                  name: 'address',
                  params: { address: item.value }
                }"
                v-if="item.type === 'address-link'"
                >{{ item.value }}</router-link
              >
              <!-- address-link -->
              <a v-if="item.type === 'http-link'" :href="item.value">{{ item.value }}</a>
              <!-- amount -->
              <span v-if="item.type === 'amount'">
                <AmountTag
                  :amount="item.value"
                  :token="item.token"
                  :decimals="item.decimals"
                ></AmountTag>
              </span>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import AmountTag from "@/components/AmountTag.vue";

export default {
  components: { AmountTag },
  name: "DataList",
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    wide: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {};
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
