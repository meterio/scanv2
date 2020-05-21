<template>
  <div>footer111 - {{ currentYear }}</div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
};
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
  background-color: #ccc;
  padding: 40px 0;
  width: 100%;
  margin-top: auto;
}
</style>
