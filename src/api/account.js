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
  getTxs721(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/erc721txs?page=${page}&limit=${limit}`
    );
  },
  getTxs1155(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/erc1155txs?page=${page}&limit=${limit}`
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
  getHolders(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/holders?page=${page}&limit=${limit}`
    );
  },
  getTokens(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/tokens?page=${page}&limit=${limit}`
    );
  },
  getErc20Tokens(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/erc20tokens?page=${page}&limit=${limit}`
    )
  },
  getNFTTokens(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/nfttokens?page=${page}&limit=${limit}`
    )
  },
  getNFTTxs(network, address, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/nfttxs?page=${page}&limit=${limit}`
    );
  },
  getNFTTxsByTokenAddrTokenId(network, address, id, page, limit = 8) {
    return get(
      network,
      `accounts/${address}/${id}/nfttxs?page=${page}&limit=${limit}`
    );
  }
};
