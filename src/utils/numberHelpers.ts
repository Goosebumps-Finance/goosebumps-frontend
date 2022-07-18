export const calculatePricescale = (price, plus = 4) => {
  const match = price
    .toFixed(14)
    .toString()
    .match(/^0.[0]+/)
  if (match) {
    return match[0].length + plus - 2
  }
  return plus
}

export const calculatePricescaleNew = (price) => {
  return price
}

export const calculateTokenscale = (price) => {
  let pricescale = 3 - calculatePricescale(price, 0)
  if (pricescale <= 0) {
    pricescale = 0
  }

  return pricescale
}
