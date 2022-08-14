const pad = (num: string | number, size = 2) => {
  const numAsString = num.toString();

  if (size <= 0) return numAsString;

  const isNegative = numAsString.startsWith('-');

  const toBePaddedNumber = isNegative ? numAsString.slice(1) : numAsString;

  let _toBePaddedNumber = toBePaddedNumber;

  while (_toBePaddedNumber.length < size) _toBePaddedNumber = '0' + _toBePaddedNumber;

  return isNegative ? '-' + _toBePaddedNumber : _toBePaddedNumber;
};

const trimZeroes = (number: string | number) => {
  if (typeof number === 'number') return +number;

  return number.replace(/^0+/g, '').replace(/(?<=^-)0+/g, '');
};

export const NumberUtils = {
  pad,
  trimZeroes,
};
