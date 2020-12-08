export const shortAddress = address => {
  return address.slice(0, 7) + "..." + address.slice(-5);
};

export const shortHash = hash=>{
  return hash.slice(0,9)+"..." + hash.slice(-8);
}