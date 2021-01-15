import { get } from "@/utils/http";

export default {
  getAccountDetail(address){
    return get(`accounts/${address}`)
  },

  getTxs(address){
    return get(`accounts/${address}/txs`)
  },

  getBuckets(address){
    return get(`accounts/${address}/buckets`)
  }
};

