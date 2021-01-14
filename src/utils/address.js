export const shortAddress = address => {
  return address.slice(0, 7) + "..." + address.slice(-5);
};

export const shortHash = hash => {
  return hash.slice(0, 9) + "..." + hash.slice(-8);
};

export const shortMTR = mtr => {
  const arr = mtr.split(" ");
  return Number(arr[0]).toFixed(3) + " " + arr[1];
};
