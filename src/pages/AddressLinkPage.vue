<template lang="pug">
address-link(:address="address")
</template>

<script>
import AddressLink from "@/components/AddressLink";
export default {
  name: "AddressLinkPage",
  components: { AddressLink },
  computed: {
    address() {
      return this.$route.params.address;
    },
  },
  beforeMount() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.summary {
  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }
  .mt-2pert {
    margin-top: 2.6%;
  }
}
</style>
