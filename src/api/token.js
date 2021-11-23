import { get } from "@/utils/http";

export default {
  getTokenProfile(network, address) {
    return get(network, `token/${address}`);
  },
};
