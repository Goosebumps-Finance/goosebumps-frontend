import { ChainId, JSBI, Percent, Token } from '@goosebumps/zx-sdk'
// import { ethTokens, mainnetTokens, polygonTokens, testnetTokens } from './tokens'
import { mainnetTokens, testnetTokens } from './tokens'
import { Address } from './types'

// change router address according to the chainid
// export const ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E'
// export const ROUTER_ADDRESS = '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3'
export const ROUTER_ADDRESS: Address = {
  [ChainId.MAINNET]: "0x0A630CB0C793b00A61b2941663bD17fC1ca123a2",
  [ChainId.TESTNET]: "0xd86D8f65384D4EeA2b4440acc0C4C03048106e58",
  [ChainId.POLYGON]: "0xd86D8f65384D4EeA2b4440acc0C4C03048106e58", // TODO prince
  [ChainId.ETHEREUM]: "0xd86D8f65384D4EeA2b4440acc0C4C03048106e58" // TODO prince
}

// export const BASE_INIT_CODE_HASH = "0xfd7c21b4931ba4a1259e12228dbe60d2ea8adbf05782d6ba03569e6e0f2cd961";
export const BASE_INIT_CODE_HASH: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: "0x2f99e4e5d90ec174df09a4e89fcfd61ab68cd5c396b9c26f95cf6ec2a7b44712",
  [ChainId.TESTNET]: "0xfd7c21b4931ba4a1259e12228dbe60d2ea8adbf05782d6ba03569e6e0f2cd961",
  [ChainId.ETHEREUM]: "0xfd7c21b4931ba4a1259e12228dbe60d2ea8adbf05782d6ba03569e6e0f2cd961", // TODO prince
  [ChainId.POLYGON]: "0xfd7c21b4931ba4a1259e12228dbe60d2ea8adbf05782d6ba03569e6e0f2cd961", // TODO prince
}

export const BASE_FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: "0x520DC5a79C671E93DD09e488Ef8E8f9c4c7Af534",
  [ChainId.TESTNET]: "0x0Cd5205550BF38cC6Bb72E4A73373E04Fc35FD44",
  [ChainId.ETHEREUM]: "0x30cc30Ee699a7390EA887E15Bb90b3668D4308Ec", // TODO prince
  [ChainId.POLYGON]: "0x30cc30Ee699a7390EA887E15Bb90b3668D4308Ec", // TODO prince
}

const PANCAKESWAP_MAINNET_FACTORY_ADDRESS = "0xca143ce32fe78f1f7019d7d551a6402fc5350c73"
const PANCAKESWAP_TESTNET_FACTORY_ADDRESS = "0xB7926C0430Afb07AA7DEfDE6DA862aE0Bde767bc"
const UNISWAP_V2_FACTORY_ADDRESS = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"
const QUICKSWAP_FACTORY_ADDRESS = "0x5757371414417b8c6caad45baef941abc7d3ab32"

const PANCAKESWAP_MAINNET_FACTORY_INIT_CODE_HASH = "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5"
const PANCAKESWAP_TESTNET_FACTORY_INIT_CODE_HASH = "0xecba335299a6693cb2ebc4782e74669b84290b6378ea3a3873c7231a8d7d1074"
const UNISWAP_V2_FACTORY_INIT_CODE_HASH = ""
const QUICKSWAP_FACTORY_INIT_CODE_HASH = ""

