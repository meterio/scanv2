import { get } from "@/utils/http";

const block = {
  getRecentBlocks(page) {
    return get("blocks/recent");
  },

  getBlockDetail(revision){
    return get(`blocks/${revision}`)
  }
};

export default block;
