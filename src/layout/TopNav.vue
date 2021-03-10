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
          <b-input-group class="search-group" v-if="!homeActive">
            <b-form-input
              v-model="searchKey"
              placeholder="Search by address/tx/block"
              @keydown="keydown"
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
              :class="homeActive ? 'active' : ''"
              >Home</router-link
            >
          </b-nav-item>

          <b-nav-item-dropdown
            text="Blockchain"
            right
            :class="blockActive ? 'top-dropdown active' : ''"
          >
            <b-dropdown-item :to="{ name: 'pos' }">PoS</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'pow' }">PoW</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item :to="{ name: 'txList' }">View Txs</b-dropdown-item>
            <b-dropdown-item :to="{ name: 'blockList' }"
              >View Blocks</b-dropdown-item
            >
            <b-dropdown-item :to="{ name: 'epochList' }"
              >View Epochs</b-dropdown-item
            >
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item :to="{ name: 'topMTR' }"
              >Top MTR Accounts</b-dropdown-item
            >
            <b-dropdown-item :to="{ name: 'topMTRG' }"
              >Top MTRG Accounts</b-dropdown-item
            >
          </b-nav-item-dropdown>

          <b-nav-item
            ><router-link
              :to="{ name: 'auction', network: $route.params.network }"
              :class="auctionActive ? 'active' : ''"
              >Auctions</router-link
            ></b-nav-item
          >

          <b-dropdown
            :text="searchPrefix"
            size="sm"
            variant="outline-success"
            class="mx-2"
          >
            <b-dropdown-item @click="changeNetwork('main')"
              >Mainnet</b-dropdown-item
            >
            <b-dropdown-item @click="changeNetwork('test')"
              >Testnet</b-dropdown-item
            >
          </b-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { DEPLOY_DOMAIN } from "@/config";

export default {
  name: "TopNav",
  data() {
    return {
      modal_show: false,
      searchKey: "",
    };
  },
  computed: {
    searchPrefix() {
      return `${this.network
        .substring(0, 1)
        .toUpperCase()}${this.network.substring(1)}net`;
    },
    homeActive() {
      return this.$route.path === "" || this.$route.path === "/";
    },
    blockActive() {
      const path = this.$route.path;
      const prefixs = [
        "/tx",
        "/block",
        "/pos",
        "/pow",
        "/account",
        "/address",
        "/epoch",
      ];
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
  methods: {
    keydown(evt) {
      if (evt) {
        if (evt.which === 13) {
          // enter key
          evt.preventDefault();
          this.searchKeyWords();
        }
      }
    },
    changeNetwork(newNetwork) {
      const { network } = this.$store.state.dom;
      if (process.env.NODE_ENV === "development") {
        if (network !== newNetwork) {
          this.$store.commit("dom/SET_NETWORK", newNetwork);
        }
      }
      if (process.env.NODE_ENV === "production") {
        if (network !== newNetwork) {
          if (!(newNetwork in DEPLOY_DOMAIN)) {
            console.log("Invalid network: ", newNetwork);
            return;
          }
          console.log(`switch to ${domain}`);
          const domain = DEPLOY_DOMAIN[newNetwork][0];
          window.location.href = `https://${domain}` + this.$route.path;
        }
      }
    },
    async searchKeyWords() {
      try {
        const key = this.searchKey.replace(/\r?\n|\r/g, "");
        this.searchKey = key;
        const { type } = await this.$api.search.searchKeyWord(
          this.network,
          this.searchKey
        );
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
.navbar {
  border-bottom: 1px solid #dfdfdf;
}

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
