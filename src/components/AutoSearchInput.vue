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
        <b-dropdown-item v-for="item in items" @click="selectItem(item)" :key="item.address">
          <div class="d-flex">
            <img v-if="item.logoURI" width="25" height="25" :src="item.logoURI" alt="" />
            <div v-else class="addressSvgContainer">
              <span class="addressSvg" v-html="getAddressSvg(item.address)"></span>
            </div>
            <div class="_max-width ml-1">
              <span class="d-block text-truncate">{{ item.symbol ? '[' + item.symbol + ']' : '' }} {{ item.name }}</span>
              <span class="d-block text-truncate" >{{ item.address }}</span>
            </div>
          </div>
        </b-dropdown-item>
      </b-dropdown>
    </template>

    <b-form-input
      size="sm"
      ref="input"
      id="input-query"
      v-model="keyword"
      placeholder="Search by address / txHash / blockHash / name"
      @keypress="keypress"
      debounce="800"
    />
    <b-input-group-append>
      <b-button size="sm" :variant="btnVariant" @click="search">
        <b-icon icon="search"></b-icon>
        <span v-if="large"> Search</span>
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>
import MersenneTwister from 'mersenne-twister';
import Color from 'color';
import { ethers } from 'ethers';
const allColors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffc107',
  '#ff9800',
  '#ff5722',
];
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
    btnVariant() {
      return this.large ? 'secondary' : 'primary';
    },
  },
  watch: {
    async keyword(val) {
      if (val === '') {
        clearInterval();
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
        await this.updateItems(val);
        this.lastUpdatedAt = curTime;
        return;
      }
      const leftover = 1000 - (curTime - this.lastUpdatedAt);
      if (leftover <= 0) {
        await this.updateItems(val);
        this.lastUpdatedAt = curTime;
      }
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
        val = ethers.utils.isAddress(val) && !val.startsWith('0x') ? `0x${val.toLowerCase()}` : val.toLowerCase();
        const { type, data } = await this.$api.search.searchKeyWord(this.network, val);

        console.log(`search result type: ${type}, data:`, data);
        if (
          type === 'address' ||
          type === 'tx' ||
          type === 'block' ||
          type === 'auction' ||
          type === 'bid' ||
          type === 'bucket'
        ) {
          this.$emit('selected', { ...data, type });
          return;
        } else if (type === 'suggestions') {
          this.items = data;
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
      if (!this.selected) {
        bvEvent.preventDefault();
      } else {
        this.selected = false;
        this.dropdownShown = false;
      }
    },
    dropdownShow(bvEvent) {
      this.dropdownShown = true;
      this.$refs.input.focus();
    },
    hash(str) {
      if (str.length === 0) {
        return 0;
      }
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = h * 31 + str.charCodeAt(i);
        h = h % 2 ** 32;
      }
      return h;
    },
    getAddressSvg(address) {
      const seed = this.hash(address);
      const rand = new MersenneTwister(seed);

      const colors = allColors.map((hex) => {
        const color = Color(hex).darken(0.2);
        return color.hex();
      });

      const genColor = () => {
        const idx = Math.floor(colors.length * rand.random());
        return colors.splice(idx, 1)[0];
      };

      const bgStr = `<rect fill="${genColor()}" width="100" height="100"/>`;
      let shapesStr = '';
      const layers = 3;
      const rs = [35, 40, 45, 50, 55, 60];
      const cxs = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      const cys = [30, 40, 50, 60, 70];

      for (let i = 0; i < layers; i++) {
        const r = rs.splice(Math.floor(rs.length * rand.random()), 1)[0];
        const cx = cxs.splice(Math.floor(cxs.length * rand.random()), 1)[0];
        const cy = cys.splice(Math.floor(cys.length * rand.random()), 1)[0];
        const fill = genColor();

        shapesStr += `<circle r="${r}" cx="${cx}" cy="${cy}" fill="${fill}" opacity="0.5"/>`;
      }
      return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${bgStr}${shapesStr}</svg>`;
    },
  },
};
</script>

<style lang="scss" global>
.search-group {
  width: 500px !important;
  .input-group-append {
    button.btn {
      padding-left: 10px;
      padding-right: 10px;
      border-radius: 0 0.75rem 0.75rem 0 !important;
    }
  }
}
.search-group-large {
  width: 80%;
  margin-top: 1.5rem;
  input {
    padding: 20px !important;
  }

  .input-group-append {
    button.btn {
      padding-left: 15px;
      padding-right: 15px;
      border-radius: 0 0.75rem 0.75rem 0 !important;
    }
  }
}
.search-prepend-btn {
  button.btn {
    padding: 0 !important;
    // display: none;
    border-radius: 5px;
    border: 0px solid white;
  }
  .addressSvgContainer {
    width: 25px;
    height: 25px;
    overflow: hidden;
    border-radius: 100%;
    .addressSvg {
      display: block;
      width: 40px;
      height: 40px;
    }
  }
}
#input-query {
  border-radius: 0.75rem 0 0 0.75rem !important;
}
.dropdown-menu {
  max-height: 600px;
  overflow-y: auto;
}

._max-width {
  max-width: 1000px;
}

@media all and (max-width:500px){
  ._max-width {
    max-width: 300px;
  }
}
</style>
