<template>
  <b-badge pill class="badge-status" :variant="status">
    <b-icon :icon="resultIcon(status)"></b-icon>
    <span>{{ status }}</span>
  </b-badge>
</template>

<script>
export default {
  nanme: "StatusTag",
  props: ["status"],
  methods: {
    resultIcon: function (result) {
      if (result === "success") {
        return "check";
      }

      if (result === "reverted") {
        return "x";
      }
      return null;
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
