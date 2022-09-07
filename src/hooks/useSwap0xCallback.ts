import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { SwapParameters, ETHER } from '@goosebumps/zx-sdk'
import { Field } from 'state/swap/actions'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrency } from 'hooks/Tokens'
import { useGasPrice } from 'state/user/hooks'
import truncateHash from 'utils/truncateHash'
import { ZxFetchResult } from 'config/constants/types'
import isSupportedChainId from 'utils/isSupportedChainId'
import { useSwapState, tryParseAmountFromBN } from 'state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, getManageContract, isAddress } from '../utils'
import isZero from '../utils/isZero'
import useTransactionDeadline from './useTransactionDeadline'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface Estimated0xSwapCall {
  gasEstimate: BigNumber | null
  error: Error | null
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwap0xCallback(
  zxResponse: ZxFetchResult | null | undefined, // trade to execute, required
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  // console.log("useSwap0xCallback: pass")
  const { account, chainId, library } = useActiveWeb3React()
  const gasPrice = useGasPrice()

  const addTransaction = useTransactionAdder()

  const recipient = recipientAddressOrName === null ? account : recipientAddressOrName
  const deadline = useTransactionDeadline()
  const contract: Contract | null = getManageContract(chainId, library, account)
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  return useMemo(() => {
    // console.log("useSwap0xCallback useMemo: pass")
    if (!contract || !zxResponse || !inputCurrency || !outputCurrency || !library || !account || !isSupportedChainId(chainId)) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        // console.log("useSwap0xCallback useMemo onSwap: pass")
        let methodName: string = null
        let args: (string | string[])[] = null
        let value: string = null

        // console.log("useSwap0xCallback useMemo onSwap: pass1")

        if (inputCurrency === ETHER) {
          // console.log("INPUT ETHER")
          methodName = 'swapExactETHForTokensOn0x'
          args = [
            zxResponse.response.buyTokenAddress,
            zxResponse.response.to,
            zxResponse.response.data,
            recipient,
            deadline
          ]
          value = zxResponse.sellAmount.toString()
        } else if (outputCurrency === ETHER) {
          // console.log("OUTPUT ETHER")
          methodName = 'swapExactTokenForETHOn0x'
          args = [
            zxResponse.response.sellTokenAddress,
            zxResponse.sellAmount,
            zxResponse.response.allowanceTarget,
            zxResponse.response.to,
            zxResponse.response.data,
            recipient,
            deadline
          ]
        } else {
          // console.log("INPUT OUTPUT")
          methodName = 'swapExactTokensForTokensOn0x'
          args = [
            zxResponse.response.sellTokenAddress,
            zxResponse.response.buyTokenAddress,
            zxResponse.sellAmount,
            zxResponse.response.allowanceTarget,
            zxResponse.response.to,
            zxResponse.response.data,
            recipient,
            deadline
          ]
        }

        // console.log("swapCall: ", methodName, args, value, contract)

        const swapCall: SwapCall = {
          parameters: { methodName, args, value },
          contract,
        }

        const options = !value || isZero(value) ? {} : { value }

        const estimatedGasAndError: Estimated0xSwapCall = await contract.estimateGas[methodName](...args, options)
          .then((gasEstimate) => {
            return { gasEstimate, error: null }
          })
          .catch((gasError) => {
            console.error('Gas estimate failed, trying eth_call to extract error', swapCall)

            return contract.callStatic[methodName](...args, options)
              .then((result) => {
                console.error('Unexpected successful call after failed estimate gas', swapCall, gasError, result)
                return { gasEstimate: null, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
              })
              .catch((callError) => {
                console.error('Call threw error', swapCall, callError)
                const reason: string = callError.reason || callError.data?.message || callError.message
                const errorMessage = `The transaction cannot succeed due to error: ${reason ?? 'Unknown error, check the logs'
                  }.`

                return { gasEstimate: null, error: new Error(errorMessage) }
              })
          })

        // console.log("estimatedGasAndError: ", estimatedGasAndError)

        if (estimatedGasAndError.error) {
          throw estimatedGasAndError.error
        } else if (!estimatedGasAndError.gasEstimate) {
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(estimatedGasAndError.gasEstimate),
          gasPrice,
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = inputCurrency.symbol
            const outputSymbol = outputCurrency.symbol
            const inputAmount = tryParseAmountFromBN(zxResponse.response.sellAmount, inputCurrency).toSignificant(3)
            const outputAmount = tryParseAmountFromBN(zxResponse.response.buyAmount, outputCurrency).toSignificant(3)

            const base = `Swap on 0x API ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${recipientAddressOrName && isAddress(recipientAddressOrName)
                  ? truncateHash(recipientAddressOrName)
                  : recipientAddressOrName
                }`

            addTransaction(response, {
              summary: withRecipient,
            })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(`Swap failed: ${error.message}`)
            }
          })
      },
      error: null,
    }
  }, [zxResponse, library, account, chainId, recipient, inputCurrency, outputCurrency, recipientAddressOrName, addTransaction, gasPrice])
}
