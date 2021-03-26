import { get } from "@/utils/http";

const validateTypeUrl = {
  Delegates: "validators/delegate",
  Candidates: "validators/candidate",
  Jailed: "validators/jailed"
};

export default {
  getValidateTypeList(network, page, limit, type, searchName) {
    return get(
      network,
      validateTypeUrl[type] +
        `?page=${page}&limit=${limit}&search=${searchName}`
    );
  },
  getValidateReward(network, page, limit) {
    return get(network, `validators/rewards?page=${page}&limit=${limit}`);
  },
  getRewardsByEpoch(network, epoch) {
    return get(network, `validators/rewards/${epoch}`);
  },
  getValidator(network, address) {
    return get(network, `validators/${address}`);
  },
  getVotes(network, address) {
    return get(network, `validators/${address}/votes`);
  },
  getDelegators(network, address) {
    return get(network, `validators/${address}/delegators`);
  },

  getStats(network) {
    return get(network, `validators/stats`);
  }
};
