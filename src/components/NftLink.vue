<template>
  <span class="text-wrap">
    <span v-if="disabled" class="nft-link">
      <span>[</span><span>{{ tokenId }}</span
      ><span>]</span>
    </span>
    <span v-else class="nft-link">
      <span>[</span>
      <b-link :id="id" class="link" :to="{ name: 'nft', params: { address: address, tokenId: tokenId } }">{{
        tokenId
      }}</b-link>
      <span>]</span>
      <b-popover v-if="mediaUrl" triggers="hover" :target="id">
        <img :src="mediaUrl" width="110" class="thumbnail" />
      </b-popover>
    </span>
    <span v-if="value > 1">({{ value }})</span>

    {{ mediaUrl }}
  </span>
</template>

<script>
import { randomHex } from '@/utils';
export default {
  name: 'NftLink',
  props: {
    address: { type: String, default: '0x' },
    tokenId: { type: String, default: '0' },
    value: { type: Number, default: 0 },
    mediaUrl: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  created() {
    this.id = randomHex();
    console.log(this.id);
  },
  data() {
    return {
      id: '',
      hint: '',
      timer: null,
    };
  },
  computed: {},
  methods: {},
};
</script>

<style scoped lang="scss">
.nft-link {
  color: #77838f;
  background: rgba(119, 131, 143, 0.1);
  border-radius: 4px;
  padding: 2px 4px;
  margin-right: 10px;
}
.thumbnail {
  border-radius: 10px;
  border: 1px solid #ccc;
  padding: 5px;
}
</style>
