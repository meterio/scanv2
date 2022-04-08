<template>
  <b-badge pill class="badge-status" :variant="status">
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
    },
  },
};
</script>

<style lang="scss" >
// badge
.badge-status {
  padding: 0.3rem 0.1rem !important;
  font-size: 90% !important;
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
    background-color: rgba(119, 131, 143, 0.12);
  }
  &.badge-in {
    color: #00c9a7;
    background: rgba(0, 201, 167, 0.1);
  }
  &.badge-out {
    color: #f5ae67;
    background: rgba(201, 167, 0, 0.1);
  }

  &.badge-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
  }
}
</style>
