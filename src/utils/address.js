export const shortAddress = (address, num) => {
  if (num>0){
    return address.slice(0, num) + "...";
  }
  return address.slice(0, 18) + "...";
};

export const shortHash = (hash,num) => {
  if (num>0){
    return hash.slice(0, num) + "...";
  }
  return hash.slice(0, 18) + "...";
};
