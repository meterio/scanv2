import { get } from "@/utils/http";
export default {
  searchKeyWord(words) {
    return get("search/" + words);
  }
};
