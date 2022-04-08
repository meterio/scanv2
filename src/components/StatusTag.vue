<template>
  <b-badge pill class="badge-status" :variant="computedStatus">
    <b-icon :icon="computedIcon"></b-icon>
    <span>{{ status }}</span>
  </b-badge>
</template>

<script>
export default {
  nanme: 'StatusTag',
  props: ['status'],
  computed: {
    computedStatus() {
      if (String(this.status).includes('success')) {
        return 'success';
      } else if (String(this.status).includes('reverted')) {
        return 'reverted';
      } else {
        return '';
      }
    },
    computedIcon() {
      if (this.computedStatus === 'success') {
        return 'check';
      } else if (this.computedStatus === 'reverted') {
        return 'x';
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang="scss" >
// badge
.badge-status {
  padding: 0.3rem 0.5rem !important;
  font-size: 90% !important;
  font-weight: normal;

  svg {
    margin-right: 0.2rem;
  }

  &.badge-primary {
    color: #6171ff;
    background-color: #e9f2ff;
  }

  &.badge-success {
    color: #20ac69;
    background-color: rgba(32, 172, 105, 0.12);
  }

  &.badge-reverted {
    color: rgba(244, 133, 133, 01);
    background-color: rgba(244, 133, 133, 0.12);
  }
}
</style>
