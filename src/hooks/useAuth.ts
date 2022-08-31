import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import linq from 'linq'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { ConnectorNames, connectorLocalStorageKey } from '@goosebumps/uikit'

import { connectorsByName } from 'utils/web3React'
import changeNetwork from 'utils/changeNetwork'
import { setupNetwork } from 'utils/wallet'
import useToast from 'hooks/useToast'
import { useAppDispatch } from 'state'
import { State } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import networks from 'config/constants/networks';

import { clearUserStates } from '../utils/clearUserStates'

const useAuth = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { chainId, activate, deactivate } = useWeb3React()
  const { toastError } = useToast()
  const { network } = useSelector((state: State) => state.home)

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = connectorsByName[connectorID]
      const detailedNetwork = linq.from(networks).where((x) => x.Name === network.value).single()
      if (connector) {
        // @ts-ignore
        // const currentVersion = window.ethereum.networkVersion
        // @ts-ignore
        const currentVersion = window.ethereum?.networkVersion ?? undefined
        // @ts-ignore
        // console.log("window.ethereum?.networkVersion ?? undefined: ", window.ethereum?.networkVersion ?? undefined)
        if (currentVersion !== detailedNetwork.chainId) {
          changeNetwork(detailedNetwork)
        }
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const hasSetup = await setupNetwork(detailedNetwork)
            if (hasSetup) {
              activate(connector)
            }
          } else {
            window?.localStorage?.removeItem(connectorLocalStorageKey)
            if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
              toastError(t('Provider Error'), t('No provider was found'))
            } else if (
              error instanceof UserRejectedRequestErrorInjected ||
              error instanceof UserRejectedRequestErrorWalletConnect
            ) {
              if (connector instanceof WalletConnectConnector) {
                const walletConnector = connector as WalletConnectConnector
                walletConnector.walletConnectProvider = null
              }
              toastError(t('Authorization Error'), t('Please authorize to access your account'))
            } else {
              toastError(error.name, error.message)
            }
          }
        })
      } else {
        toastError(t('Unable to find connector'), t('The connector config is wrong'))
      }
    },
    [t, activate, toastError, network],
  )

  const logout = useCallback(() => {
    deactivate()
    clearUserStates(dispatch, chainId)
  }, [deactivate, dispatch, chainId])

  return { login, logout }
}

export default useAuth
