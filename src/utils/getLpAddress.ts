import { Token, Pair, ChainId } from '@goosebumps/zx-sdk'
import { isAddress } from 'utils'
// import { BASE_FACTORY_ADDRESS, BASE_INIT_CODE_HASH } from 'config/constants'
import { getChainId } from './getChainId'

const getLpAddress = (token1: string | Token, token2: string | Token) => {
  let token1AsTokenInstance = token1
  let token2AsTokenInstance = token2
  if (!token1 || !token2) {
    return null
  }
  if (typeof token1 === 'string' || token1 instanceof String) {
    const checksummedToken1Address = isAddress(token1)
    if (!checksummedToken1Address) {
      return null
    }
    token1AsTokenInstance = new Token(getChainId(), checksummedToken1Address, 18)
  }
  if (typeof token2 === 'string' || token2 instanceof String) {
    const checksummedToken2Address = isAddress(token2)
    if (!checksummedToken2Address) {
      return null
    }
    token2AsTokenInstance = new Token(getChainId(), checksummedToken2Address, 18)
  }
  // return Pair.getAddress(BASE_FACTORY_ADDRESS[getChainId()], BASE_INIT_CODE_HASH[getChainId()], token1AsTokenInstance as Token, token2AsTokenInstance as Token)
  return Pair.getAddress(token1AsTokenInstance as Token, token2AsTokenInstance as Token)
}

export default getLpAddress
