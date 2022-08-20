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
  1: {
    default : '5',
    fast : '6',
    instant : '7',
    testnet : '10'
  },
  137: {
    default : '5',
    fast : '6',
    instant : '7',
    testnet : '10'
  },
  56: {
    default: "3",
    fast: "5",
    instant: "8",
    testnet: "13",
  },
  97: {
    default: "3",
    fast: "5",
    instant: "8",
    testnet: "13",
  }
}

export const GAS_PRICE_GWEI = {
  56: {
    default: parseUnits(GAS_PRICE[ChainId.MAINNET].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.MAINNET].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.MAINNET].instant, 'gwei').toString(),
    testnet: parseUnits(GAS_PRICE[ChainId.MAINNET].testnet, 'gwei').toString(),
  },
  97: {
    default: parseUnits(GAS_PRICE[ChainId.MAINNET].default, 'gwei').toString(),
    fast: parseUnits(GAS_PRICE[ChainId.MAINNET].fast, 'gwei').toString(),
    instant: parseUnits(GAS_PRICE[ChainId.MAINNET].instant, 'gwei').toString(),
    testnet: parseUnits(GAS_PRICE[ChainId.MAINNET].testnet, 'gwei').toString(),
  }
}
