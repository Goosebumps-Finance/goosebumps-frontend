import { ChainId } from '@goosebumps/sdk'
import { ChainIdStorageName } from 'config/constants'
import store from 'state'
import { GAS_PRICE_GWEI } from 'state/user/hooks/helpers'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = (): string => {
  // const chainId = process.env.REACT_APP_CHAIN_ID
  let chainId = parseInt(window.localStorage.getItem(ChainIdStorageName), 10)
  if(Number.isNaN(chainId)) chainId = 56
  const state = store.getState()
  const userGas = state.user.gasPrice || GAS_PRICE_GWEI.default
  return chainId === ChainId.MAINNET ? userGas : GAS_PRICE_GWEI.testnet
}

export default getGasPrice
