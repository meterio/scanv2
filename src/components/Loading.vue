<template>
  <div v-if="loading" class="loading">
    <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
    <p>Loading...</p>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    loading: { type: Boolean, default: true }
  }
};
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  p {
    color: $secondary-font-color;
    margin-top: 6px;
  }
}
</style>
