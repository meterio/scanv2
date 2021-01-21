import { get } from "@/utils/http";

export default {
  getAll(network) {
    return get(network, `metrics/all`);
  },
  getPos(network) {
    return get(network, `metrics/pos`);
  },
  getChart(network) {
    return get(network, `metrics/chart`);
  }
};
