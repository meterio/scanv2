import { get } from "@/utils/http";

const epoch = {
  getRecentEpochs(network, page = 1, limit = 20) {
    return get(network, `epochs/recent?page=${page}&limit=${limit}`);
  },

  getEpoch(network, epoch) {
    return get(network, `epochs/${epoch}`);
  },
  getMembers(network, epoch, page, limit) {
    return get(network, `epochs/${epoch}/members?page=${page}&limit=${limit}`);
  },
  getStats(network, epoch){
    return get(network, `epochs/${epoch}/stats`)
  }
};

export default epoch;
