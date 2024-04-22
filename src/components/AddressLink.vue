<template>
  <span>
    <b-link :id="id" class="link" :to="{ name: 'address', params: { address: address } }">{{ text }}</b-link>
    <b-popover triggers="hover" :target="id">
      <b-button v-if="copied" variant="outline-success" pill size="sm">
        <b-icon icon="check"></b-icon>
      </b-button>
      <b-button v-else @click="copyToClipBoard" variant="light" pill size="sm">
        <b-icon icon="clipboard"></b-icon>
      </b-button>
    </b-popover>
  </span>
</template>

<script>
import { randomHex } from '@/utils';
import { ethers } from 'ethers';
export default {
  name: 'AddressLink',
  props: {
    address: {
      type: String,
      default: '0x',
    },
    name: {
      type: String,
      default: '',
    },
    short: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      copied: false,
      timer: null,
    };
  },
  computed: {
    id() {
      return randomHex();
    },
    tip() {
      if (this.text.toLowerCase() === this.address.toLowerCase()) {
        return '';
      }
      return this.address;
    },
    text() {
      if (this.name) {
        return this.name;
      }
      const formatAddr = ethers.utils.getAddress(this.address)
      const knowns = this.$store.state.dom.knownAddresses;
      if (formatAddr.toLowerCase() in knowns) {
        return knowns[this.address.toLowerCase()];
      }
      if (this.short) {
        return this.shortAddr(formatAddr, 14);
      }
      return formatAddr;
    },
  },
  methods: {
    handleHover(hovered) {
      this.isHovered = hovered;
    },
    async copyToClipBoard() {
      await navigator.clipboard.writeText(ethers.utils.getAddress(this.address));
      this.copied = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(this.clearCopied, 800);
    },
    clearCopied() {
      this.copied = false;
    },
  },
};
</script>

<style scoped lang="scss">
.popover {
  max-width: 100%; /* Max Width of the popover (depending on the container!) */
}
</style>
