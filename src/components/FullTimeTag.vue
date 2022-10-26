<template>
  <span>
    <span v-b-tooltip.hover>{{ ago }} ({{ formatted }}) </span>
  </span>
</template>

<script>
import { formatEtherscanTime, formatTime, fromNow } from '../utils';
export default {
  name: 'FullTimeTag',
  props: {
    timestamp: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {};
  },
  computed: {
    ago() {
      return fromNow(this.timestamp * 1000);
    },
    formatted() {
      return formatEtherscanTime(this.timestamp * 1000) + ' +UTC';
    }
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.popover {
  max-width: 100%; /* Max Width of the popover (depending on the container!) */
}
</style>
