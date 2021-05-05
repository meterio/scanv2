<template lang="pug">
b-container
  .s-nav-tabbar
    .nav-item(
      v-for="(tab, index) in localTabs",
      :class="localTabIndex == index ? 'active' : ''",
      @click="clickTab(index)"
    ) {{ tab.name }}
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      localTabIndex: 0,
    };
  },
  computed: {
    localTabs() {
      return !!this.tabs ? this.tabs : [];
    },
  },
  beforeMount() {
    // this.localTabs = this.tabs;
    this.localTabIndex = this.value;
  },
  methods: {
    clickTab(tabIndex) {
      this.localTabIndex = tabIndex;
      this.$emit("changeTab", tabIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
.s-nav-tabbar {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ddd;
  .nav-item {
    font-size: 15px;
    font-weight: bold;
    padding: 9px 12px;
    align-items: center;
    color: #192a56;
    justify-content: center;
    &:hover {
      cursor: pointer;
      background: #f0f2ff;
      border-radius: 5px 5px 0 0;
    }
    &.active {
      font-weight: bold;
      color: #6171ff;
      border-bottom: 2px solid #6171ff;
      // border: 1px solid #ddd;
      // border-bottom: none;
      // border-radius: 5px 5px 0 0;
    }
  }
  .col {
    flex: 1;
  }
}
</style>
