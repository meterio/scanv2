<template>
  <b-container class="verify-container">
    <section class="title-container my-3">
      <h3 class="text-center">Verify & Publish Contract Source Code</h3>
      <span></span>
    </section>
    <b-alert v-if="isError.status" show variant="danger">{{ isError.msg }}</b-alert>
    <b-alert v-if="isSuccess.status" show variant="success">{{ isSuccess.msg }}</b-alert>
    <section class="form-container">
      <b-form-group label="Add Files">
        <b-form-file multiple v-model="files"
          placeholder="Meter uses sourcify.dev for contract verifications.  Add the solidity source and metadata files or a zip file "
        >
          <template slot="file-name" slot-scope="{ names }">
            <b-badge variant="dark">{{ names[0] }}</b-badge>
            <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
              + {{ names.length - 1 }} More files
            </b-badge>
          </template>
        </b-form-file>
      </b-form-group>
      <b-form-group
        v-if="contracts.length"
        label="Choose the main contract you want to verify"
        v-slot="{ ariaDescribedby }"
      >
        <b-form-checkbox
          v-for="(c, i) in contracts"
          v-model="chosenContract"
          :key="c.name"
          :value="i"
          :aria-describedby="ariaDescribedby"
        >
          {{ c.name + ': ' + c.path }}
        </b-form-checkbox>
      </b-form-group>
      
      <section class="text-center">
        <b-button class="mr-1" variant="light" @click="goBack">Back</b-button>
        <b-button :disabled="loading" @click="verify" variant="primary">
          <b-spinner v-if="loading" small></b-spinner>
          <span class="ml-1">Verify</span>
        </b-button>
        <b-button :disabled="loading" class="ml-1" @click="reset" variant="secondary">Reset</b-button>
      </section>
    </section>
  </b-container>
</template>

<script>

export default {
  name: "Verify",
  props: {
    address: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      isError: {
        status: false,
        msg: "Some error occur.",
      },
      isSuccess: {
        status: false,
        msg: "Verification successful!"
      },
      files: [],
      contracts: [],
      chosenContract: [],
    };
  },
  watch: {
    'chosenContract'(val) {
      if (val.length > 1) {
        this.chosenContract = val.slice(val.length - 1)
      }
    }
  },
  methods: {
    async verify() {
      this.isError.status = false
      this.isSuccess.status = false

      if (!this.files.length) {
        return this.isError = {
          status: true,
          msg: 'Please add files'
        }
      }

      this.loading = true
      const data = {
        address: this.address,
        files: [...this.files],
      };
      if (this.chosenContract.length) {
        data.chosenContract = this.chosenContract[0]
      }
      const res = await this.$api.verify.verifyFormData(this.network, data);
      if (res.error) {
        this.loading = false
        if (res.msg.contractsToChoose) {
          this.contracts = res.msg.contractsToChoose
        }
        return this.isError = {
          status: true,
          msg: res.msg.error || res.msg,
        };
      } else {
        const status = res.data.result[0].status
        if (status === "perfect" || status === "partial") {
          this.isSuccess = {
            status: true,
            msg: `Verification successful! ${status}ly verified at ${this.currentChain.name}:${this.address}`
          }
          // success
          await this.emitImportApi()
        }
      }
    },
    reset() {
      this.files = []
      this.contracts = []
      this.chosenContract = []
      this.isError.status = false
      this.isSuccess.status = false
    },
    async emitImportApi() {
      const res = await this.$api.known.emitImportApi(this.network, this.address);
      this.loading = false;
      if (res && res.verified) {
        // this.$router.go(-1);
      } else {
        this.isError = {
          status: true,
          msg: res.message,
        };
      }
    },
    goBack() {
      this.$router.go(-1)
    }
  },
};
</script>
<style lang="scss" scoped>

</style>
