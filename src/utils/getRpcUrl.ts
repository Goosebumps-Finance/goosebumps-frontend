import sample from 'lodash/sample'
import linq from 'linq'
import networks from 'config/constants/networks.json'
import { ChainIdStorageName } from 'config/constants'
import { ChainId } from '@goosebumps/sdk'

if (
  process.env.NODE_ENV !== 'production' &&
  (!process.env.REACT_APP_NODE_1 || !process.env.REACT_APP_NODE_2 || !process.env.REACT_APP_NODE_3)
) {
  throw Error('One base RPC URL is undefined')
}

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_NODE_1, process.env.REACT_APP_NODE_2, process.env.REACT_APP_NODE_3]

const getNodeUrl = (chainId = 97) => {
  // Use custom node if available (both for development and production)
  // However on the testnet it wouldn't work, so if on testnet - comment out the REACT_APP_NODE_PRODUCTION from env file
  // if (process.env.REACT_APP_NODE_PRODUCTION) {
  //   return process.env.REACT_APP_NODE_PRODUCTION
  // }
  // return sample(nodes)
  // const chainId = parseInt(window.localStorage.getItem(ChainIdStorageName), 10)
  if (chainId === ChainId.MAINNET) {
    return getBscNodeUrl()
  }
  if(chainId === 1) { // ChainId.ETH_MAIN) 
    return getEthNodeUrl()
  }
  if(chainId === 137) { // ChainId.POLYGON_MAIN) 
    return getPolygonNodeUrl()
  }
  return getBscTestnetNodeUrl()
}

export const getEthNodeUrl = () => {
  // const ethNodes = ["https://rpc.ankr.com/eth", "https://eth-mainnet.public.blastapi.io"];
  const ethNetwork = linq.from(networks).where((x) => x.Name === "ethereum").single()
  const ethNodes = [ethNetwork.RPC]
  return sample(ethNodes)
}

export const getPolygonNodeUrl = () => {
  const polyNetwork = linq.from(networks).where((x) => x.Name === "polygon").single()
  const polyNodes = [polyNetwork.RPC]
  return sample(polyNodes)
}

export const getBscNodeUrl = () => {
  const bscNetwork = linq.from(networks).where((x) => x.Name === "bsc").single()
  const bscNodes = [bscNetwork.RPC]
  return sample(bscNodes)
}

export const getBscTestnetNodeUrl = () => {
  const testNetwork = linq.from(networks).where((x) => x.Name === "bsctestnet").single()
  const testNodes = [testNetwork.RPC]
  return sample(testNodes)
}

export default getNodeUrl
