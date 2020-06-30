import { get } from "@/utils/http";

const block = {
  getRecentBlocks(page) {
    return get("blocks/recent", {
      page
    });
  }
};

export default block;
