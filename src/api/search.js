import { get } from "@/utils/http";
export default {
  searchKeyWord(network,words) {
    return get("search/" + words);
  }
};
