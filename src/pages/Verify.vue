<template>
  <b-container class="verify-container">
    <section class="title-container my-3">
      <h3 class="text-center">Verify & Publish Contract Source Code</h3>
      <span></span>
    </section>
    <b-alert v-if="isError.status" show variant="danger">{{
      isError.msg
    }}</b-alert>
    <section class="form-container">
      <div class="loading" v-if="loading">
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-2"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </div>
      <b-form v-else @submit="onSubmit" @reset="onReset">
        <b-form-group
          label="Enter the Solidity Contract Code below:"
          label-for="solidity-code"
        >
          <b-form-textarea
            id="solidity-code"
            v-model="form.sourceCode"
            type="text"
            placeholder=""
            rows="6"
            required
          ></b-form-textarea>
        </b-form-group>
        <b-form-group
          label="Enter the Metadata Code below:"
          label-for="metadata"
        >
          <b-form-textarea
            id="metadata"
            v-model="form.metadata"
            type="text"
            placeholder=""
            rows="6"
            required
          ></b-form-textarea>
        </b-form-group>

        <section class="text-center">
          <b-button type="submit" variant="primary">Verify</b-button>
          <b-button class="ml-1" type="reset" variant="secondary"
            >Reset</b-button
          >
        </section>
      </b-form>
    </section>
  </b-container>
</template>

<script>
export default {
  name: "Verify",
  data() {
    return {
      loading: false,
      isError: {
        status: false,
        msg: "Some error occur.",
      },
      form: {
        address: "",
        sourceCode: "",
        metadata: "",
      },
    };
  },
  async created() {
    const { address } = this.$route.params;
    this.form.address = address;
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();
      this.isError.status = false;
      this.loading = true;
      const data = {
        address: this.form.address,
        files: {
          sourceCode: this.form.sourceCode.toString(),
          metadata: this.form.metadata.toString(),
        },
      };
      const res = await this.$api.verify.verify(this.network, data);
      console.log("verify res", res);
      this.loading = false;
      if (res.error) {
        this.isError = {
          status: true,
          msg: res.msg.error || res.msg,
        };
      } else {
        if (
          res.data.result[0].status === "perfect" ||
          res.data.result[0].status === "partial"
        ) {
          // success
          this.$router.go(-1);
        }
      }
    },
    onReset(e) {
      e.preventDefault();
      this.form = {
        ...this.form,
        sourceCode: "",
        metadata: "",
      };
      this.isError.status = false;
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
