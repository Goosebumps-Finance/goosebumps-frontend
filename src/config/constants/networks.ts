import { ChainId } from '@goosebumps/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://cryptosnowprince.com:2083/rpc',
  [ChainId.TESTNET]: 'https://data-seed-prebsc-2-s2.binance.org:8545'
}

export default NETWORK_URLS
