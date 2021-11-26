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
  verify(data) {
    const url = SOURCIFY_API.server;
    return fetch(url, 'POST', data);
  },
  metadata({ chain, address }) {
    const url = `${SOURCIFY_API.repo}/contracts/full_match/${chain}/${address}/metadata.json`;
    return fetch(url, 'GET');
  },
  partialMetadata({ chain, address }) {
    const url = `${SOURCIFY_API.repo}/contracts/partial_match/${chain}/${address}/metadata.json`;
    return fetch(url, 'GET');
  },
  check({ chain, address }) {
    const url = `${SOURCIFY_API.server}/checkByAddresses?addresses=${address}&chainIds=${chain}`;
    return fetch(url, 'GET');
  }
};
