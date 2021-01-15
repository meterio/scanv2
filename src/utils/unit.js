import BigNumber from 'bignumber.js';
const UNIT_WEI = 1e18;

export const fromWei = (val /*string | number | BigNumber*/, precision=-1) => {
    let p = undefined;
    if (precision>0){
        p = precision;
    }
    return new BigNumber(val).dividedBy(UNIT_WEI).toFixed(p);
  };
  
export const toWei = (val /* string | number | BigNumber*/) => {
    return new BigNumber(val).times(UNIT_WEI).toFixed();
};
