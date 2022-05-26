import ChainList from "./config.json";

export const chainList = ChainList;

export const getCurrentChain = chainId => {
  console.log('chainId', chainId)
  const chain = chainList.find(c => c.chainId === chainId);
  if (!chain) {
    return alert(`invalid chainId: ${chainId}`);
  }
  return chain;
};
