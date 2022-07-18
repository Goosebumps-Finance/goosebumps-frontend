export const variants = {
  CONNECT_FROM: 'from',
  TRANSFER_TO: 'to',
  TOKEN: 'token',
}

export const titles = {
  from: 'Wallet Connected from',
  to: 'Transferring to',
  token: 'Token',
}

export const BRIDGE = {
  ETHEREUM: 'ethereum',
  BSC: 'bsc',
  POLYGON: 'polygon',
}

export type Variant = typeof variants[keyof typeof variants]
