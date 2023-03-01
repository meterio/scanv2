<template>
  <div>
    <b-modal v-model="modal_show" hide-footer hide-header>
      <div class="text-center">Search No More Data</div>
    </b-modal>
    <b-navbar toggleable="lg" type="light" variant="light" class="px-4">
      <b-navbar-brand href="/" class="mr-5">
        <b-img :src="computedLogo" height="40" class="mr-1" />

        <!-- <span class="ml-1" style="font-size: 19px; font-weight: bold">{{ currentChain.title }}</span> -->
        <!-- Upgrade Badge -->
        <!--<b-badge
          class="ml-2"
          variant="warning"
          v-b-tooltip.hover
          title="Account balance might be incorrect during upgrading"
          >upgrading ...</b-badge
        >
        -->
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- collapse in mobile view -->
      <b-collapse id="nav-collapse" is-nav>
        <!-- <b-nav-form>
         <b-form-input
            size="sm"
            class="mr-sm-2"
            placeholder="Search"
          ></b-form-input>
          <b-button size="sm" class="my-2 my-sm-0" type="submit"
            >Search</b-button
          >
        </b-nav-form> -->
        <b-nav-form>
          <auto-search-input @selected="selected" v-if="!homeActive" />
          <!-- <b-input-group class="search-group" v-if="!homeActive">
            <b-form-input
              list="domain-list1"
              v-model="searchKey"
              placeholder="Search by address/tx/block/name"
              @keypress="keypress"
              debounce="500"
            ></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" @click="searchKeyWords">
                <b-icon icon="search"></b-icon>
              </b-button>
            </b-input-group-append>
          </b-input-group> -->
        </b-nav-form>
        <!-- <datalist id="domain-list1">
          <option v-for="name in domainnames" :key="name">{{ name }}</option>
        </datalist> -->

        <!-- Right aligned nav items -->
        <b-navbar-nav class="m-bar ml-auto">
          <b-nav-item>
            <router-link :to="{ name: 'home' }" :class="homeActive ? 'active' : ''">Home</router-link>
          </b-nav-item>

          <b-nav-item-dropdown text="Blockchain" right :class="blockActive ? 'top-dropdown active' : ''">
            <b-dropdown-item :to="{ name: 'pos' }">PoS</b-dropdown-item>
            <b-dropdown-item v-if="currentChain.pow" :to="{ name: 'pow' }">PoW</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item :to="{ name: 'txList' }">View Txs</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'blockList' }">View Blocks</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'epochList' }">View Epochs</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item :to="{ name: 'topMTR' }">Top {{ currentChain.symbol }} Accounts</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'topMTRG' }">Top {{ currentChain.gSymbol }} Accounts</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item v-if="currentChain.pow"
            ><router-link
              :to="{ name: 'auction', network: $route.params.network }"
              :class="auctionActive ? 'active' : ''"
              >Auctions</router-link
            ></b-nav-item
          >

          <b-dropdown :text="currentNetwork" size="sm" variant="outline-primary" class="mx-2" right>
            <b-dropdown-item v-for="item in chainList" :key="item.chainId" @click="changeNetwork(item.chainId)">{{
              item.name
            }}</b-dropdown-item>
          </b-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { getCurrentChain, chainList } from '@/config';
import AutoSearchInput from '../components/AutoSearchInput.vue';

