import { ethers } from 'ethers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl(97)

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(RPC_URL)

export const getSimpleRpcProvider = (chainId) => {
    return new ethers.providers.StaticJsonRpcProvider(getRpcUrl(chainId), "any")
}

export default null
