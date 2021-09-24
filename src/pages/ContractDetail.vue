<template>
  <div class="my-2">
    <div class="loading" v-if="loading">
      <div class="text-center text-primary my-2">
        <b-spinner class="align-middle mr-2"></b-spinner>
        <strong>Loading...</strong>
      </div>
    </div>
    <b-form v-else @submit.prevent>
      <b-form-group
        label="Solidity Contract Code:"
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
        label="Contract ABI:"
        label-for="contract-abi"
      >
        <b-form-textarea
          id="contract-abi"
          v-model="form.contractAbi"
          type="text"
          placeholder=""
          rows="6"
          required
        ></b-form-textarea>
      </b-form-group>

    </b-form>
  </div>
</template>

<script>
export default {
  name: "Contract",
  data() {
    return {
      loading: true,
      form: {
        sourceCode: 'source code',
        contractAbi: 'contract abi'
      }
    }
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }
}
</script>

<style lang="scss" scoped>
  .loading {
    opacity: 0.55;
    font-size: 14px;
    font-weight: bold;
  }
</style>