import { ChainId } from '@goosebumps/sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.ETHEREUM]: 'https://mainnet.infura.io/v3/687f55defdfe416faa0b388c1332727c',
  [ChainId.POLYGON]: 'https://matic-mainnet-archive-rpc.bwarelabs.com',
  [ChainId.MAINNET]: 'https://cryptosnowprince.com:2083/rpc',
  [ChainId.TESTNET]: 'https://cryptosnowprince.com:2083/trpc'
}

export default NETWORK_URLS
