<template>
  <span>
    <span :id="iconId" v-if="data.isContract"><b-icon icon="file-earmark-text"></b-icon> </span>
    <b-popover triggers="hover" :target="iconId">
      <span>Contract</span>
    </b-popover>
    <b-link :id="id" class="link" :to="{ name: 'address', params: { address: data.address } }">{{ text }}</b-link>
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
export default {
  name: 'AddressLink',
  props: {
    data: {
      type: Object,
      default() {
        return {
          address: '0x',
          isContract: false,
        };
      },
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
    iconId() {
      return randomHex();
    },
    tip() {
      if (this.text.toLowerCase() === this.data.address.toLowerCase()) {
        return '';
      }
      return this.data.address;
    },
    text() {
      if (this.name) {
        return this.name;
      }
      const knowns = this.$store.state.dom.knownAddresses;
      if (this.data.address.toLowerCase() in knowns) {
        return knowns[this.data.address.toLowerCase()];
      }
      if (this.short) {
        return this.shortAddr(this.data.address.toLowerCase(), 14);
      }
      return this.data.address.toLowerCase();
    },
  },
  methods: {
    handleHover(hovered) {
      this.isHovered = hovered;
    },
    async copyToClipBoard() {
      await navigator.clipboard.writeText(this.data.address);
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
