<template lang="pug">
div
  address-link(:address="address")
  amount-tag(amount="010239882028020303828201", :symbol="systemCoin")
</template>

<script>
import AddressLink from "@/components/AddressLink";
import AmountTag from "@/components/AmountTag";
import { SYSTEM_COIN, SYSTEM_TOKEN } from "@/config";

export default {
  name: "AddressLinkPage",
  data() {
    return {
        systemCoin: SYSTEM_COIN,
        systemToken: SYSTEM_TOKEN,
    };
  },
  components: { AddressLink, AmountTag },
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
