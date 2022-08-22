import { ChainId } from '@goosebumps/sdk'

export const getChainId = (): number => {
  const chainId = parseInt(window.localStorage.getItem("SELECTED_CHAIN_ID"), 10)
  if (Number.isNaN(chainId)) {
    return ChainId.MAINNET
  }
  return chainId
}
