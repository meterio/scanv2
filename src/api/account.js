import { get } from "@/utils/http";

export default {
  getAccountDetail(network, address) {
    return get(network, `accounts/${address}`);
  },
  getTransfers(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/transfers?page=${page}&limit=${limit}`
    );
  },
  getTxs(network, address, page, limit = 8) {
    return get(network, `accounts/${address}/txs?page=${page}&limit=${limit}`);
  },
  getTxs20(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/erc20txs?page=${page}&limit=${limit}`
    );
  },
  getBuckets(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/buckets?page=${page}&limit=${limit}`
    );
  },
  getBids(network, address, page, limit = 8) {
    return get(network, `accounts/${address}/bids?page=${page}&limit=${limit}`);
  },

  getTopMTR(network, page, limit = 8) {
    return get(network, `accounts/top/mtr?page=${page}&limit=${limit}`);
  },
  getTopMTRG(network, page, limit = 8) {
    return get(network, `accounts/top/mtrg?page=${page}&limit=${limit}`);
  },
  getProposed(network, address, page, limit = 20) {
    return get(
      network,
      `accounts/${address}/proposed?page=${page}&limit=${limit}`
    );
  },
  getHolders(network, address) {
    return get(network, `accounts/${address}/holders`);
  },
  getTokens(network, address) {
    return get(network, `accounts/${address}/tokens`);
  }
};
