<template>
  <div>
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
            <b-input-group-prepend>
              <b-dropdown text="Main net" variant="outline-secondary">
                <b-dropdown-item href="#">Mainnet</b-dropdown-item>
                <b-dropdown-item href="#">Testnet</b-dropdown-item>
              </b-dropdown>
            </b-input-group-prepend>
            <b-form-input
              placeholder="Search by address/tx/block"
            ></b-form-input>
            <b-input-group-append>
              <b-button variant="primary">
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
            :class="
              $route.path == '/pos' || $route.path == '/pow'
                ? 'top-dropdown active'
                : ''
            "
          >
            <b-dropdown-item href="/pos">PoS</b-dropdown-item>
            <b-dropdown-item href="/pow">PoW</b-dropdown-item>
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

          <b-dropdown text="EN" variant="outline-secondary">
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ZH</b-dropdown-item>
          </b-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "TopNav",
  watch: {
    "$route.path"(newVal) {
      console.log("newval:>>", newVal);
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
