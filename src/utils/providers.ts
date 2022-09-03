import { ethers } from 'ethers'
// import { ChainId } from '@goosebumps/zx-sdk'
import getRpcUrl from 'utils/getRpcUrl'

// const RPC_URL = getRpcUrl(ChainId.MAINNET)

// export const simpleRpcProvider = new ethers.providers.StaticJsonRpcProvider(RPC_URL)

export const getSimpleRpcProvider = (chainId) => {
    return new ethers.providers.StaticJsonRpcProvider(getRpcUrl(chainId), chainId)
}

export default null
