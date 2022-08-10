<template>
  <b-input-group :class="className">
    <template #prepend>
      <b-dropdown
        ref="dropdown"
        toggle-class="text-decoration-none"
        no-caret
        @hide="dropdownHide"
        @shown="dropdownShow"
        class="search-prepend-btn"
      >
        <template #button-content> </template>
        <b-dropdown-item v-for="item in items" @click="selectItem(item)" :key="item.address"
          >{{ item.tag ? '[' + item.tag + ']' : '' }} {{ item.name }} - {{ item.address }}</b-dropdown-item
        >
      </b-dropdown>
    </template>

    <b-form-input
      ref="input"
      id="input-query"
      v-model="keyword"
      placeholder="Search by address / txHash / blockHash / name"
      @keypress="keypress"
    />
    <b-input-group-append>
      <b-button variant="primary" @click="search">
        <b-icon icon="search"></b-icon>
        <span v-if="large"> Search</span>
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
export default {
  name: 'AutoSearchInput',
  props: { large: { type: Boolean, default: false } },
  data() {
    return {
      keyword: null,
      items: [],
      selectedItem: null,
      dropdownShown: false,
      lastUpdatedAt: 0,
      selected: false,
    };
  },
  computed: {
    className() {
      return this.large ? 'search-group-large' : 'search-group';
    },
  },
  watch: {
    async keyword(val) {
      if (val === '') {
        clearInterval();
        console.log('reset when keyword is empty');
        this.$refs.dropdown.hide(false);
        this.dropdownShown = false;
        this.items = [];
        this.selectedItem = null;
        this.selected = false;
        return;
      }
      if (String(val).startsWith('0x')) {
        return;
      }
      if (val.length < 3) {
        return;
      }
      if (!isNaN(Number(val))) {
        return;
      }

      if (this.selectedItem) {
        this.selectedItem = null;
        this.selected = false;
      }

      clearInterval();
      const curTime = new Date().getTime();
      if (this.lastUpdatedAt == 0) {
        console.log('first call');
        await this.updateItems(val);
        this.lastUpdatedAt = curTime;
        return;
      }
      const leftover = 1000 - (curTime - this.lastUpdatedAt);
      console.log('leftover: ', leftover);
      if (leftover <= 0) {
        await this.updateItems(val);
        this.lastUpdatedAt = curTime;
      }
      console.log('set time out');
      setTimeout(() => {
        this.updateItems(val);
        this.lastUpdatedAt = new Date().getTime();
      }, leftover);
    },
  },
  methods: {
    keypress(evt) {
      if (evt) {
        if (evt.which === 13) {
          // enter key
          setTimeout(this.search.bind(this), 500);
          evt.preventDefault();
        }
      }
    },
    search() {
      this.updateItems(this.keyword);
    },
    async updateItems(val) {
      if (val && this.keyword) {
        val = val.toLowerCase();
        const { type, data } = await this.$api.search.searchKeyWord(this.network, val);

        console.log(`search result type: ${type}, data: ${data}`);
        if (type === 'address' || type === 'tx' || type === 'block') {
          this.$emit('selected', { ...data, type });
          return;
        } else if (type === 'suggestions') {
          this.items = data;
          console.log(this.items);
          this.lastUpdatedAt = new Date().getTime();
        }

        if (this.items.length && !this.dropdownShown) {
          this.$refs.dropdown.show(false);
        }
      }
    },

    selectItem(item) {
      this.selectedItem = item;
      this.selected = true;
      this.$emit('selected', item);
      this.$refs.dropdown.hide(false);
      this.dropdownShown = false;
    },
    dropdownHide(bvEvent) {
      console.log('dropdown HIDE');
      if (!this.selected) {
        bvEvent.preventDefault();
      } else {
        this.selected = false;
        this.dropdownShown = false;
      }
    },
    dropdownShow(bvEvent) {
      console.log('DROPDOWN SHOW');
      this.dropdownShown = true;
      this.$refs.input.focus();
    },
  },
};
</script>

<style lang="scss" global>
.search-group {
  width: 500px !important;
}
.search-group-large {
  width: 80%;
  margin-top: 1.5rem;
  input {
    padding: 20px !important;
  }
}
.search-prepend-btn {
  button.btn {
    padding: 0 !important;
    // display: none;
    border-radius: 5px;
    border: 0px solid white;
  }
}
#input-query {
  border-radius: 5px !important;
}
</style>