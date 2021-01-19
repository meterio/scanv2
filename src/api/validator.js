import { get } from "@/utils/http";

const validateTypeUrl = {
  Delegates: "validators/delegate",
  Candidates: "validators/candidate",
  Jailed: "validators/jailed"
};

export default {
  getValidateTypeList(page, limit, type, searchName) {
    return get(
      validateTypeUrl[type] +
        `?page=${page}&limit=${limit}&search=${searchName}`
    );
  },
  getValidateReward(page, limit) {
    return get(`validators/rewards?page=${page}&limit=${limit}`);
  },
  getRewardsByEpoch(epoch) {
    return get(`validators/rewards/${epoch}`);
  },
  getValidator(address){
    return get(`validators/${address}`);
  },
  getVotes(address){
    return get(`validators/${address}/votes`);
  },
  getDelegators(address){
    return get(`validators/${address}/delegators`);
  }
};
