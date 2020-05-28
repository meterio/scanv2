<template>
  <div class="data-card">
    <h3 class="title">$21.56(+4.3%)</h3>
    <p class="label">MTRG Price</p>
  </div>
</template>

<script>
export default {
  name: "DataCard"
};
</script>

<style lang="scss" scoped>
.data-card {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    color: #0c2954;
    font-weight: normal;
    font-size: 1.17rem;
  }

  .label {
    color: #a6b5cc;
    font-size: 13px;
  }
}
</style>
