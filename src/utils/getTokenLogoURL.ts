import { getChainId } from "./getChainId"
import { BASE_URL } from "config"

const getTokenLogoURL = (address: string) => {
  // const defaultTokenAddrs = ['0x293C3Ee9ABaCb08BB8ceD107987F00EfD1539288', '0xE7C6D00B5314EE2651Df6E18e84d6d6dF0EA96a6']
  // if(defaultTokenAddrs.includes(address)) 
  //   return  `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${defaultTokenAddrs[0]}/logo.png`
  // return  `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`
  return `${BASE_URL}/images/tokens/${getChainId()}/${address}.png`
}

export default getTokenLogoURL
