import { ChainId, Token } from '@goosebumps/sdk'
import { SerializedToken } from 'config/constants/types'
import { parseUnits } from 'ethers/lib/utils'

export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
    projectLink: token.projectLink,
  }
}

export function deserializeToken(serializedToken: SerializedToken): Token {
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name,
    serializedToken.projectLink,
  )
}

export const GAS_PRICE = {
  [ChainId.ETHEREUM]: {
    default : '5',
    fast : '6',
    instant : '7',
    testnet : '10'
  },
  [ChainId.POLYGON]: {
    default : '5',
    fast : '6',
    instant : '7',
    testnet : '10'
  },
  [ChainId.MAINNET]: { // TODO prince
    default: "3",
    fast: "5",
    instant: "8",
    testnet: "13",
  },
  [ChainId.TESTNET]: {
    default: "3",
    fast: "5",
    instant: "8",
    testnet: "13",
  }
}

export const GAS_PRICE_GWEI = {
  [ChainId.MAINNET]: {
    default: parseUnits(GAS_PRICE[ChainId.MAINNET].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.MAINNET].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.MAINNET].instant, 'gwei').toString(),
    testnet: parseUnits(GAS_PRICE[ChainId.MAINNET].testnet, 'gwei').toString(),
  },
  [ChainId.TESTNET]: {
    default: parseUnits(GAS_PRICE[ChainId.MAINNET].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.MAINNET].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.MAINNET].instant, 'gwei').toString(),
    testnet: parseUnits(GAS_PRICE[ChainId.MAINNET].testnet, 'gwei').toString(),
  },
  // TODO prince
  [ChainId.ETHEREUM]: {
    default: parseUnits(GAS_PRICE[ChainId.ETHEREUM].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.ETHEREUM].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.ETHEREUM].instant, 'gwei').toString(),
    testnet: parseUnits(GAS_PRICE[ChainId.ETHEREUM].testnet, 'gwei').toString(),
  },
  [ChainId.POLYGON]: {
    default: parseUnits(GAS_PRICE[ChainId.POLYGON].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.POLYGON].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.POLYGON].instant, 'gwei').toString(),
    testnet: parseUnits(GAS_PRICE[ChainId.POLYGON].testnet, 'gwei').toString(),
  }
}
