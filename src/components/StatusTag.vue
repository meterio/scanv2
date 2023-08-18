<template>
  <b-badge pill class="badge-status" :variant="computedVariant">
    <b-icon :icon="computedIcon"></b-icon>
    <span>{{ status }}</span>
  </b-badge>
</template>

<script>
export default {
  nanme: 'StatusTag',
  props: ['status'],
  computed: {
    computedVariant() {
      if (String(this.status).includes('success')) {
        return 'success';
      } else if (String(this.status).includes('reverted')) {
        return 'reverted';
      } else {
        return '';
      }
    },
    computedIcon() {
      if (this.computedVariant === 'success') {
        return 'check-circle-fill';
      } else if (this.computedVariant === 'reverted') {
        return 'x-octagon-fill';
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="scss">
// badge
.badge-status {
  padding: 0.3rem 0.5rem !important;
  font-size: 85%;
  font-weight: normal;
  text-align: left !important;
  white-space: normal;
  word-break: break-all;
  svg {
    margin-right: 0.2rem;
  }

  &.badge-primary {
    color: #003cb2;
    background-color: #e9f2ff;
  }

  &.badge-success {
    color: #20ac69;
    background-color: rgba(32, 172, 105, 0.12);
    border: 1px solid rgba(32, 172, 105, 0.25);
  }

  &.badge-reverted {
    color: rgba(244, 133, 133, 01);
    background-color: rgba(244, 133, 133, 0.12);
    border: 1px solid rgba(244, 133, 133, 0.25);
  }
}
</style>
