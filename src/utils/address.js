export const shortAddress = (address, num) => {
  return shortStr(address, num || 8);
};

export const shortHash = (hash, num) => {
  return shortStr(hash, num || 18);
};

export const shortName = (hash) => {
  return shortStr(hash, 10);
};

export const shortStr = (hash, num) => {
  if (typeof hash === 'string' && hash.length < num) {
    return hash;
  }
  if (!num || num <= 0) {
    num = 18;
  }
  if (hash.length <= num) {
    return hash;
  }
  return hash.slice(0, num) + '...';
};

export const randomHex = () => {
  return ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
};
