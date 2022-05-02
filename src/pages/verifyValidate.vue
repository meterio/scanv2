<template>
  <div class="d-flex justify-content-between verify-validate">
    <span class="d-flex align-center">{{ data.name }}</span>
    <span v-if="!!invalid">Invalid: {{ invalid }}</span>
    <span v-if="!!missing">Missing: {{ missing }}</span>
    <div>
      <span>{{ data.status }}</span>
      <span class="ml-5">
        <b-button @click="verify" variant="link">Verify</b-button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "VerifyValidate",
  props: {
    data: {
      type: Object,
      default() {
        return {
          name: '',
          status: '',
          files: {
            invalid: {},
            missing: {}
          },
          verificationId: ''
        }
      }
    }
  },
  computed: {
    invalid() {
      const { invalid } = this.data.files
      const keyArr = Object.keys(invalid)
      if (keyArr.length) {
        return JSON.stringify(invalid)
      }

      return false
    },
    missing() {
      const { missing } = this.data.files
      const keyArr = Object.keys(missing)
      if (keyArr.length) {
        return JSON.stringify(missing)
      }

      return false
    }
  },
  methods: {
    async verify() {
      const { address } = this.$route.params
      const res = this.$api.verify.verifyValidated(this.currentChain, {
        address,
        verificationId: this.data.verificationId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.verify-validate {
  background-color: #cce5ff;
  border-radius: 5px;
  padding: 10px 10px;
  margin-bottom: 10px;
}
</style>