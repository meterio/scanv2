<template>
  <div class="loading">
    <!-- <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner> -->
    <!-- <p>Loading...</p> -->

    <div class="text-center text-primary my-2">
      <b-spinner class="align-middle mr-2"></b-spinner>
      <strong>Loading...</strong>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
};
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  opacity: 0.55;
  font-size: 14px;
  p {
    color: $secondary-font-color;
    margin-top: 6px;
  }
}
</style>
