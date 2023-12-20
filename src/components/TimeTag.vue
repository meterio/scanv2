<template>
  <span>
    <span v-b-tooltip.hover :title="formatted">{{ ago }}</span>
  </span>
</template>

<script>
import { formatTime, fromNow } from '../utils';
export default {
  name: 'TimeTag',
  props: {
    timestamp: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    ago() {
      if (!this.timestamp) {
        return 'unknown'
      }
      return fromNow(this.timestamp * 1000);
    },
    formatted() {
      if (!this.timestamp) {
        return 'unknown'
      }
      return formatTime(this.timestamp * 1000);
    },
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.popover {
  max-width: 100%; /* Max Width of the popover (depending on the container!) */
}
</style>
