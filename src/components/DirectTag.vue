<template>
  <b-badge pill class="badge-status" :variant="status">
    <span :title="direct">{{ computedTag }}</span>
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
      } else if (this.direct.toLowerCase() === "out") {
        return "warning";
      } else {
        return "grey";
      }
    },
    computedTag() {
      if (String(this.direct).length > 10) {
        return String(this.direct).substring(0, 10) + '..';
      } else {
        return this.direct;
      }
    }
  },
};
</script>

<style lang="scss">
// badge
.badge-status {
  padding: 0.3rem 0.6rem !important;
  font-size: 90% !important;

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

  &.badge-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
  }
}
</style>
