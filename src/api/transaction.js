import { get } from "@/utils/http";

const transaction = {
  getRecentTxs(page=1, limit=40) {
    return get(`txs/recent/?page=${page}&limit=${limit}`);
  },

  getTxDetail(hash){
    return get(`txs/${hash}`)
  }
};

export default transaction;
