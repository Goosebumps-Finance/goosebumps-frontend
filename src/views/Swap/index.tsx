import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { parseUnits } from '@ethersproject/units'
import styled from 'styled-components'
import { CurrencyAmount, JSBI, Token, Trade, Price, ChainId } from '@goosebumps/zx-sdk'
import {
  Button,
  Text,
  ArrowDownIcon,
  Box,
  useModal,
  Flex,
  IconButton,
  // BottomDrawer,
  useMatchBreakpoints,
  ArrowUpDownIcon,
} from '@goosebumps/uikit'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import Footer from 'components/Menu/Footer'
import { RouteComponentProps } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'state/types'
import { setNetworkInfo } from 'state/home'

import { useTranslation } from 'contexts/Localization'
import SwapWarningTokens from 'config/constants/swapWarningTokens'
import { ZxFetchResult } from "config/constants/types";
// import { usingDifferentFactories, getFactoryNameByPair } from 'utils/factories'
import isSupportedChainId from 'utils/isSupportedChainId'
import { zxTradeExactIn, zxTradeExactOut } from 'utils/requester'
import AddressInputPanel from './components/AddressInputPanel'
import { GreyCard } from '../../components/Card'
import Column, { AutoColumn } from '../../components/Layout/Column'
import ConfirmSwapModal from './components/ConfirmSwapModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AutoRow, RowBetween } from '../../components/Layout/Row'
import AdvancedSwapDetailsDropdown, { AdvancedSwap0xDetailsDropdown } from './components/AdvancedSwapDetailsDropdown'
import confirmPriceImpactWithoutFee from './components/confirmPriceImpactWithoutFee'
import { ArrowWrapper, SwapCallbackError, Wrapper } from './components/styleds'
import TradePrice from './components/TradePrice'
import ImportTokenWarningModal from './components/ImportTokenWarningModal'
import ProgressSteps from './components/ProgressSteps'
import { AppBody } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'

