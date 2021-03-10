import { get } from "@/utils/http";

const epoch = {
  getRecentEpochs(network, page = 1, limit = 20) {
    return get(network, `epochs/recent?page=${page}&limit=${limit}`);
  },

  getEpoch(network, epoch) {
    return get(network, `epochs/${epoch}`);
  }
};

export default epoch;
