import { ChainId } from '@goosebumps/zx-sdk'
import isSupportedChainId from './isSupportedChainId'

export const getChainId = (): number => {
  try {
    const chainId = parseInt(window.localStorage.getItem("SELECTED_CHAIN_ID"), 10)
    if (
      Number.isNaN(chainId) || !isSupportedChainId(chainId)
    ) {
      return ChainId.MAINNET
    }
    return chainId
  } catch (error) {
    // console.log("getChainId error", error)
    return ChainId.MAINNET
  }
}
