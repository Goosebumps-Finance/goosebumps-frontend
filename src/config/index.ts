import { ChainId } from '@goosebumps/zx-sdk'
import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'
import { getChainId } from 'utils/getChainId'
import dotenv from 'dotenv'

dotenv.config()

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 3

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
  [ChainId.ETHEREUM]: 'https://etherscan.io',
  [ChainId.POLYGON]: 'https://polygonscan.com'
}

// CAKE_PER_BLOCK details
// 40 CAKE is minted per block
// 20 CAKE per block is sent to Burn pool (A farm just for burning cake)
// 10 CAKE per block goes to CAKE syrup pool
// 9 CAKE per block goes to Yield farms and lottery
// CAKE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// CAKE/Block in src/views/Home/components/CakeDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const CAKE_PER_BLOCK = 40
export const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365 // 10512000
export const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = process.env.REACT_APP_PUBLIC_URL
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/liquidityAdd`
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[getChainId()]
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 200000
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
// In reality its 10000 because of fast refresh, a bit less here to cover for possible long request times
export const PANCAKE_BUNNIES_UPDATE_FREQUENCY = 8000

export const DEBUG_MODE = false

function EMPTY(param1: any, param2: any, ...param3: any[]) {
  return true;
}

export const LOG_VIEW = DEBUG_MODE ? console.log : EMPTY

export const API_SERVER = process.env.REACT_APP_API_SERVER

export const MAINNET_RPC = process.env.REACT_APP_MAINNET_RPC_URL
export const TESTNET_RPC = process.env.REACT_APP_TESTNET_RPC_URL
export const ETHEREUM_RPC = process.env.REACT_APP_ETHEREUM_RPC_URL
export const POLYGON_RPC = process.env.REACT_APP_POLYGON_RPC_URL

export const SWAP_FEE_0X = parseInt(process.env.REACT_APP_SWAP_FEE_0X)
