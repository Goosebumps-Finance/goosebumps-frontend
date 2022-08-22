import { ChainId } from '@goosebumps/sdk'

export const getChainId = (): number => {
  try {
    const chainId = parseInt(window.localStorage.getItem("SELECTED_CHAIN_ID"), 10)
    if (
      Number.isNaN(chainId) ||
      (chainId !== ChainId.ETHEREUM && chainId !== ChainId.MAINNET && chainId !== ChainId.POLYGON && chainId !== ChainId.TESTNET)
    ) {
      return ChainId.MAINNET
    }
    return chainId
  } catch (error) {
    console.log("getChainId error", error)
    return ChainId.MAINNET
  }
}
