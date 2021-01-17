import { get } from "@/utils/http";

export default {
  getRewards(page, limit = 8) {
    return get(`pow/rewards?page=${page}&limit=${limit}`);
  },

  getRewardsByEpoch(epoch) {
    return get(`pow/rewards/${epoch}`);
  }
};
