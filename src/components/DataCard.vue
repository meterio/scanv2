<template>
  <div class="data-card">
    <h3 class="content">
      {{ data.content }}
      <span v-if="data.change" class="change">({{ data.change }})</span>
    </h3>
    <p class="label">{{ data.label }}</p>
  </div>
</template>

<script>
export default {
  name: 'DataCard',
  props: ['data']
};
</script>

<style lang="scss" scoped>
.data-card {
  min-height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .content {
    color: #0c2954;
    font-weight: normal;
    font-size: 1.1rem;

    .change {
      color: #6171ff;
      font-size: 1rem;
    }
  }

  .label {
    color: #a6b5cc;
    font-size: 13px;
    margin: 0;
  }
}
</style>
