<template>
  <div>
    <b-modal v-model="modal_show" hide-footer hide-header>
      <div class="text-center">Search No More Data</div>
    </b-modal>
    <b-navbar toggleable="lg" type="light" variant="light" class="px-4 py-3">
      <b-navbar-brand href="/" class="mr-5">
        <b-img src="@/assets/logo.svg" height="32" />
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
          <b-input-group class="search-group" v-if="$route.path !== '/'">
            <b-form-input
              v-model="searchKey"
              placeholder="Search by address/tx/block"
            ></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" @click="searchKeyWords">
                <b-icon icon="search"></b-icon>
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-nav-form>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="m-bar ml-auto">
          <b-nav-item>
            <router-link
              :to="{ name: 'home' }"
              :class="$route.path == '/' ? 'active' : ''"
              >Dashboard</router-link
            >
          </b-nav-item>

          <b-nav-item-dropdown
            text="Blockchain"
            right
            :class="blockActive ? 'top-dropdown active' : ''"
          >
            <b-dropdown-item href="/pos">PoS</b-dropdown-item>
            <b-dropdown-item href="/pow">PoW</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item href="/txs">View Txs</b-dropdown-item>
            <b-dropdown-item href="/blocks">View Blocks</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item href="/accounts/mtr"
              >Top MTR Accounts</b-dropdown-item
            >
            <b-dropdown-item href="/accounts/mtrg"
              >Top MTRG Accounts</b-dropdown-item
            >
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="Resources" right>
            <b-dropdown-item href="#">Wallet</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item>
            <router-link
              :to="{ name: 'auction' }"
              :class="$route.path == '/auction' ? 'active' : ''"
              >Auctions</router-link
            >
          </b-nav-item>

          <b-dropdown :text="searchPrefix" variant="outline-secondary">
            <b-dropdown-item @click="configProxy('main')"
              >Mainnet</b-dropdown-item
            >
            <b-dropdown-item @click="configProxy('test')"
              >Testnet</b-dropdown-item
            >
          </b-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "TopNav",
  data() {
    return {
      modal_show: false,
      searchKey: "",
      searchPrefix: "",
    };
  },
  beforeMount() {
    let mark = window.localStorage.getItem("proxyMark");
    if (!mark) {
      mark = "main";
      window.localStorage.setItem(mark);
      window.location.reload();
      return;
    }
    this.searchPrefix = `${mark.substring(0, 1).toUpperCase()}${mark.substring(
      1
    )}net`;
  },
  computed: {
    blockActive() {
      const path = this.$route.path;
      if (
        path == "/pos" ||
        path == "/pow" ||
        path == "/txs" ||
        path == "/blocks" ||
        path == "/accounts/mtr" ||
        path == "/accounts/mtrg" ||
        path.startsWith("/address/") ||
        path.startsWith("/tx/") ||
        path.startsWith("/block/")
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    configProxy(key) {
      const mark = window.localStorage.getItem("proxyMark");
      if (mark != key) {
        window.localStorage.setItem("proxyMark", key);
        window.location.reload();
        this.searchPrefix = `${key
          .substring(0, 1)
          .toUpperCase()}${key.substring(1)} net`;
      }
      console.log("key", key);
    },
    async searchKeyWords() {
      try {
        const { type } = await this.$api.search.searchKeyWord(this.searchKey);
        let jump_url = "";
        if (type === "tx") {
          jump_url = `/tx/${this.searchKey}`;
        } else if (type == "block") {
          jump_url = `/block/${this.searchKey}`;
        } else if (type == "address") {
          jump_url = `/address/${this.searchKey}`;
        } else {
          this.modal_show = true;
        }
        if (
          jump_url != this.$route.path &&
          jump_url !== "" &&
          !this.modal_show
        ) {
          this.searchKey = "";
          this.$router.push(jump_url);
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

<style lang="scss" scoped>
.navbar-nav .nav-link {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

.search-group {
  width: 500px !important;
}

.navbar-expand-lg .navbar-nav .nav-link {
  padding-right: 1rem;
  padding-left: 1rem;
}
.m-bar {
  a {
    color: rgba(0, 0, 0, 0.5);
    &:hover {
      text-decoration: none;
      color: rgba(0, 0, 0, 0.9);
    }
    &.active,
    &.active:hover {
      color: #007bff;
    }
  }
}
@media (max-width: 600px) {
  .navbar-collapse.collapse > li.form-inline > form.form-inline,
  .search-group {
    width: 100% !important;
  }
}
</style>
