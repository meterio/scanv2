<template lang="pug">
div
  .s-nav-tabbar
    .nav-item.d-none.d-md-block(
      v-for="(tab, index) in localTabs",
      :class="computedTab == index ? 'active' : ''",
      @click="clickTab(index)"
    ) {{ tab.name }}
      b-icon(
        v-if="isShowCheck(tab.name)",
        icon="check-circle",
        variant="primary"
      )
      b-icon(
        v-if="tab.download"
        icon="download"
        class="ml-1"
        @click.stop="clickDownload(index)"
      )
  b-dropdown.d-md-none(block :text="chosenText" variant="outline")
    b-dropdown-item(v-for="(tab, index) in localTabs",
    @click="clickTab(index)"
    ) {{ tab.name }}
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
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localTabIndex: 0,
      chosenText: ''
    };
  },

  computed: {
    localTabs() {
      return !!this.tabs ? this.tabs : [];
    },
    computedTab() {
      return this.value;
    }
  },
  created() {
    const q = this.$route.query;
    if (q.tab) {
      const tabIndex = Number(q.tab);
      this.localTabIndex = tabIndex;
      this.$emit('changeTab', tabIndex);
    }
  },
  beforeMount() {
    // this.localTabs = this.tabs;
    this.localTabIndex = this.value;
    for (const [i, v] of this.tabs.entries()) {
      if (i === this.value) {
        this.chosenText = v.name;
      }
    }
  },
  methods: {
    clickTab(tabIndex) {
      this.localTabIndex = tabIndex;
      this.$emit('changeTab', tabIndex);

      this.chosenText = this.tabs[tabIndex].name;
      console.log('chosen text: ', this.chosenText);
      this.$router.replace({
        query: { ...this.$route.query, tab: tabIndex, p: 1 }
      });
    },
    isShowCheck(name) {
      return name === 'Contract' && this.verified;
    },
    clickDownload(tabIndex) {
      this.$emit('download', tabIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
.s-nav-tabbar {
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ddd;
  word-wrap: break-word;
  flex-wrap: wrap;
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
      color: #003cb2;
      border-bottom: 2px solid #003cb2;
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
