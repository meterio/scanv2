import { get } from '@/utils/http';

export default {
  getContractFiles(network, address) {
    return get(network, `cfile/${address}`);
  },
  getContractBytecode(network, address) {
    return get(network, `contract/${address}`);
  },
};
