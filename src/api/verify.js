import { commonGet, post } from "@/utils/http";
import { fetch } from "@/utils/http1";
import { SOURCIFY_API } from "@/config"

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
    const chain = network === 'main' ? '82' : '83';
    return fetch(url, 'POST', {
      chain,
      address,
      files
    });
  },
  files(network, { address }) {
    const chain = network === 'main' ? '82' : '83';
    const url = `${SOURCIFY_API[network]}/files/any/${chain}/${address}`;
    return fetch(url, 'GET');
  },
  check(network, { address }) {
    const chain = network === 'main' ? '82' : '83';
    const url = `${SOURCIFY_API[network]}/checkByAddresses?addresses=${address}&chainIds=${chain}`;
    return fetch(url, 'GET');
  }
};
