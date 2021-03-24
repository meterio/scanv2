import { get } from "@/utils/http";

const block = {
  getBest(network) {
    return get(network, `blocks/best`);
  },

  getRecentBlocks(network, page = 1, limit = 20) {
    return get(network, `blocks/recent?page=${page}&limit=${limit}`);
  },

  getBlockDetail(network, revision) {
    return get(network, `blocks/${revision}`);
  }
};

export default block;
