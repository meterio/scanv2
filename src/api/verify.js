import { fetch } from "@/utils/http1";
import { getCurrentChain } from "@/config";

export default {
  verifyFormData(network, { address, files }) {
    const chain = getCurrentChain(network);
    const url = chain.sourcifyApiBase;
    const chainId = chain.chainId;
    let data = new FormData();
    data.append("address", address);
    data.append("chain", chainId);
    if (files.length > 0) {
      files.forEach((file) => data.append("files", file));
    }
    return fetch(url, "POST", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  inputFiles(chain, { files }) {
    const url = chain.sourcifyApiBase;
    let data = new FormData();
    if (files.length > 0) {
      files.forEach((file) => data.append("files", file));
    }
    return fetch(`${url}/input-files`, "POST", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  verifyValidated(chain, { address, verificationId }) {
    const url = chain.sourcifyApiBase;
    const chainId = chain.chainId;
    const data = {
      contracts: [{
        address,
        verificationId,
        chainId
      }]
    }

    return fetch(`${url}/verify-validated`, "POST", data);
  }
};
