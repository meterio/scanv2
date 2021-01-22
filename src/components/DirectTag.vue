<template>
  <b-badge pill class="badge-status" :variant="status">
    <span>{{ direct }}</span>
  </b-badge>
</template>

<script>
export default {
  nanme: "DirectTag",
  props: ["direct"],
  computed: {
    status() {
      if (this.direct.toLowerCase() === "in") {
        return "success";
      } else {
        return "warning";
      }
    },
  },
};
</script>

<style lang="scss">
// badge
.badge-status {
  padding: 0.4rem 0.8rem !important;
  font-size: 90% !important;

  svg {
    margin-right: 0.2rem;
  }

  &.badge-info {
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb;
  }

  &.badge-primary {
    color: #287df9;
    background-color: #e9f2ff;
  }

  &.badge-success {
    color: #20ac69;
    background-color: rgba(32, 172, 105, 0.12);
  }

  &.badge-failed {
    color: rgba(244, 133, 133, 01);
    background-color: rgba(244, 133, 133, 0.12);
  }
  &.badge-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
  }
}
</style>
