<template>
  <span>
    Bucket <b-link :id="_id" class="link" :to="{ name: 'bucket', params: { id: id } }">{{ text }}</b-link>
    <b-popover triggers="hover" :target="_id">
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
  name: 'BucketLink',
  props: {
    id: {
      type: String,
      default: '0x',
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
    _id() {
      return randomHex();
    },
    tip() {
      if (this.text.toLowerCase() === this.id.toLowerCase()) {
        return '';
      }
      return this.id;
    },
    text() {
      if (this.short) {
        return this.shortAddr(this.id.toLowerCase(), 14);
      }
      return this.id.toLowerCase();
    },
  },
  methods: {
    handleHover(hovered) {
      this.isHovered = hovered;
    },
    async copyToClipBoard() {
      await navigator.clipboard.writeText(this.id);
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
