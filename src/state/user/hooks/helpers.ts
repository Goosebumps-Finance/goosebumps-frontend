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
    default : '6',
    fast : '7',
    instant : '8',
  },
  [ChainId.POLYGON]: {
    default : '25',
    fast : '35',
    instant : '50',
  },
  [ChainId.MAINNET]: {
    default: "5",
    fast: "6",
    instant: "7",
  },
  [ChainId.TESTNET]: {
    default: "10",
    fast: "12",
    instant: "14",
  }
}

export const GAS_PRICE_GWEI = {
  [ChainId.MAINNET]: {
    default: parseUnits(GAS_PRICE[ChainId.MAINNET].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.MAINNET].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.MAINNET].instant, 'gwei').toString(),
  },
  [ChainId.TESTNET]: {
    default: parseUnits(GAS_PRICE[ChainId.TESTNET].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.TESTNET].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.TESTNET].instant, 'gwei').toString(),
  },
  // TODO prince
  [ChainId.ETHEREUM]: {
    default: parseUnits(GAS_PRICE[ChainId.ETHEREUM].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.ETHEREUM].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.ETHEREUM].instant, 'gwei').toString(),
  },
  [ChainId.POLYGON]: {
    default: parseUnits(GAS_PRICE[ChainId.POLYGON].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.POLYGON].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.POLYGON].instant, 'gwei').toString(),
  }
}
