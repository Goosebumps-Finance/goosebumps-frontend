import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from '@goosebumps/uikit'
import { ethers } from 'ethers'
import linq from 'linq'
import networks from 'config/constants/networks.json'
import store from 'state'
import { setNetworkInfo } from 'state/home'

import { BSC_CHAIN_ID, BSC_TESTNET_CHAIN_ID, ETH_CHAIN_ID, POLYGON_CHAIN_ID } from 'config/constants'
import getNodeUrl, { getBscNodeUrl, getEthNodeUrl, getPolygonNodeUrl } from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()
// const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)

console.log("BSC_CHAIN_ID = ", BSC_CHAIN_ID, " BSC_TESTNET_CHAIN_ID = ", BSC_TESTNET_CHAIN_ID)
// const injected = new InjectedConnector({ supportedChainIds: [ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID, BSC_TESTNET_CHAIN_ID] })
const injected = new InjectedConnector({ supportedChainIds: [BSC_CHAIN_ID, BSC_TESTNET_CHAIN_ID, ETH_CHAIN_ID, POLYGON_CHAIN_ID] })

const walletconnect = new WalletConnectConnector({
  // rpc: { [chainId]: rpcUrl, [ETH_CHAIN_ID]: getEthNodeUrl(), [POLYGON_CHAIN_ID]: getPolygonNodeUrl() },
  rpc: { [BSC_TESTNET_CHAIN_ID]: rpcUrl, [BSC_CHAIN_ID]: getBscNodeUrl()}, 
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

// const bscConnector = new BscConnector({ supportedChainIds: [ETH_CHAIN_ID, BSC_CHAIN_ID, POLYGON_CHAIN_ID, BSC_TESTNET_CHAIN_ID] })
const bscConnector = new BscConnector({ supportedChainIds: [BSC_CHAIN_ID, BSC_TESTNET_CHAIN_ID, ETH_CHAIN_ID, POLYGON_CHAIN_ID] })

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}

export const getLibrary = (provider): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (
  connector: AbstractConnector,
  provider: any,
  account: string,
  message: string,
): Promise<string> => {
  if (window.BinanceChain && connector instanceof BscConnector) {
    const { signature } = await window.BinanceChain.bnbSign(account, message)
    return signature
  }

  /**
   * Wallet Connect does not sign the message correctly unless you use their method
   * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
   */
  if (provider.provider?.wc) {
    const wcMessage = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message))
    const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
    return signature
  }

  return provider.getSigner(account).signMessage(message)
}

if(window.ethereum) {
  // @ts-ignore
  window.ethereum?.on('chainChanged', _chainId => {
    const newChainId = parseInt(_chainId)
    if(newChainId === 1 || newChainId === 56 || newChainId === 97 || newChainId === 137) {
      const newNetwork = linq.from(networks).where((x) => x.chainId === newChainId).single()
      store.dispatch(setNetworkInfo({network: {label: newNetwork.Display, value: newNetwork.Name, chainId: newNetwork.chainId}}))
    }
  })
}
