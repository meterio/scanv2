import { get } from "@/utils/http";

export default {
  getPresent(){
    return get(`auctions/present`)
  },

  getPast(){
    return get(`auctions/past`)
  }
};

