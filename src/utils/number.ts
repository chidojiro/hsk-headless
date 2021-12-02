const pad = (num: string | number, size = 2) => {
  let _num = num.toString()

  while (_num.length < size) _num = '0' + _num

  return _num
}

const NumberUtils = {
  pad
}

export default NumberUtils
