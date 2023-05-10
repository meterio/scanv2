import { get } from '@/utils/http';

export default {
  getTokenDetail(network, address, tokenId) {
    return get(network, `nfts/${address}/${tokenId}`);
  },

  updateTokenInfo(network, address, tokenId) {
    return get(network, `nfts/${address}/${tokenId}/update`);
  },
};
