import { get } from "@/utils/http";

export default {
  getAccountDetail(address){
    return get(`accounts/${address}`)
  }
};