// import { /* INITIAL_ALLOWED_SLIPPAGE, */ BASE_FACTORY_ADDRESS } from '../../config/constants'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency, useAllTokens } from '../../hooks/Tokens'
import { ApprovalState, useApproveCallbackFromTrade, useApprove0xCallbackFromTrade } from '../../hooks/useApproveCallback'
import { useSwapCallback } from '../../hooks/useSwapCallback'
import { useSwap0xCallback } from '../../hooks/useSwap0xCallback'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
  // useSingleTokenSwapInfo,,
  tryParseAmountFromBN,
} from '../../state/swap/hooks'
import {
  useExpertModeManager,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
  useExchangeChartManager,
} from '../../state/user/hooks'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import CircleLoader from '../../components/Loader/CircleLoader'
import Page from '../Page'
import SwapWarningModal from './components/SwapWarningModal'
// import PriceChartContainer from './components/Chart/PriceChartContainer'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'
import CurrencyInputHeader from './components/CurrencyInputHeader'

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  // color: ${({ theme }) => theme.colors.secondary};
  color: white;
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-up-down {
    display: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

export default function Swap({ history }: RouteComponentProps) {
  const loadedUrlParams = useDefaultsFromURLSearch()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const [userChartPreference, setUserChartPreference] = useExchangeChartManager(isMobile)
  const [isChartDisplayed, setIsChartDisplayed] = useState(userChartPreference)
  // 0x Swap
  const [is0xSwap, setIs0xSwap] = useState(false)
  const [zxResponse, setZxResponse] = useState<ZxFetchResult>(null)
  const [isFetching, setIsFetching] = useState(false)
  const [is0xPriceImpactTooHigh, setIs0xPriceImpactTooHigh] = useState(false)
  const [is0xInsufficient, setIs0xInsufficient] = useState(false)

  const dispatch = useDispatch();
  const { network } = useSelector((state: State) => state.home)

  useEffect(() => {
    dispatch(setNetworkInfo({ searchKey: "", network }));
  }, [])

  useEffect(() => {
    setUserChartPreference(isChartDisplayed)
  }, [isChartDisplayed, setUserChartPreference])

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens()
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  const { account, chainId } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state
  const { independentField, typedValue, recipient } = useSwapState()
  const { v2Trade, currencyBalances, parsedAmount, currencies, inputError: swapInputError } = useDerivedSwapInfo()

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount,
    }
    : {
      [Field.INPUT]:
        independentField === Field.INPUT ?
          parsedAmount :
          is0xSwap && !isFetching && zxResponse && !zxResponse.fetchError ? tryParseAmountFromBN(zxResponse.sellAmount, currencies[Field.INPUT]) : trade?.inputAmount,
      [Field.OUTPUT]:
        independentField === Field.OUTPUT ?
          parsedAmount :
          is0xSwap && !isFetching && zxResponse && !zxResponse.fetchError ? tryParseAmountFromBN(zxResponse.buyAmount, currencies[Field.OUTPUT]) : trade?.outputAmount,
    }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  // modal and loading
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const [{ zxResponseToConfirm, swap0xErrorMessage, attempting0xTxn, txHash0x }, setSwap0xState] = useState<{
    zxResponseToConfirm: ZxFetchResult | undefined
    attempting0xTxn: boolean
    swap0xErrorMessage: string | undefined
    txHash0x: string | undefined
  }>({
    zxResponseToConfirm: undefined,
    attempting0xTxn: false,
    swap0xErrorMessage: undefined,
    txHash0x: undefined,
  })

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const route = trade?.route
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )
  const noRoute = !route

  // check if the pair is on the goosebumps dex
  // const notBaseFactory = isSupportedChainId(chainId) && route && route.pairs && route.pairs.length === 1 && route.pairs[0].factory !== BASE_FACTORY_ADDRESS[chainId];
  // const differentFactories = isSupportedChainId(chainId) && route && usingDifferentFactories(route);
  // const firstFactoryName = useMemo(() => {
  //   if (route && route.pairs) {
  //     return getFactoryNameByPair(route.pairs[0])
  //   }
  //   return null
  // }, [route])

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage)

  const [approval0x, approve0xCallback] = useApprove0xCallbackFromTrade(parsedAmounts[Field.INPUT])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)
  const [approval0xSubmitted, setApproval0xSubmitted] = useState<boolean>(false)
  const [is0xSwapping, setIs0xSwapping] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  // mark when a user has submitted an approval0x, reset onTokenSelection for input field
  useEffect(() => {
    if (approval0x === ApprovalState.PENDING) {
      setApproval0xSubmitted(true)
    }
  }, [approval0x, approval0xSubmitted])

  useEffect(() => {
    if (is0xSwap && zxResponse && !zxResponse.fetchError) {
      const priceImpact = parseFloat(zxResponse?.response?.estimatedPriceImpact)
      if (priceImpact && priceImpact * 100 > allowedSlippage) {
        setIs0xPriceImpactTooHigh(true)
      } else {
        setIs0xPriceImpactTooHigh(false)
      }

      if (currencyBalances[Field.INPUT].lessThan(parsedAmounts[Field.INPUT])) {
        setIs0xInsufficient(true)
      } else {
        setIs0xInsufficient(false)
      }
    } else {
      setIs0xPriceImpactTooHigh(false)
      setIs0xInsufficient(false)
    }
  }, [is0xSwap, zxResponse, allowedSlippage])

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient)
  const { callback: swap0xCallback, error: swap0xCallbackError } = useSwap0xCallback(zxResponse, recipient)

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade)

  const [singleHopOnly] = useUserSingleHopOnly()

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee, t)) {
      return
    }
    if (!swapCallback) {
      return
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: hash })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t])

  const handle0xSwap = useCallback(() => {
    (async () => {
      setIs0xSwapping(true)
      if (!swap0xCallback) {
        return
      }

      const response = await zxTradeExactIn(
        chainId,
        currencies.INPUT instanceof Token ? currencies.INPUT.address : currencies.INPUT.name,
        currencies.OUTPUT instanceof Token ? currencies.OUTPUT.address : currencies.OUTPUT.name,
        parseUnits(typedValue, currencies[Field.INPUT].decimals),
        allowedSlippage
      )

      if (response.fetchError) {
        setSwap0xState({
          zxResponseToConfirm: undefined,
          attempting0xTxn: false,
          swap0xErrorMessage: response.fetchError,
          txHash0x: undefined,
        })
        return;
      }

      const priceImpact = parseFloat(response?.response?.estimatedPriceImpact)
      if (!isExpertMode && priceImpact && priceImpact * 100 > allowedSlippage) {
        setSwap0xState({
          zxResponseToConfirm: undefined,
          attempting0xTxn: false,
          swap0xErrorMessage: 'Price Impact High on 0x API',
          txHash0x: undefined,
        })
        return;
      }

      setZxResponse(response)
      setSwap0xState({ attempting0xTxn: true, zxResponseToConfirm, swap0xErrorMessage: undefined, txHash0x: undefined })

      swap0xCallback()
        .then((hash) => {
          setSwap0xState({ attempting0xTxn: false, zxResponseToConfirm, swap0xErrorMessage: undefined, txHash0x: hash })
          console.log("handle0xSwap hash:", hash)
        })
        .catch((error) => {
          setSwap0xState({ attempting0xTxn: false, zxResponseToConfirm, swap0xErrorMessage: error.message, txHash0x: undefined })
          console.log("handle0xSwap error:", error)
        })

      setIs0xSwapping(false)
    })()
  }, [is0xSwap, zxResponse, zxTradeExactIn, isExpertMode])

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const showApprove0xFlow =
    zxResponse && !zxResponse.fetchError &&
    (approval0x === ApprovalState.NOT_APPROVED ||
      approval0x === ApprovalState.PENDING ||
      (approval0xSubmitted && approval0x === ApprovalState.APPROVED))

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, trade, txHash])

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null)
  const [onPresentSwapWarningModal] = useModal(<SwapWarningModal swapCurrency={swapWarningCurrency} />)

  const shouldShowSwapWarning = (swapCurrency) => {
    const isWarningToken = Object.entries(SwapWarningTokens).find((warningTokenConfig) => {
      const warningTokenData = warningTokenConfig[1]
      return swapCurrency.address === warningTokenData.address
    })
    return Boolean(isWarningToken)
  }

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency])

  useEffect(() => {
    // console.log("Swap noRoute, userHasSpecifiedInputOutput: ", noRoute, userHasSpecifiedInputOutput)
    if (noRoute && userHasSpecifiedInputOutput && isSupportedChainId(chainId) && chainId !== ChainId.TESTNET) {
      // console.log("enalble 0x swap")
      setIs0xSwap(true)
    } else {
      // console.log("disable 0x swap")
      setIs0xSwap(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noRoute, userHasSpecifiedInputOutput, chainId])

  useEffect(() => {
    (async () => {
      let response: ZxFetchResult = null
      // console.log("independentField, is0xSwap, parsedAmount: pass", independentField, is0xSwap, typedValue)
      if (is0xSwap) {
        setIsFetching(true)
        // console.log("independentField, is0xSwap, parsedAmount: ", independentField, is0xSwap, typedValue, currencies, allowedSlippage)
        if (independentField === Field.INPUT) {
          // console.log("independentField INPUT, is0xSwap, parsedAmount: ", response)
          response = await zxTradeExactIn(
            chainId,
            currencies.INPUT instanceof Token ? currencies.INPUT.address : currencies.INPUT.name,
            currencies.OUTPUT instanceof Token ? currencies.OUTPUT.address : currencies.OUTPUT.name,
            parseUnits(typedValue, currencies[Field.INPUT].decimals),
            allowedSlippage
          )
        } else if (independentField === Field.OUTPUT) {
          // console.log("independentField OUTPUT, is0xSwap, parsedAmount: ", response)
          response = await zxTradeExactOut(
            chainId,
            currencies.INPUT instanceof Token ? currencies.INPUT.address : currencies.INPUT.name,
            currencies.OUTPUT instanceof Token ? currencies.OUTPUT.address : currencies.OUTPUT.name,
            parseUnits(typedValue, currencies[Field.OUTPUT].decimals),
            allowedSlippage
          )
        }
        setIsFetching(false)
        // console.log("independentField, is0xSwap, parsedAmount: ", response)
      }
      setZxResponse(response)
    })()
  }, [independentField, is0xSwap, typedValue, allowedSlippage])

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      setApproval0xSubmitted(false) // reset 2 step UI for approvals
      setIs0xSwapping(false)
      setSwapState({
        tradeToConfirm: undefined,
        attemptingTxn: false,
        swapErrorMessage: undefined,
        txHash: undefined,
      })
      setSwap0xState({
        zxResponseToConfirm: undefined,
        attempting0xTxn: false,
        swap0xErrorMessage: undefined,
        txHash0x: undefined,
      })
      onCurrencySelection(Field.INPUT, inputCurrency)
      const showSwapWarning = shouldShowSwapWarning(inputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(inputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },
    [onCurrencySelection, setApprovalSubmitted, setApproval0xSubmitted, setIs0xSwapping, setSwapState, setSwap0xState]
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency)
      const showSwapWarning = shouldShowSwapWarning(outputCurrency)
      if (showSwapWarning) {
        setSwapWarningCurrency(outputCurrency)
      } else {
        setSwapWarningCurrency(null)
      }
    },

    [onCurrencySelection]
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal tokens={importTokensNotInDefault} onCancel={() => history.push('/swap')} />,
  )

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length])

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    'confirmSwapModal',
  )

  return (
    <Page removePadding={isChartExpanded} hideFooterOnDesktop={isChartExpanded} style={{ paddingBottom: '20px' }}>
      <Flex width="100%" justifyContent="center" position="relative">
        <Flex flexDirection="column">
          <StyledSwapContainer $isChartExpanded={isChartExpanded}>
            <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>
              <AppBody>
                <CurrencyInputHeader
                  title={t('Exchange')}
                  subtitle={t('Trade tokens in an instant')}
                  setIsChartDisplayed={setIsChartDisplayed}
                  isChartDisplayed={isChartDisplayed}
                />
                <Wrapper id="swap-page">
                  <AutoColumn gap="md">
                    <CurrencyInputPanel
                      label={
                        independentField === Field.OUTPUT && !showWrap && trade ? t('From (estimated)') : t('From')
                      }
                      value={formattedAmounts[Field.INPUT]}
                      showMaxButton={!atMaxAmountInput}
                      currency={currencies[Field.INPUT]}
                      onUserInput={handleTypeInput}
                      onMax={handleMaxInput}
                      onCurrencySelect={handleInputSelect}
                      otherCurrency={currencies[Field.OUTPUT]}
                      id="swap-currency-input"
                    />

                    <AutoColumn justify="space-between">
                      <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
                        <SwitchIconButton
                          variant="light"
                          scale="sm"
                          onClick={() => {
                            setApprovalSubmitted(false) // reset 2 step UI for approvals
                            setApproval0xSubmitted(false) // reset 2 step UI for approvals
                            setIs0xSwapping(false)
                            setSwapState({
                              tradeToConfirm: undefined,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              txHash: undefined,
                            })
                            setSwap0xState({
                              zxResponseToConfirm: undefined,
                              attempting0xTxn: false,
                              swap0xErrorMessage: undefined,
                              txHash0x: undefined,
                            })
                            onSwitchTokens()
                          }}
                        >
                          <ArrowDownIcon
                            className="icon-down"
                            color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                          />
                          <ArrowUpDownIcon
                            className="icon-up-down"
                            color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                          />
                        </SwitchIconButton>
                        {recipient === null && !showWrap && isExpertMode ? (
                          <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                            {t('+ Add a send (optional)')}
                          </Button>
                        ) : null}
                      </AutoRow>
                    </AutoColumn>
                    <CurrencyInputPanel
                      value={formattedAmounts[Field.OUTPUT]}
                      onUserInput={handleTypeOutput}
                      label={independentField === Field.INPUT && !showWrap && trade ? t('To (estimated)') : t('To')}
                      showMaxButton={false}
                      currency={currencies[Field.OUTPUT]}
                      onCurrencySelect={handleOutputSelect}
                      otherCurrency={currencies[Field.INPUT]}
                      id="swap-currency-output"
                    />

                    {isExpertMode && recipient !== null && !showWrap ? (
                      <>
                        <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                          <ArrowWrapper clickable={false}>
                            <ArrowDownIcon width="16px" />
                          </ArrowWrapper>
                          <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                            {t('- Remove send')}
                          </Button>
                        </AutoRow>
                        <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                      </>
                    ) : null}

                    {showWrap ? null : (
                      <AutoColumn gap="8px" style={{ padding: '0 16px' }}>
                        {Boolean(trade) && (
                          <RowBetween align="center">
                            <Label>{t('Price')}</Label>
                            <TradePrice
                              price={trade?.executionPrice}
                              showInverted={showInverted}
                              setShowInverted={setShowInverted}
                            />
                          </RowBetween>
                        )}
                        {is0xSwap && Boolean(zxResponse) && (
                          <RowBetween align="center">
                            <Label>{t('Price')}</Label>
                            <TradePrice
                              price={new Price(currencies[Field.INPUT], currencies[Field.OUTPUT], zxResponse.sellAmount, zxResponse.buyAmount)}
                              showInverted={showInverted}
                              setShowInverted={setShowInverted}
                            />
                          </RowBetween>
                        )}
                        {/* allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && */ (
                          <RowBetween align="center">
                            <Label>{t('Slippage Tolerance')}</Label>
                            <Text bold color="primary">
                              {allowedSlippage / 100}%
                            </Text>
                          </RowBetween>
                        )}
                      </AutoColumn>
                    )}
                  </AutoColumn>
                  <Box mt="1rem">
                    {swapIsUnsupported ? (
                      <Button width="100%" disabled mb="4px">
                        {t('Unsupported Asset')}
                      </Button>
                    ) : !account ? (
                      <ConnectWalletButton width="100%" />
                    ) : showWrap ? (
                      <Button width="100%" disabled={Boolean(wrapInputError)} onClick={onWrap}>
                        {wrapInputError ??
                          (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                      </Button>
                    ) : is0xSwap ? (
                      isFetching || !zxResponse ? (
                        <GreyCard style={{ textAlign: 'center' }}>
                          <AutoRow gap="6px" justify="center">
                            {t('Please wait')} <CircleLoader stroke="white" />
                          </AutoRow>
                        </GreyCard>
                      ) : zxResponse.fetchError ? (
                        <GreyCard style={{ textAlign: 'center' }}>
                          <Text color="textSubtle" mb="4px">
                            {zxResponse.fetchError}
                          </Text>
                        </GreyCard>
                      ) : showApprove0xFlow ? (
                        <RowBetween>
                          <Button
                            variant={approval0x === ApprovalState.APPROVED ? 'success' : 'primary'}
                            onClick={approve0xCallback}
                            disabled={approval0x !== ApprovalState.NOT_APPROVED || approval0xSubmitted}
                            width="48%"
                          >
                            {approval0x === ApprovalState.PENDING ? (
                              <AutoRow gap="6px" justify="center">
                                {t('Enabling')} <CircleLoader stroke="white" />
                              </AutoRow>
                            ) : approval0xSubmitted && approval0x === ApprovalState.APPROVED ? (
                              t('Enabled')
                            ) : (
                              t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                            )}
                          </Button>
                          <Button
                            variant={isValid && is0xPriceImpactTooHigh ? 'danger' : 'primary'}
                            onClick={handle0xSwap}
                            width="48%"
                            id="swap-button"
                            disabled={
                              is0xInsufficient ||
                              !isValid ||
                              isFetching ||
                              !zxResponse ||
                              zxResponse.fetchError !== null ||
                              approval0x !== ApprovalState.APPROVED ||
                              is0xSwapping ||
                              (!isExpertMode && is0xPriceImpactTooHigh)
                            }
                            style={{
                              background: (
                                is0xInsufficient ||
                                !isValid ||
                                isFetching ||
                                !zxResponse ||
                                zxResponse.fetchError !== null ||
                                approval0x !== ApprovalState.APPROVED ||
                                is0xSwapping ||
                                (!isExpertMode && is0xPriceImpactTooHigh)) ? "#26292e" : "#04c0d7"
                            }} // #3c3742
                          >
                            {
                              is0xInsufficient ?
                                (t('Insufficient %symbol% balance', { symbol: currencies[Field.INPUT].symbol }))
                                : swapInputError ||
                                  is0xSwapping ? (
                                  <AutoRow gap="6px" justify="center">
                                    {t('Swapping on 0x API')} <CircleLoader stroke="white" />
                                  </AutoRow>
                                ) : !is0xPriceImpactTooHigh
                                  ? t('Swap on 0x API')
                                  : isExpertMode
                                    ? t('Swap Anyway on 0x API')
                                    : t('Price Impact High on 0x API')
                            }
                          </Button>
                        </RowBetween>
                      ) : (
                        <Button
                          variant={isValid && is0xPriceImpactTooHigh && !swap0xCallbackError ? 'danger' : 'primary'}
                          onClick={handle0xSwap}
                          width="100%"
                          id="swap-button"
                          disabled={
                            is0xInsufficient ||
                            !isValid ||
                            isFetching ||
                            !zxResponse ||
                            zxResponse.fetchError !== null ||
                            approval0x !== ApprovalState.APPROVED ||
                            is0xSwapping ||
                            (!isExpertMode && is0xPriceImpactTooHigh) ||
                            !!swap0xCallbackError
                          }
                          style={{
                            background: (
                              is0xInsufficient ||
                              !isValid ||
                              isFetching ||
                              !zxResponse ||
                              zxResponse.fetchError !== null ||
                              approval0x !== ApprovalState.APPROVED ||
                              is0xSwapping ||
                              (!isExpertMode && is0xPriceImpactTooHigh) ||
                              !!swap0xCallbackError) ? "#26292e" : "#04c0d7"
                          }} // #3c3742
                        >
                          {
                            is0xInsufficient ?
                              (t('Insufficient %symbol% balance', { symbol: currencies[Field.INPUT].symbol }))
                              : swapInputError ||
                                is0xSwapping ? (
                                <AutoRow gap="6px" justify="center">
                                  {t('Swapping on 0x API')} <CircleLoader stroke="white" />
                                </AutoRow>
                              ) : !is0xPriceImpactTooHigh
                                ? t('Swap on 0x API')
                                : isExpertMode
                                  ? t('Swap Anyway on 0x API')
                                  : t('Price Impact High on 0x API')
                          }
                        </Button>
                      )
                    ) : noRoute && userHasSpecifiedInputOutput ? (
                      <GreyCard style={{ textAlign: 'center' }}>
                        <Text color="textSubtle" mb="4px">
                          {t('Insufficient liquidity for this trade.')}
                        </Text>
                        {singleHopOnly && (
                          <Text color="textSubtle" mb="4px">
                            {t('Try enabling multi-hop trades.')}
                          </Text>
                        )}
                      </GreyCard>
                    ) : showApproveFlow ? (
                      <RowBetween>
                        <Button
                          variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                          onClick={approveCallback}
                          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                          width="48%"
                        >
                          {approval === ApprovalState.PENDING ? (
                            <AutoRow gap="6px" justify="center">
                              {t('Enabling')} <CircleLoader stroke="white" />
                            </AutoRow>
                          ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                            t('Enabled')
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.INPUT]?.symbol ?? '' })
                          )}
                        </Button>
                        <Button
                          variant={isValid && priceImpactSeverity > 2 ? 'danger' : 'primary'}
                          onClick={() => {
                            if (isExpertMode) {
                              handleSwap()
                            } else {
                              setSwapState({
                                tradeToConfirm: trade,
                                attemptingTxn: false,
                                swapErrorMessage: undefined,
                                txHash: undefined,
                              })
                              onPresentConfirmModal()
                            }
                          }}
                          width="48%"
                          id="swap-button"
                          disabled={
                            !isValid ||
                            approval !== ApprovalState.APPROVED ||
                            (priceImpactSeverity > 3 && !isExpertMode)
                          }
                          style={{ background: (!isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)) ? "#26292e" : "#121e30" }}
                        >
                          {priceImpactSeverity > 3 && !isExpertMode
                            ? t('Price Impact High')
                            : priceImpactSeverity > 2
                              ? t('Swap Anyway')
                              : t('Swap')}
                        </Button>
                      </RowBetween>
                    ) : (
                      <Button
                        variant={isValid && priceImpactSeverity > 2 && !swapCallbackError ? 'danger' : 'primary'}
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              txHash: undefined,
                            })
                            onPresentConfirmModal()
                          }
                        }}
                        id="swap-button"
                        width="100%"
                        disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                        style={{ background: (!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError) ? "#26292e" : "#04c0d7" }} // #3c3742
                      >
                        {swapInputError ||
                          (priceImpactSeverity > 3 && !isExpertMode
                            ? t('Price Impact Too High')
                            : priceImpactSeverity > 2
                              ? t('Swap Anyway')
                              : t('Swap'))}
                      </Button>
                    )}
                    {showApproveFlow && (
                      <Column style={{ marginTop: '1rem' }}>
                        <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                      </Column>
                    )}
                    {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
                    {isExpertMode && swap0xErrorMessage ? <SwapCallbackError error={swap0xErrorMessage} /> : null}
                  </Box>
                </Wrapper>
              </AppBody>
              {!swapIsUnsupported ? (
                trade ? <AdvancedSwapDetailsDropdown trade={trade} />
                  : is0xSwap && !isFetching && zxResponse && !zxResponse.fetchError && (
                    <AdvancedSwap0xDetailsDropdown response={zxResponse} />
                  )
              ) : (
                <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
              )}
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
          {isChartExpanded && (
            <Box display={['none', null, null, 'block']} width="100%" height="100%">
              <Footer variant="side" />
            </Box>
          )}
        </Flex>
      </Flex>
    </Page>
  )
}