export const FACTORY_ADDRESSES: { [chainId in ChainId]: { [key: string]: string } } = {
  [ChainId.MAINNET]: {
    [BASE_FACTORY_ADDRESS[ChainId.MAINNET]]: BASE_INIT_CODE_HASH[ChainId.MAINNET],
    [PANCAKESWAP_MAINNET_FACTORY_ADDRESS]: PANCAKESWAP_MAINNET_FACTORY_INIT_CODE_HASH
  },
  [ChainId.TESTNET]: {
    [BASE_FACTORY_ADDRESS[ChainId.TESTNET]]: BASE_INIT_CODE_HASH[ChainId.TESTNET],
    [PANCAKESWAP_TESTNET_FACTORY_ADDRESS]: PANCAKESWAP_TESTNET_FACTORY_INIT_CODE_HASH
  },
  [ChainId.ETHEREUM]: {
    [BASE_FACTORY_ADDRESS[ChainId.ETHEREUM]]: BASE_INIT_CODE_HASH[ChainId.ETHEREUM],
    [UNISWAP_V2_FACTORY_ADDRESS]: UNISWAP_V2_FACTORY_INIT_CODE_HASH
  },
  [ChainId.POLYGON]: {
    [BASE_FACTORY_ADDRESS[ChainId.POLYGON]]: BASE_INIT_CODE_HASH[ChainId.POLYGON],
    [QUICKSWAP_FACTORY_ADDRESS]: QUICKSWAP_FACTORY_INIT_CODE_HASH
  },
}

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [], // [ethTokens.weth] TODO prince
  [ChainId.POLYGON]: [], // [polygonTokens.wmatic] TODO prince
  [ChainId.MAINNET]: [
    mainnetTokens.wbnb,
    mainnetTokens.cake,
    mainnetTokens.busd,
    mainnetTokens.usdt,
    mainnetTokens.btcb,
    mainnetTokens.eth,
    mainnetTokens.usdc,
  ],
  [ChainId.TESTNET]: [testnetTokens.wbnb, testnetTokens.cake, testnetTokens.busd],
  // [ChainId.ETH_MAIN] : [ethTokens.weth],
  // [ChainId.POLYGON_MAIN] : [polygonTokens.wmatic]
}

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [], // [ethTokens.weth] TODO prince
  [ChainId.POLYGON]: [], // [polygonTokens.wmatic] TODO prince
  [ChainId.MAINNET]: [mainnetTokens.busd, mainnetTokens.empire, mainnetTokens.btcb],
  [ChainId.TESTNET]: [testnetTokens.wbnb, testnetTokens.empire, testnetTokens.busd],
  // [ChainId.ETH_MAIN]: [ethTokens.weth],
  // [ChainId.POLYGON_MAIN]: [polygonTokens.wmatic]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [], // [ethTokens.weth] TODO prince
  [ChainId.POLYGON]: [], // [polygonTokens.wmatic] TODO prince
  [ChainId.MAINNET]: [mainnetTokens.wbnb, mainnetTokens.dai, mainnetTokens.busd, mainnetTokens.usdt],
  [ChainId.TESTNET]: [testnetTokens.wbnb, testnetTokens.cake, testnetTokens.busd],
  // [ChainId.ETH_MAIN]: [ethTokens.weth],
  // [ChainId.POLYGON_MAIN]: [polygonTokens.wmatic]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [mainnetTokens.empire, mainnetTokens.wbnb],
    [mainnetTokens.empire, mainnetTokens.busd],
    [mainnetTokens.busd, mainnetTokens.wbnb],
    [mainnetTokens.cake, mainnetTokens.wbnb],
    [mainnetTokens.busd, mainnetTokens.usdt],
    [mainnetTokens.dai, mainnetTokens.usdt],
  ],
  [ChainId.TESTNET]: [
    [testnetTokens.empire, testnetTokens.wbnb],
    [testnetTokens.empire, testnetTokens.busd],
    [testnetTokens.busd, testnetTokens.wbnb],
  ],
  [ChainId.ETHEREUM]: [
    // [testnetTokens.empire, testnetTokens.wbnb],
    // [testnetTokens.empire, testnetTokens.busd],
    // [testnetTokens.busd, testnetTokens.wbnb],
  ],
  [ChainId.POLYGON]: [
    // [testnetTokens.empire, testnetTokens.wbnb],
    // [testnetTokens.empire, testnetTokens.busd],
    // [testnetTokens.busd, testnetTokens.wbnb],
  ],
  // [ChainId.ETH_MAIN]:[
  //   [ethTokens.weth, ethTokens.uni]
  // ],
  // [ChainId.POLYGON_MAIN]: [
  //   [polygonTokens.wmatic, polygonTokens.aave]
  // ]
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
  '0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C',
]

export { default as farmsConfig } from './farms'
export { default as poolsConfig } from './pools'
export { default as ifosConfig } from './ifo'
