import { get, post } from "@/utils/http";

export default {
  getAddresses(network) {
    return get(network, `knowns/address`);
  },
  getTokens(network) {
    return get(network, `knowns/token`);
  },
  saveKnowMethodAndEvent(network, events, methods) {
    return post(network, `knowns/saveMethodAndEvent`, { events, methods });
  },
  getAllMethodAndEvent(network) {
    return get(network, `knowns/getAllMethodAndEvent`);
  },
};