export default {
  name: 'TopNav',
  data() {
    return {
      selectedValue: null,
      modal_show: false,
      searchKey: '',
      domainnames: [],
    };
  },
  components: { AutoSearchInput },
  computed: {
    computedLogo() {
      return require(`@/assets/${this.currentChain.symbol.toLowerCase()}.png`);
    },
    currentNetwork() {
      return this.currentChain.name;
    },
    chainList() {
      return chainList;
    },
    homeActive() {
      return this.$route.path === '' || this.$route.path === '/';
    },
    blockActive() {
      const path = this.$route.path;
      const prefixs = ['/tx', '/block', '/pos', '/pow', '/account', '/address', '/epoch'];
      for (const p of prefixs) {
        if (path.startsWith(p)) {
          return true;
        }
      }
      return false;
    },
    auctionActive() {
      const path = this.$route.path;
      let x = path.startsWith(`/auction`);
      return x;
    },
  },
  watch: {
    async searchKey(newVal, oldVal) {
      const _newVal = newVal.trim();
      if (String(_newVal).startsWith('0x')) {
        return;
      }
      if (_newVal.length < 3) {
        return;
      }
      if (!isNaN(Number(_newVal))) {
        return;
      }
      for (const d of this.domainnames) {
        if (String(d).includes(_newVal)) {
          return;
        }
      }
      const { type, data } = await this.$api.search.searchKeyWord(this.network, _newVal);
      if (type === 'address') {
        const temp = [];
        for (const d of data) {
          temp.push(`${d.name}(${d.address})`);
          this.domainnames = temp;
        }
      }
    },
  },
  methods: {
    selected(item) {
      let jump_url = '';
      console.log('selected: ', item);
      if (item.type === 'tx') {
        jump_url = `/tx/${item.hash}`;
      } else if (item.type == 'block') {
        jump_url = `/block/${item.number}`;
      } else if (item.type == 'address') {
        jump_url = `/address/${item.address}`;
      } else if (item.type == 'auction') {
        jump_url = `/auction/${item.id}`;
        // } else if (item.type == 'bid') {
        // jump_url = `/bid/${item.id}`;
      } else if (item.type == 'bucket') {
        jump_url = `/buckets/${item.id}`;
      } else {
        this.modal_show = true;
      }
      if (jump_url != this.$route.path && jump_url !== '' && !this.modal_show) {
        console.log('JUMP: ', jump_url);
        this.$router.push(jump_url);
      } else {
      }
    },
    keypress(evt) {
      if (evt) {
        if (evt.which === 13) {
          // enter key
          setTimeout(this.searchKeyWords, 500);
          evt.preventDefault();
        }
      }
    },
    changeNetwork(newNetwork) {
      const { network } = this.$store.state.dom;
      if (network !== newNetwork) {
        if (process.env.NODE_ENV === 'development') {
          this.$store.commit('dom/SET_NETWORK', newNetwork);
        }
        if (process.env.NODE_ENV === 'production') {
          const newChain = getCurrentChain(newNetwork);
          const domain = newChain.deployDomain;
          window.location.href = `https://${domain}`;
        }
      }
    },
    async searchKeyWords() {
      try {
        const key = this.searchKey.replace(/\r|\n|\r|\s/g, '');
        this.searchKey = key;
        const arr = key.match(/\([^\)]+\)/g);
        // if (arr) {
        //   const address = arr[0].substring(1, arr[0].length - 1);
        //   // this.$router.push('/address/' + address);
        //   return;
        // }
        console.log('SEARCH FOR KEY: ', key);
        const res = await this.$api.search.searchKeyWord(this.network, this.searchKey);
        const { type } = res;
        let jump_url = '';
        if (type === 'tx') {
          jump_url = `/tx/${this.searchKey}`;
        } else if (type == 'block') {
          jump_url = `/block/${this.searchKey}`;
        } else if (type == 'address') {
          jump_url = `/address/${this.searchKey}`;
        } else {
          this.modal_show = true;
        }
        if (jump_url != this.$route.path && jump_url !== '' && !this.modal_show) {
          this.searchKey = '';
          console.log('JUMP TO ', jump_url);
          this.$router.push(jump_url);
        } else {
        }
      } catch (e) {
        console.error(e);
        // this.$bvModal.show('homeModal')
        this.modal_show = true;
      }
    },
  },
};
</script>

<style lang="scss">
.navbar {
  padding-top: 3px;
  padding-bottom: 3px;
  border-bottom: 1px solid #dfdfdf;
  background: white !important;
}

.navbar-nav .nav-link {
  padding-left: 0.6rem !important;
  padding-right: 0.6rem !important;
}

.navbar-expand-lg .navbar-nav .nav-link {
  padding-right: 0.6rem !important;
  padding-left: 0.6rem !important;
}
.m-bar {
  a {
    color: rgba(0, 0, 0, 0.7);
    &:hover {
      text-decoration: none;
      color: rgba(0, 0, 0, 0.9);
    }
    &.active,
    &.active:hover {
      color: #003cb2;
    }
  }
}
@media (max-width: 600px) {
  .navbar-collapse.collapse > li.form-inline > form.form-inline,
  .search-group {
    width: 100% !important;
  }
}
.btn-outline-primary.btn-sm {
  padding: 0.25rem 0.5rem !important;
  border-radius: 0.75rem !important;
}
</style>
