<template>
  <b-badge class="badge-status" :variant="status">
    <span :title="direct">{{ computedTag }}</span>
  </b-badge>
</template>

<script>
export default {
  nanme: 'DirectTag',
  props: ['direct'],
  computed: {
    status() {
      if (this.direct.toLowerCase() === 'in') {
        return 'in'; // 'success';
      } else if (this.direct.toLowerCase() === 'out') {
        return 'out'; //'warning';
      } else {
        return 'grey';
      }
    },
    computedTag() {
      if (String(this.direct).length > 10) {
        return String(this.direct).substring(0, 10) + '..';
      } else {
        return this.direct;
      }
    }
  }
};
</script>

<style lang="scss">
// badge
.badge-status {
  padding: 0.3rem 0.1rem !important;
  font-size: 85% !important;
  font-weight: normal !important;

  svg {
    margin-right: 0.2rem;
  }

  &.badge-success {
    color: #20ac69;
    background-color: rgba(32, 172, 105, 0.12);
  }

  &.badge-grey {
    color: #626c76;
    // background-color: rgba(119, 131, 143, 0.12);
    background: rgba(248, 249, 250, 1);
    border: 1px solid #e9ecef;
    border-radius: 5px;
  }
  &.badge-in {
    font-size: 70% !important;
    text-transform: uppercase !important;
    color: #00c9a7;
    background: rgba(0, 161, 134, 0.15);
    border: 1px solid rgba(0, 161, 134, 0.25);
  }
  &.badge-out {
    font-size: 70% !important;
    text-transform: uppercase !important;
    color: #cc9a06;
    background: rgba(255, 193, 7, 0.15);
    border: 1px solid rgba(255, 193, 7, 0.25);
  }

  &.badge-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
  }
}
</style>
