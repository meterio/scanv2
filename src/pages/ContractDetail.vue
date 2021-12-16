<template>
  <div class="my-2">
    <b-form @submit.prevent>
      <b-form-group v-for="item in files" :label="item.name" :key="item.path">
        <b-form-textarea
          :value="item.content"
          type="text"
          placeholder=""
          rows="15"
          required
        ></b-form-textarea>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "Contract",
  props: {
    files: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.loading {
  opacity: 0.55;
  font-size: 14px;
  font-weight: bold;
}
</style>