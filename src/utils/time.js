import moment from "moment";
import time from "@/config/datetime"

export const fromNow = timestamp => {
  return moment(timestamp).fromNow();
};

export const formatTime = timestamp=>{
  return moment(timestamp).format(time.FORMAT_DATETIME);
}
