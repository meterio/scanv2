<template>
  <b-container class="verify-container">
    <section class="title-container my-3">
      <h3 class="text-center">Verify & Publish Contract Source Code </h3>
      <span></span>
    </section>
    <b-alert v-if="isError.status" show variant="danger">{{ isError.msg }}</b-alert>
    <section class="form-container">
      <div class="loading" v-if="loading">
        <div class="text-center text-primary my-2">
          <b-spinner class="align-middle mr-2"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </div>
      <b-form v-else @submit="onSubmit" @reset="onReset">
        <b-form-group
          label="Please enter the Contract Address you would like to verify:"
          label-for="address"
        >
          <b-form-input
            id="address"
            v-model="form.address"
            type="text"
            placeholder="0x..."
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Please select Compiler Type:" label-for="compiler-type">
          <b-form-select
            id="compiler-type"
            v-model="form.compilerType"
            :options="compilerTypes"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group label="Please select Compiler Version:" label-for="compiler-version">
          <b-form-select
            id="compiler-version"
            v-model="form.version"
            :options="compilerVersions"
            required
          ></b-form-select>
        </b-form-group>

        <!-- <b-form-group label="Please select Open Source License Type:" label-for="license-type">
          <b-form-select
            id="license-type"
            v-model="form.licenseType"
            :options="licenseTypes"
            required
          ></b-form-select>
        </b-form-group> -->
        
        <b-form-group>
          <label for="optimization">
            <b-icon id="optimization-tip" icon="exclamation-circle"></b-icon>
            <b-tooltip target="optimization-tip" triggers="hover">
              Select the option you used when compiling this contract.
            </b-tooltip>
            <span class="ml-1">Please select optimization:</span>
          </label>
          <b-form-select
            id="optimization"
            v-model="form.optimizer"
            :options="optimizations"
            required
          ></b-form-select>
        </b-form-group>

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

        <section class="text-center">
          <b-button type="submit" variant="primary">Verify</b-button>
          <b-button class="ml-1" type="reset" variant="secondary">Reset</b-button>
        </section>
      </b-form>
    </section>
  </b-container>
</template>

<script>
import api from '@/api';

export default {
  name: "Verify",
  data() {
    return {
      loading: false,
      isError: {
        status: false,
        msg: 'Some error occur.'
      },
      form: {
        address: '',
        compilerType: 1,
        version: null,
        licenseType: null,
        optimizer: null,
        sourceCode: ''
      },
      compilerTypes: [
        { text: 'please select', value: null },
        { text: 'Solity (Single file)', value: '1' }
      ],
      compilerVersions: [
        { text: 'please select', value: null }
      ],
      licenseTypes: [
        { text: 'please select', value: null },
        { text: '1) No License (None)', value: "1" },
        { text: '2) The Unlicense (Unlicense)', value: "2" },
        { text: '3) MIT License (MIT)', value: "3" },
        { text: '4) GNU General Public License v2.0 (GNU GPLv2)', value: "4"},
        { text: '5) GNU General Public License v3.0 (GNU GPLv3)', value: "5" },
        { text: '6) GNU Lesser General Public License v2.1 (GNU LGPLv2.1)', value: "6" },
        { text: '7) GNU Lesser General Public License v3.0 (GNU LGPLv3)', value: "7" },
        { text: '8) BSD 2-clause "Simplified" license (BSD-2-Clause)', value: "8" },
        { text: '9) BSD 3-clause "New" Or "Revised" license (BSD-3-Clause)', value: "9" },
        { text: '10) Mozilla Public License 2.0 (MPL-2.0)', value: "10" },
        { text: '11) Open Software License 3.0 (OSL-3.0)', value: "11" },
        { text: '12) Apache 2.0 (Apache-2.0)', value: "12" },
        { text: '13) GNU Affero General Public License (GNU AGPLv3)', value: "13" },
      ],
      optimizations: [
        { text: 'please select', value: null },
        { text: 'No', value: '0' },
        { text: 'Yes', value: '1' }
      ]
    };
  },
  async created() {
    const { address } = this.$route.params;
    this.form.address = address;
    const solcVersionData = await api.verify.getSolcVersionList();
    const solcVersionList = []
    for (const key in solcVersionData.releases) {
      solcVersionList.push({
        text: solcVersionData.releases[key],
        value: key
      })
    }
    this.compilerVersions.splice(1, 0, ...solcVersionList)
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();
      this.isError.status = false;
      const { address } = this.$route.params;
      this.loading = true;
      const res = await api.verify.verifyContract(this.network, `accounts/${address}/verify`, this.form)
      this.loading = false;
      if (res && res.result && res.result.verified) {
        // success
      } else {
        // failure
        if (res && res.result && res.result.error) {
          this.isError = {
            status: true,
            msg: res.result.error
          }
        } else {
          this.isError = {
            status: true,
            msg: 'Some error occur.'
          }
        }
      }
    },
    onReset(e) {
      e.preventDefault();
      this.form = {
        ...this.form,
        compilerType: null,
        version: null,
        licenseType: null,
        sourceCode: '',
      }
      this.isError.status = false;
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
