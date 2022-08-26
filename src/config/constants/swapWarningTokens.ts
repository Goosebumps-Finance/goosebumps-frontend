import { Token } from '@goosebumps/sdk'
import { getChainId } from 'utils/getChainId'
import tokens from 'config/constants/tokens'

const { bondly, safemoon } = tokens(getChainId())

interface WarningTokenList {
  [key: string]: Token
}

const SwapWarningTokens = <WarningTokenList>{
  safemoon,
  bondly,
}

export default SwapWarningTokens
