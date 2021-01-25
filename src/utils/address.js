export const shortAddress = (address, num) => {
  if (typeof address === 'string' && address.length <num){
    return address;
  }
  if (num>0){
    return address.slice(0, num) + "...";
  }
  return address.slice(0, 18) + "...";
};

export const shortHash = (hash,num) => {
  if (typeof hash === 'string' && hash.length < num){
    return hash;
  }
  if (num>0){
    return hash.slice(0, num) + "...";
  }
  return hash.slice(0, 18) + "...";
};
