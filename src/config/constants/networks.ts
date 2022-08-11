import { ChainId } from '@goosebumps/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://cryptosnowprince.com:2083/rpc',
  [ChainId.TESTNET]: 'https://cryptosnowprince.com:2083/trpc'
}

export default NETWORK_URLS
