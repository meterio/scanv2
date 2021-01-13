import { get } from "@/utils/http";

export default {
  getAll() {
    return get(`metrics/all`);
  },
  getPos() {
    return get(`metrics/pos`);
  }
};
