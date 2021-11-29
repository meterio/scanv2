<template>
  <div class="my-2">
    <b-form @submit.prevent>
      <b-form-group label="Metadata:">
        <b-form-textarea
          v-model="metadata"
          type="text"
          placeholder=""
          rows="15"
          required
        ></b-form-textarea>
      </b-form-group>
      <b-form-group label="Source Code:">
        <b-form-textarea
          v-model="source"
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
  computed: {
    metadata() {
      return this.files[0] ? this.files[0]["content"] : "";
    },
    source() {
      return this.files[1] ? this.files[1]["content"] : "";
    },
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