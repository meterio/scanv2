import { get } from "@/utils/http";

const block = {
  getRecentBlocks(network, page = 1, limit = 20) {
    console.log("get recent block");
    return get(network, `blocks/recent?page=${page}&limit=${limit}`);
  },

  getBlockDetail(network, revision) {
    return get(network, `blocks/${revision}`);
  }
};

export default block;
