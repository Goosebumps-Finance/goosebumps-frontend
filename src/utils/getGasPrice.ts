import { ChainId } from '@goosebumps/sdk'
import store from 'state'
import { getChainId } from 'utils/getChainId'
import { GAS_PRICE_GWEI } from 'state/user/hooks/helpers'

/**
 * Function to return gasPrice outwith a react component
 */
const getGasPrice = (): string => {
  const state = store.getState()
  const userGas = state.user.gasPrice || GAS_PRICE_GWEI[ChainId.MAINNET].default
  return getChainId() === ChainId.MAINNET ? userGas : GAS_PRICE_GWEI[ChainId.MAINNET].testnet
}

export default getGasPrice
