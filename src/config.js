export const chainList = [
  {
    name: 'Meter Mainnet',
    title: 'Meter',
    chainId: 82,
    symbol: 'MTR',
    gSymbol: 'MTRG',
    apiBase: 'http://builder.meter.io:3000/api/',
    // apiBase: 'https://api.meter.io:8000/api/',
    sourcifyApiBase: 'https://sourcify.dev/server',
    deployDomain: 'scan.meter.io',
    pow: true,
    priceEnable: true
  },
  {
    name: 'Meter Testnet',
    chainId: 83,
    title: 'Meter',
    symbol: 'MTR',
    gSymbol: 'MTRG',
    apiBase: 'https://api.meter.io:13001/api/',
    sourcifyApiBase: 'https://sourcify.dev/server',
    deployDomain: 'scan-warringstakes.meter.io',
    pow: true,
    priceEnable: true
  },
  {
    name: 'Verse Testnet',
    chainId: 72,
    title: 'Verse',
    symbol: 'STPT',
    gSymbol: 'STPD',
    apiBase: 'http://18.142.50.83:3000/api/',
    sourcifyApiBase: 'https://sourcify.dev/server',
    // deployDomain: 'explorer.stp.network',
    deployDomain: 'http://18.142.50.83',
    pow: false,
    priceEnable: false
  }
];

export const getCurrentChain = chainId => {
  const chain = chainList.find(c => c.chainId === chainId);
  if (!chain) {
    return alert('invalid chainId: ', chainId);
  }
  return chain;
};
