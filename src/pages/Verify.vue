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
        <b-form-group label="Choose the Solidity Contract Code:">
          <b-form-file
            multiple
            v-model="form.sourceCodeFiles"
            required
          >
            <template slot="file-name" slot-scope="{ names }">
              <b-badge variant="dark">{{ names[0] }}</b-badge>
              <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
                + {{ names.length - 1 }} More files
              </b-badge>
            </template>
          </b-form-file>
        </b-form-group>
        <b-form-group label="Choose the Metadata Code:">
          <b-form-file v-model="form.metadataFile" required></b-form-file>
        </b-form-group>

        <section class="text-center">
          <b-button type="submit" variant="primary">Verify</b-button>
          <b-button class="ml-1" type="reset" variant="secondary">Reset</b-button>
        </section>
      </b-form>
      <!-- <b-button @click="test" class="ml-1" type="reset" variant="secondary">TEST</b-button> -->
    </section>
  </b-container>
</template>

<script>
import { abi } from "@meterio/devkit";

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
        sourceCodeFiles: [],
        metadataFile: null,
      },
    };
  },
  async created() {
    const { address } = this.$route.params;
    if (!address) {
      return this.$router.push('/')
    }
    this.form.address = address;
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();
      this.isError.status = false;
      this.loading = true;
      const files = [this.form.metadataFile];
      this.form.sourceCodeFiles.forEach(item => files.push(item))
      const data = {
        address: this.form.address,
        files,
      };
      const res = await this.$api.verify.verifyFormData(this.network, data);
      console.log("verify res", res);
      
      if (res.error) {
        this.loading = false;
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
          await this.saveKnowMethodAndEvent();
        }
      }
    },
    async test() {
      const events = [];
      const methods = [
        {
          signature: '0x00000001',
          name: 'test-name-1',
          abi: 'test-abi-1'
        },
        {
          signature: '0x00000002',
          name: 'test-name-2',
          abi: 'test-abi-2'
        },
        {
          signature: '0x00000003',
          name: 'test-name-3',
          abi: 'test-abi-3'
        }
      ];

      const saveKnowMethodAndEventRes = await this.$api.known.saveKnowMethodAndEvent(this.network, events, methods);
      console.log('saveKnowMethodAndEventRes', saveKnowMethodAndEventRes);
    },
    async saveKnowMethodAndEvent() {
      let file = this.form.metadataFile;
      let reader = new FileReader();
      reader.onload = async (res) => {
        const result = JSON.parse(res.target.result);
        const events = [];
        const methods = [];
        for (const a of result.output.abi) {
          if (a.type === 'function') {
            const fun = new abi.Function(a);
            methods.push({
              signature: fun.signature,
              contractAddress: this.form.address.toLowerCase(),
              name: fun.canonicalName,
              abi: JSON.stringify(a)
            })
          }
          if (a.type === 'event') {
            const eve = new abi.Event(a);
            events.push({
              signature: eve.signature,
              contractAddress: this.form.address.toLowerCase(),
              name: eve.canonicalName,
              abi: JSON.stringify(a)
            })
          }
        }
        const saveKnowMethodAndEventRes = await this.$api.known.saveKnowMethodAndEvent(this.network, events, methods);
        console.log('saveKnowMethodAndEventRes', saveKnowMethodAndEventRes);

        this.loading = false;

        this.$router.go(-1);
      };
      reader.readAsText(file);
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
