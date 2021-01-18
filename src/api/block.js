import { get } from "@/utils/http";

const block = {
  getRecentBlocks(page=1,limit=20) {
    return get(`blocks/recent?page=${page}&limit=${limit}`);
  },

  getBlockDetail(revision){
    return get(`blocks/${revision}`)
  }
};

export default block;
