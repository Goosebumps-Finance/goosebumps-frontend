import { ethers } from 'ethers'
import getRpcUrl from 'utils/getRpcUrl'

const RPC_URL = getRpcUrl(97)

export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(RPC_URL)

export const getSimpleRpcProvider = (chainId) => {
    const rpcUrl = getRpcUrl(chainId ?? 97)
    return new ethers.providers.StaticJsonRpcProvider(rpcUrl, "any")
}

export default null
