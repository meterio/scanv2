<template>
  <span v-b-tooltip.hover :title="text">
    <template v-if="tokenType === 'ERC20'">
      <span>{{ integer }}</span>
      <span v-if="shortMantissa" class="text-secondary">{{ shortMantissa }}</span>

      <b-link class="badge1 ml-1" v-if="token && tokenAddr" :to="{ name: 'address', params: { address: tokenAddr } }">{{
        token
      }}</b-link>
      <span v-else
        ><span v-if="token" class="badge1 ml-1">{{ token }}</span></span
      >
    </template>
    <template v-else-if="tokenType === 'ERC721' || tokenType === 'ERC1155'">
      <span :title="tokenId">[{{ computedTokenId }}]</span>
      <span v-if="token" class="badge1 ml-1">{{ token }}</span>
    </template>
  </span>
</template>

<script>
import { fromWei } from '@/utils';
export default {
  name: 'AmountTag',
  props: {
    amount: {
      type: [String, Number],
      default: '0',
    },
    token: {
      type: String,
      default: 'MTR',
    },
    precision: {
      type: Number,
      default: -1,
    },
    decimals: {
      type: Number,
      default: 18,
    },
    tokenType: {
      type: String,
      default: 'ERC20',
    },
    tokenId: {
      type: String,
      default: '',
    },
    tokenAddr: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      integer: '0',
      mantissa: '',
      shortMantissa: '',
      text: '',
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
      const items = fromWei(this.amount, -1, '', this.decimals).split('.');
      if (items.length == 1) {
        this.integer = items[0];
        this.mantissa = '';
        this.shortMantissa = '';
      } else {
        this.integer = items[0] + '.';
        this.mantissa = items[1];
        if (this.precision < 0) {
          this.shortMantissa = items[1];
          this.text = '';
          return;
        } else if (items[1].length <= this.precision) {
          this.shortMantissa = items[1];
        } else {
          this.shortMantissa = items[1].slice(0, this.precision) + '..';
        }
        this.text = items.join('.');
      }
    },
  },
  computed: {
    computedTokenId() {
      if (this.tokenId && this.tokenId.length > 4) {
        return this.tokenId.substring(0, 4) + '..';
      } else {
        return this.tokenId;
      }
    },
    // badgeClass() {
    //   if (this.token === "MTR") {
    //     return "badge badge-light ml-1";
    //   }
    //   if (this.token === "MTRG") {
    //     return "badge badge-light badge-mtrg ml-1";
    //   }
    //   return "badge badge-black ml-1";
    // },
  },
};
</script>

<style scoped lang="scss">
.badge1 {
  font-size: 90% !important;
  margin-left: 2px;
  // font-size: 70% !important;
  // padding: 2px 4px;
  // border-radius: 4px;
  // background: rgba(1, 1, 1, 0.01);
  // border: 1px solid rgba(1, 1, 1, 0.15);
}
</style>
