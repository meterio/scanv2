import { commonGet, post } from "@/utils/http";
import { fetch } from "@/utils/http1";
import { SOURCIFY_API, MATCH_CHAIN } from "@/config";

const SOLC_V_LIST = " https://solc-bin.ethereum.org/bin/list.json";

export default {
  getSolcVersionList() {
    return commonGet(SOLC_V_LIST);
  },
  verifyContract(network, url, params) {
    return post(network, url, params);
  },
  verify(network, { address, files }) {
    const url = SOURCIFY_API[network];
    const chain = MATCH_CHAIN[network];
    return fetch(url, "POST", {
      chain,
      address,
      files,
    });
  },
  verifyFormData(network, { address, files }) {
    const url = SOURCIFY_API[network];
    const chain = MATCH_CHAIN[network];
    let data = new FormData();
    data.append("address", address);
    data.append("chain", chain);
    if (files.length > 0) {
      files.forEach((file) => data.append("files", file));
    }
    return fetch(url, "POST", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  files(network, { address }) {
    const chain = MATCH_CHAIN[network];
    const url = `${SOURCIFY_API[network]}/files/any/${chain}/${address}`;
    return fetch(url, "GET");
  },
  check(network, { address }) {
    const chain = MATCH_CHAIN[network];
    const url = `${SOURCIFY_API[network]}/checkByAddresses?addresses=${address}&chainIds=${chain}`;
    return fetch(url, "GET");
  },
};
