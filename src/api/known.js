import { get } from "@/utils/http";

export default {
  getAddresses(network) {
    return get(network, `knowns/address`);
  }
};
