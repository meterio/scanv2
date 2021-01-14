<template lang="pug">
b-container
  .s-nav-tabbar
    .nav-item(v-for="(tab, index) in localTabs", :class="localTabIndex == index ? 'active': ''", @click="clickTab(index)") {{tab}}
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      localTabs: [],
      localTabIndex: 0
    };
  },
  beforeMount() {
    this.localTabs = this.tabs;
    this.localTabIndex = this.value;
  },
  methods: {
    clickTab(tabIndex) {
      this.localTabIndex = tabIndex;
      this.$emit("changeTab", tabIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
.s-nav-tabbar {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ddd;
  .nav-item {
    flex: 0 0 88px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active,
    &:hover {
      color: #007bff;
      cursor: pointer;
    }
    &.active {
      border-bottom: 2px solid #007bff;
    }
  }
  .col {
    flex: 1;
  }
}
</style>
