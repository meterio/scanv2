<template lang="pug">
.detail-page
  data-summary(:title="'Bucket: ' + id", :data="summary")
</template>

<script>
import DataSummary from '@/components/DataSummary.vue';
import BigNumber from 'bignumber.js';

export default {
  name: 'Bucket',
  components: {
    DataSummary,
  },
  data() {
    return { id: '', summary: {} };
  },
  beforeMount() {},
  methods: {
    init() {
      this.loadBucket();
    },
    getLockOption(option) {
      switch (option) {
        case 0:
          return 'One Day';
        case 1:
          return 'One Week';
        case 2:
          return 'Two Weeks';
        case 3:
          return 'Three Weeks';
        case 4:
          return 'Four Weeks';
        case 1000:
          return 'Forever';
      }
    },
    async loadBucket() {
      try {
        const { id } = this.$route.params;
        this.id = id;
        const res = await this.$api.bucket.getBucket(this.network, id);
        const { bucket } = res;
        this.summary = [
          { key: 'Owner', value: bucket.owner, type: 'address-link' },
          { key: 'Candidate', value: bucket.candidate, type: 'address-link' },
          {
            key: 'Value',
            value: bucket.value,
            type: 'amount',
            token: this.currentChain.gSymbol,
            precision: -1,
          },
          { key: 'Created At', value: bucket.createTime, type: 'full-timestamp' },
          {
            key: 'BonusVotes',
            value: new BigNumber(bucket.totalVotes).minus(bucket.value),
            type: 'amount',
            token: '',
            precision: -1,
          },
          { key: 'TotalVotes', value: bucket.totalVotes, type: 'amount', token: '', precision: -1 },
          { key: 'Nonce', value: bucket.nonce },
          // { key: 'Lock Option', value: this.getLockOption(bucket.option) },

          { key: 'Unbounded', value: bucket.unbounded ? 'Yes' : 'No' },
        ];

        if (bucket.unbounded) {
          this.summary.push({
            key: 'Release Time',
            value: bucket.matureTime,
            type: 'full-timestamp',
          });
        }
        if (bucket.autobid) {
          this.summary.push({ key: 'Autobid', value: bucket.autobid + '%' });
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }
  .mt-2pert {
    margin-top: 2.6%;
  }
}
</style>
