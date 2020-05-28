<template>
  <div class="search">
    <b-input-group size="lg" class="search-group">
      <b-input-group-prepend>
        <b-dropdown
          text="Mainnet"
          class="search-select"
          variant="outline-secondary"
        >
          <b-dropdown-item href="#">Mainnet</b-dropdown-item>
          <b-dropdown-item href="#">Testnet</b-dropdown-item>
        </b-dropdown>
      </b-input-group-prepend>
      <b-form-input placeholder="Search by address/tx/block"></b-form-input>
      <b-input-group-append>
        <b-button class="query" variant="primary"
          ><b-icon icon="search"></b-icon
        ></b-button>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
export default {
  name: "Search"
};
</script>

<style lang="scss">
.search {
  padding: 5px;
  background-color: #fff;
  border-radius: 5px;

  .search-select {
    .btn {
      background-color: $back-white;
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
