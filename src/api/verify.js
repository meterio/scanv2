import { fetch } from '@/utils/http1';
import { getCurrentChain } from '@/config';

export default {
  verifyFormData(network, { address, files, chosenContract }) {
    const chain = getCurrentChain(network);
    const url = chain.sourcifyApiBase;
    const chainId = chain.chainId;
    let data = new FormData();
    data.append('address', address);
    data.append('chain', chainId);
    if (chosenContract !== undefined) {
      data.append('chosenContract', chosenContract);
    }
    if (files.length > 0) {
      files.forEach((file) => data.append('files', file));
    }
    return fetch(url, 'POST', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
