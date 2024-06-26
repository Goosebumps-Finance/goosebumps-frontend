import { ChainId } from '@goosebumps/zx-sdk'

export default function isSupportedChainId(chainId: number) {
  // return (chainId === ChainId.MAINNET || chainId === ChainId.TESTNET || chainId === ChainId.ETHEREUM || chainId === ChainId.POLYGON)
  return (chainId === ChainId.MAINNET || chainId === ChainId.TESTNET)
}
