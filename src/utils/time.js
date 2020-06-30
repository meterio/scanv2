import moment from "moment";

export const fromNow = timestamp => {
  return moment(timestamp).fromNow();
};
