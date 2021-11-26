<template>
  <div class="my-2">
    <div class="loading" v-if="loading">
      <div class="text-center text-primary my-2">
        <b-spinner class="align-middle mr-2"></b-spinner>
        <strong>Loading...</strong>
      </div>
    </div>
    <b-form v-else @submit.prevent>
      <b-form-group label="Contract ABI:" label-for="contract-abi">
        <b-form-textarea
          id="contract-abi"
          v-model="form.contractAbi"
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
  props: ["address", "verifyStatus"],
  data() {
    return {
      loading: false,
      form: {
        contractAbi: "",
      },
    };
  },
  async created() {
    const data = {
      chain: this.network === "main" ? "82" : "83",
      address: this.address,
    };
    if (this.verifyStatus === "perfect") {
      this.loading = true;
      const res = await this.$api.verify.metadata(data);
      this.form.contractAbi = JSON.stringify(res.data.output.abi, null, 2);
      this.loading = false;
    } else if (this.verifyStatus === "partial") {
      this.loading = true;
      const res = await this.$api.verify.partialMetadata(data);
      this.form.contractAbi = JSON.stringify(res.data.output.abi, null, 2);
      this.loading = false;
    }
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