import { get } from '@/utils/http';

export default {
  getAddresses(network) {
    return get(network, `knowns/address`);
  },
  getTokens(network) {
    return get(network, `knowns/token`);
  },
  emitImportApi(network, address) {
    return get(network, `knowns/import/${address}`);
  },
};
