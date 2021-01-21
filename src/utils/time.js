import moment from "moment";
import time from "@/config/datetime";

export const fromNow = timestamp => {
  const diff = moment().diff(timestamp, "seconds");
  if (diff < 60) {
    return `${diff} seconds ago`;
  }
  return moment(timestamp).fromNow();
};

export const formatTime = timestamp => {
  return moment(timestamp).format(time.FORMAT_DATETIME);
};
