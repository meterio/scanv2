import { get } from "@/utils/http";

const transaction = {
  getRecentTxs() {
    return get("txs/recent");
  },

  getTxDetail(hash){
    return get(`txs/${hash}`)
  }
};

export default transaction;
