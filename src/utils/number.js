import BigNumber from "bignumber.js";

const UNIT_WEI = 1e18;
export const commaSeparated = (x /* number|string*/) => {
  const tgt = x.toString();
  const items = tgt.split(".");
  return (
    items[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (items.length >= 2 ? "." + items[1] : "")
  );
};

export const formatNum = (
  val /* number|string|BigNumber */,
  precision = -1
) => {
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

export const fromWei = (
  val /* number|string|BigNumber */,
  precision = -1,
  symbol = ""
) => {
  let p = undefined;
  if (precision >= 0) {
    p = precision;
  }
  const num = new BigNumber(val).dividedBy(UNIT_WEI).toFixed(p);
  const numStr = commaSeparated(num);
  if (symbol !== "") {
    return numStr + " " + symbol;
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
  if (typeof precision === "undefined") {
    return new BigNumber(a).toFixed();
  }
  if (typeof precision === "number") {
    return new BigNumber(a).toFixed(precision);
  }
  return "";
};
