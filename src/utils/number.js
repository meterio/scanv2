import BigNumber from 'bignumber.js';

const UNIT_WEI = 1e18;
export const commaSeparated = (x /* number|string*/) => {
  const tgt = x.toString();
  const items = tgt.split('.');
  return items[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (items.length >= 2 ? '.' + items[1] : '');
};

export const formatNum = (val /* number|string|BigNumber */, precision = -1) => {
  let p = undefined;
  if (precision >= 0) {
    p = precision;
  }
  const num = new BigNumber(val).toFixed(p);
  return commaSeparated(num);
};

export const numFilter = val => {
  return formatNum(val, 2);
};

export const fromWei = (val /* number|string|BigNumber */, precision = -1, symbol = '', decimals = 18) => {
  let p = undefined;
  if (precision >= 0) {
    p = precision;
  }
  const num = new BigNumber(val).dividedBy('1' + '0'.repeat(decimals)).toFixed(p);
  const numStr = commaSeparated(num);
  if (symbol !== '') {
    return numStr + ' ' + symbol;
  }
  return numStr;
};

export const toWei = (val /* string | number | BigNumber*/) => {
  return new BigNumber(val).times(UNIT_WEI).toFixed();
};

export const bigNumMinus = (a, b) => {
  return new BigNumber(a).minus(b).toFixed();
};

export const bigNumDiv = (a, b) => {
  return new BigNumber(a).dividedBy(b).toFixed();
};

export const bigNumCompare = (a, b) => {
  return new BigNumber(a).isLessThan(b) ? -1 : 1;
};

export const bigNum = (a, precision = undefined) => {
  if (typeof precision === 'undefined') {
    return new BigNumber(a).toFixed();
  }
  if (typeof precision === 'number') {
    return new BigNumber(a).toFixed(precision);
  }
  return '';
};

export const formatHashrate = hr => {
  let numStr = '';
  if (typeof hr === 'number') {
    numStr = hr.toFixed(0);
  }
  if (typeof hr === 'string') {
    numStr = hr.split('.')[0];
  }

  if (numStr.length > 15) {
    return new BigNumber(numStr).div(1e15).toFixed(2) + ' PH/s';
  } else if (numStr.length > 12) {
    return new BigNumber(numStr).div(1e12).toFixed(2) + ' TH/s';
  } else if (numStr.length > 9) {
    return new BigNumber(numStr).div(1e9).toFixed(2) + ' GH/s';
  } else if (numStr.length > 6) {
    return new BigNumber(numStr).div(1e6).toFixed(2) + ' MH/s';
  } else if (numStr.length > 3) {
    return new BigNumber(numStr).div(1e3).toFixed(2) + ' KH/s';
  } else {
    return numStr + ' H/s';
  }
};
