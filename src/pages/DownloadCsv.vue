<template>
  <b-container class="verify-container">
    <section class="title-container my-3">
      <h3 class="text-center">Download Data</h3>
      <span></span>
    </section>
    <b-alert v-if="isError.status" show variant="danger">{{ isError.msg }}</b-alert>
    <b-alert v-if="isSuccess.status" show variant="success">{{ isSuccess.msg }}</b-alert>
    <section class="form-container">
      <span class="my-1">Export the earliest 5000 records starting from</span>
      <b-form-datepicker
        v-model="start"
        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
      ></b-form-datepicker>
      <span>to</span>
      <b-form-datepicker
        v-model="end"
        :date-format-options="{ year: 'numeric', month: 'numeric', day: 'numeric' }"
      ></b-form-datepicker>
    </section>
    <section class="text-center mt-4">
      <b-button class="mr-1" variant="light" @click="goBack">Back</b-button>
      <b-button :disabled="loading" @click="download" variant="primary">
        <b-spinner small type="grow" v-if="loading"></b-spinner>
        <span class="ml-1">Download</span>
      </b-button>
    </section>
  </b-container>
</template>

<script>
import { getCurrentChain } from '@/config';
export default {
  name: 'DownloadCsv',
  props: {
    address: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      start: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()),
      end: new Date(),
      loading: false,
      isError: {
        status: false,
        msg: 'Some error occur.',
      },
      isSuccess: {
        status: false,
        msg: 'Verification successful!',
      },
    };
  },
  methods: {
    async download() {
      this.isError.status = false;
      this.isSuccess.status = false;
      if (!this.start || !this.start) {
        return;
      }

      // console.log(new Date(this.start).getTime() / 1000)
      // console.log(new Date(this.end).getTime() / 1000)
      const start = new Date(this.start).getTime() / 1000;
      const end = new Date(this.end).getTime() / 1000;
      if (start > end) {
        this.isError = {
          status: true,
          msg: 'Start date must lt end date!',
        };
        return;
      }

      console.log('type', this.type);
      const chain = getCurrentChain(this.network);
      const base = chain.apiBase;

      // if (this.type == 'txs') {
      //   window.open(`${base}download/${this.address}/${start}/${end}/txs?page=1&limit=5000`)
      // }
      // if (this.type == 'erc20Txs') {
      //   window.open(`${base}download/${this.address}/${start}/${end}/erc20Txs?page=1&limit=5000`)
      // }
      // if (this.type == 'nftTxs') {
      //   window.open(`${base}download/${this.address}/${start}/${end}/nftTxs?page=1&limit=5000`)
      // }
      window.open(`${base}download/${this.address}/${start}/${end}/${this.type}?page=1&limit=5000`);
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
