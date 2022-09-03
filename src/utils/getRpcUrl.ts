// import sample from 'lodash/sample'
// import linq from 'linq'
// import networks from 'config/constants/networks'
import { NETWORK_URLS } from 'config/constants/networks'
import { ChainId } from '@goosebumps/zx-sdk'
// import { getChainId } from './getChainId'

if (
  process.env.NODE_ENV !== 'production' &&
  (!process.env.REACT_APP_NODE_1 || !process.env.REACT_APP_NODE_2 || !process.env.REACT_APP_NODE_3)
) {
  throw Error('One base RPC URL is undefined')
}

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]

const getNodeUrl = (chainId = ChainId.MAINNET) => {
  // Use custom node if available (both for development and production)
  // However on the testnet it wouldn't work, so if on testnet - comment out the REACT_APP_NODE_PRODUCTION from env file
  // if (process.env.REACT_APP_NODE_PRODUCTION) {
  //   return process.env.REACT_APP_NODE_PRODUCTION
  // }
  // return sample(nodes)
  // const chainId = getChainId()
  switch (chainId) {
    case ChainId.MAINNET:
      return getBscNodeUrl()
    case ChainId.TESTNET:
      return getBscTestnetNodeUrl()
    // case ChainId.ETHEREUM:
    //   return getEthNodeUrl()
    // case ChainId.POLYGON:
    //   return getPolygonNodeUrl()
    default:
      return getBscNodeUrl()
  }
}

export const getEthNodeUrl = () => {
  // const ethNodes = ["https://rpc.ankr.com/eth", "https://eth-mainnet.public.blastapi.io"];
  // const ethNetwork = linq.from(networks).where((x) => x.Name === "ethereum").single()
  // const ethNodes = [ethNetwork.RPC]
  // return sample(ethNodes)
  return NETWORK_URLS[ChainId.ETHEREUM]
}

export const getPolygonNodeUrl = () => {
  // const polyNetwork = linq.from(networks).where((x) => x.Name === "matic").single()
  // const polyNodes = [polyNetwork.RPC]
  // return sample(polyNodes)
  return NETWORK_URLS[ChainId.POLYGON]
}

export const getBscNodeUrl = () => {
  // const bscNetwork = linq.from(networks).where((x) => x.Name === "bsc").single()
  // const bscNodes = [bscNetwork.RPC]
  // return sample(bscNodes)
  return NETWORK_URLS[ChainId.MAINNET]
}

export const getBscTestnetNodeUrl = () => {
  // const testNetwork = linq.from(networks).where((x) => x.Name === "bsc_testnet").single()
  // const testNodes = [testNetwork.RPC]
  // return sample(testNodes)
  return NETWORK_URLS[ChainId.TESTNET]
}

export default getNodeUrl
