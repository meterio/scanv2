import { get } from "@/utils/http";

export default {
  getRewards(){
    return get(`pow/rewards`)
  }
};

