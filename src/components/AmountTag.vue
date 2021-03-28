<template>
  <span v-b-tooltip.hover :title="text">
    <span class="integer">{{ integer }}</span>
    <span v-if="shortMantissa" class="text-secondary">{{ shortMantissa }}</span>
    <span v-if="token" :class="badgeClass">{{ token }}</span>
  </span>
</template>

<script>
import { fromWei } from "@/utils";
export default {
  name: "AmountTag",
  props: {
    amount: {
      type: String,
      default: "0",
    },
    token: {
      type: String,
      default: "MTR",
    },
    precision: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      integer: "0",
      mantissa: "",
      shortMantissa: "",
      text: "",
    };
  },
  created() {
    this.init();
  },
  updated(val) {
    this.init();
  },
  watch: {
    amount: function (newVal, oldVal) {
      this.init();
    },
  },
  methods: {
    init() {
      const items = fromWei(this.amount, -1).split(".");
      if (items.length == 1) {
        this.integer = items[0];
        this.mantissa = "";
        this.shortMantissa = "";
      } else {
        this.integer = items[0] + ".";
        this.mantissa = items[1];
        if (this.precision < 0) {
          this.shortMantissa = items[1];
          this.text = "";
          return;
        } else if (items[1].length <= this.precision) {
          this.shortMantissa = items[1];
        } else {
          this.shortMantissa = items[1].slice(0, this.precision) + "..";
        }
        this.text = items.join(".");
      }
    },
  },
  computed: {
    badgeClass() {
      if (this.token === "MTR") {
        return "badge badge-light ml-1";
      }
      if (this.token === "MTRG") {
        return "badge badge-light badge-mtrg ml-1";
      }
      return "badge badge-black ml-1";
    },
  },
};
</script>

<style scoped lang="scss">
.integer {
  font-weight: bold;
}
.badge {
  font-weight: bold;
  font-size: 11px !important;
}
.badge-light {
  background: darken(#f8f9fa, 2%);
  // border: 1px solid #e2e3e5;
}
</style>
