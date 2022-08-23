import { ChainId } from '@goosebumps/sdk'
import store from 'state'
import { GAS_PRICE_GWEI } from 'state/user/hooks/helpers'
import { getChainId } from './getChainId'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = (): string => {
  const state = store.getState()
  return state.user.gasPrice || GAS_PRICE_GWEI[getChainId()].default
  // const userGas = state.user.gasPrice || GAS_PRICE_GWEI[getChainId()].default
  // return getChainId() === ChainId.MAINNET ? userGas : GAS_PRICE_GWEI[ChainId.MAINNET].testnet
}

export default getGasPrice
