import moment from 'moment/src/moment';
import time from '@/config/datetime';

export const fromNow = (timestamp) => {
  const diff = moment().diff(timestamp, 'seconds');
  if (diff < 0) {
    return moment(timestamp).fromNow();
  }
  if (diff < 60) {
    return `${diff} seconds ago`;
  }
  return moment(timestamp).fromNow();
};

export const formatTime = (timestamp) => {
  return moment(timestamp).format(time.FORMAT_DATETIME);
};

export const formatEtherscanTime = (timestamp) => {
  return moment(timestamp).format(time.FORMAT_ETHERSCAN_DATETIME);
};

export const formatDuration = (duration) => {
  if (duration <= 3600 * 1000) {
    return moment.utc(moment.duration(duration).asMilliseconds()).format('m[m]');
  }
  return moment.utc(moment.duration(duration).asMilliseconds()).format('H[h]m[m]');
};
