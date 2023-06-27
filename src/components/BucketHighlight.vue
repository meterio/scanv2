<template>
  <div>
    <span v-if="row.name === 'NativeBucketOpen'">
      <b>Open</b>
      <BucketLink class="ml-2" :id="row.bucketID" short />
      <b class="ml-2">With</b>
      <span class="ml-2"><AmountTag :amount="row.amount" token="MTRG" :precision="2" :decimals="18" /></span>
    </span>
    <span v-if="row.name === 'NativeBucketClose'">
      <b>Close</b>
      <BucketLink class="ml-2" :id="row.bucketID" short />
    </span>
    <span v-if="row.name === 'NativeBucketDeposit'">
      <b>Deposit</b>
      <span class="ml-2"><AmountTag :amount="row.amount" token="MTRG" :precision="2" :decimals="18" /></span>
      <b class="ml-2">To</b>
      <BucketLink class="ml-2" :id="row.bucketID" short />
    </span>
    <span v-if="row.name === 'NativeBucketWithdraw'">
      <b>Withdraw</b>
      <span class="ml-2"><AmountTag :amount="row.amount" token="MTRG" :precision="2" :decimals="18" /></span>
      <b class="ml-2">From</b>
      <BucketLink class="ml-2" :id="row.fromBktID" short />
      <b class="ml-2">To</b>
      <BucketLink class="ml-2" :id="row.toBktID" short />
    </span>
    <span v-if="row.name === 'NativeBucketMerge'">
      <b>Merge</b>
      <BucketLink class="ml-2" :id="row.fromBucketID" short />
      <b class="ml-2">To</b>
      <BucketLink class="ml-2" :id="row.toBucketID" short />
    </span>
    <span v-if="row.name === 'NativeBucketTransferFund'">
      <b>Transfer</b>
      <span class="ml-2"><AmountTag :amount="row.amount" token="MTRG" :precision="2" :decimals="18" /></span>
      <b class="ml-2">From</b>
      <BucketLink class="ml-2" :id="row.fromBucketID" short />
      <b class="ml-2">To</b>
      <BucketLink class="ml-2" :id="row.toBucketID" short />
    </span>
    <span v-if="row.name === 'NativeBucketUpdateCandidate'">
      <b>Update Candidate on</b>
      <BucketLink class="ml-2" :id="row.bucketID" short />
      <b>From</b>
      <AddressLink class="ml-2" :address="row.fromCandidate" short />
      <b class="ml-2">To</b>
      <AddressLink class="ml-2" :address="row.toCandidate" short />
    </span>
  </div>
</template>

<script>
import AmountTag from '@/components/AmountTag.vue';
import BucketLink from '@/components/BucketLink.vue';
import AddressLink from '@/components/AddressLink.vue';

export default {
  name: 'BucketHighlight',
  components: { AmountTag, BucketLink, AddressLink },
  props: ['row'],
  computed: {},
};
</script>
<style lang="scss" scoped>
b {
  font-weight: 600 !important;
}
</style>
