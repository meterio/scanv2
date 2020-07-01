import { get } from "@/utils/http";

const transaction = {
  getRecentTxs(page) {
    return get("transactions/recent", {
      page
    });
  }
};

export default transaction;
