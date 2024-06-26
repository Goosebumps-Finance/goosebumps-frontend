// Set of helper functions to facilitate wallet setup

import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import { getChainId } from 'utils/getChainId'
import { METAMASK_MAX_TOKEN_SYMBOL_LENGTH } from 'utils'
// import { nodes } from './getRpcUrl'

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
// export const setupNetwork = async () => {
//   const provider = window.ethereum
//   if (provider) {
//     const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
//     try {
//       await provider.request({
//         method: 'wallet_addEthereumChain',
//         params: [
//           {
//             chainId: `0x${chainId.toString(16)}`,
//             chainName: 'Binance Smart Chain Mainnet',
//             nativeCurrency: {
//               name: 'BNB',
//               symbol: 'bnb',
//               decimals: 18,
//             },
//             rpcUrls: nodes,
//             blockExplorerUrls: [`${BASE_BSC_SCAN_URL}/`],
//           },
//         ],
//       })
//       return true
//     } catch (error) {
//       console.error('Failed to setup the network in Metamask:', error)
//       return false
//     }
//   } else {
//     console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
//     return false
//   }
// }
export const setupNetwork = async (network) => {
  const provider = window.ethereum
  if (provider) {
    // const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{
          chainId: network.chainHexId
        }]
      })
      return true
    } catch (error: any) {
      if (error.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: network.chainHexId,
              chainName: network.Display,
              nativeCurrency: {
                name: network.Currency.Name,
                symbol: network.Currency.Name,
                decimals: network.Currency.Decimals,
              },
              rpcUrls: [network.RPC],
              blockExplorerUrls: [`${network.Explorer}/`],
            },
          ],
        })
        return true;
      }
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
  const logoURI = (tokenSymbol === "Goose-lp" || tokenSymbol === "GooseBumps-LP") ? `${BASE_URL}/images/tokens/goosebumpsLP.png` : `${BASE_URL}/images/tokens/${getChainId()}/${tokenAddress}.png`
  tokenSymbol = tokenSymbol === "GooseBumps-LP" ? "Goose-lp" : tokenSymbol
  tokenSymbol = tokenSymbol.length > METAMASK_MAX_TOKEN_SYMBOL_LENGTH ? tokenSymbol.substring(0, METAMASK_MAX_TOKEN_SYMBOL_LENGTH) : tokenSymbol
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: logoURI,
      },
    },
  })

  return tokenAdded
}
