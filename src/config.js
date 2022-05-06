export const chainList = [
  {
    name: 'Meter Mainnet',
    title: 'Meter',
    chainId: 82,
    symbol: 'MTR',
    gSymbol: 'MTRG',
    // apiBase: 'http://builder.meter.io:3000/api/',
    apiBase: 'https://api.meter.io:12001/api/',
    sourcifyApiBase: 'https://sourcify.dev/server',
    deployDomain: 'scan.meter.io',
    pow: true,
    priceEnable: true,
    nftImageUrlBase: 'https://meter-nft-image.s3.ap-northeast-1.amazonaws.com/'
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
    priceEnable: true,
    nftImageUrlBase: 'https://meter-nft-image.s3.ap-northeast-1.amazonaws.com/'
  },
  {
    name: 'Verse Testnet',
    chainId: 72,
    title: 'Verse',
    symbol: 'STPT',
    gSymbol: 'STPD',
    apiBase: 'https://api0-testnet.stp.network/api/',
    sourcifyApiBase: 'https://sourcify.dev/server',
    deployDomain: 'testexplorer.stp.network',
    pow: false,
    priceEnable: false,
    nftImageUrlBase: 'https://meter-nft-image.s3.ap-northeast-1.amazonaws.com/'
  }
];

export const getCurrentChain = chainId => {
  const chain = chainList.find(c => c.chainId === chainId);
  if (!chain) {
    return alert('invalid chainId: ', chainId);
  }
  return chain;
};
