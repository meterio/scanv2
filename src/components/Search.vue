<template>
  <div class="search">
    <b-input-group class="search-group">
      <b-form-input
        :placeholder="placeholder"
        v-model="searchWord"
      ></b-form-input>
      <b-input-group-append>
        <b-button
          class="query"
          variant="primary"
          v-if="btnType == 1"
          @click="btnClick"
        >
          <b-icon icon="search"></b-icon>
        </b-button>
        <b-button
          v-else
          variant="primary"
          size="sm"
          block
          style="
            margin-left: 0.2rem;
            width: 100px;
            border-top-left-radius: 0.2rem;
            border-bottom-left-radius: 0.2rem;
          "
          @click="btnClick"
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
      default: 1,
    },
    placeholder: {
      type: String,
      default: "Search by address/tx/block",
    },
  },
  name: "Search",
  data() {
    return {
      searchWord: "",
      searchPrefix: "Main net",
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
    )} net`;
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
    },
    btnClick() {
      console.log("searchWord", this.searchWord);
      this.$emit("click", this.searchWord);
    },
  },
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
