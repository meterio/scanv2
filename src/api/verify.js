import { commonGet, post } from "@/utils/http";

const SOLC_V_LIST = " https://solc-bin.ethereum.org/bin/list.json";

export default {
  getSolcVersionList() {
    return commonGet(SOLC_V_LIST);
  },
  verifyContract(network, url, params) {
    return post(network, url, params);
  },
};
