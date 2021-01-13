<template>
  <div class="search">
    <b-input-group class="search-group">
      <b-input-group-prepend>
        <b-dropdown
          text="Main net"
          class="search-select"
          variant="outline-secondary"
        >
          <b-dropdown-item href="#">Mainnet</b-dropdown-item>
          <b-dropdown-item href="#">Testnet</b-dropdown-item>
        </b-dropdown>
      </b-input-group-prepend>
      <b-form-input :placeholder="placeholder"></b-form-input>
      <b-input-group-append>
        <b-button class="query" variant="primary" v-if="btnType == 1">
          <b-icon icon="search"></b-icon>
        </b-button>
        <b-button
          v-else
          variant="primary"
          size="sm"
          block
          style="margin-left:0.2rem;width: 100px;border-top-left-radius:0.2rem; border-bottom-left-radius: 0.2rem"
          >Search</b-button
        >
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
export default {
  props: {
    btnType: {
      type: Number,
      // icon 1 button 2
      default: 1
    },
    placeholder: {
      type: String,
      default: "Search by address/tx/block"
    }
  },
  name: "Search"
};
</script>

<style lang="scss">
.search {
  padding: 5px;
  background-color: #fff;
  border-radius: 5px;

  .search-select {
    // width: 120px;
    .btn {
      margin: -6px;
    }
  }

  input[type="text"] {
    border: none;
    margin-left: 18px;
    padding: 0;

    &:hover,
    &:focus {
      box-shadow: none;
    }
  }

  .query {
    border-radius: 0.3rem !important;
  }
}
</style>
