import { get } from "@/utils/http";

export default {
  getContractFiles(network, address) {
    return get(network, `cfile/${address}`);
  }
}