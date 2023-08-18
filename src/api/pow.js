import { get } from '@/utils/http';

export default {
  getRewards(network, page, limit = 8) {
    return get(network, `pow/rewards?page=${page}&limit=${limit}`);
  },

  getRewardsByEpoch(network, epoch) {
    return get(network, `pow/rewards/${epoch}`);
  },

  getPowChart(network) {
    return get(network, `pow/chart`);
  },
};
