export const chainList = [
  {
    name: "Meter Mainnet",
    title: "Meter",
    chainId: 82,
    symbol: "MTR",
    apiBase: "https://api.meter.io:12001/api/",
    sourcifyApiBase: "https://sourcify.dev/server",
    deployDomain: "scan.meter.io",
  },
  {
    name: "Meter testnet",
    chainId: 83,
    title: "Meter",
    symbol: "MTR",
    apiBase: "https://api.meter.io:12001/api/",
    sourcifyApiBase: "https://sourcify.dev/server",
    deployDomain: "scan-warringstakes.meter.io",
  }
];

export const getCurrentChain = (chainId) => {
  const chain = chainList.find(c => c.chainId === chainId);
  if (!chain) {
    return alert('invalid chainId: ', chainId);
  }
  return chain;
}
