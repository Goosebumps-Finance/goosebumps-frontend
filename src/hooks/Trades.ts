/* eslint-disable no-param-reassign */
import { isTradeBetter } from 'utils/trades'
import { ChainId, Currency, CurrencyAmount, Pair, Token, Trade } from '@goosebumps/sdk'
import flatMap from 'lodash/flatMap'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

// import { useUserSingleHopOnly } from 'state/user/hooks'
import isSupportedChainId from 'utils/isSupportedChainId'
import {
  BASES_TO_CHECK_TRADES_AGAINST,
  CUSTOM_BASES,
  // BETTER_TRADE_LESS_HOPS_THRESHOLD,
  // ADDITIONAL_BASES,
  BASE_FACTORY_ADDRESS
} from '../config/constants'
import { PairState, usePairs } from './usePairs'
import { wrappedCurrency } from '../utils/wrappedCurrency'

import { useUnsupportedTokens } from './Tokens'

function useAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Pair[] {
  const { chainId } = useActiveWeb3React()

  // Base tokens for building intermediary trading routes
  const bases: Token[] = useMemo(() => (isSupportedChainId(chainId) ? BASES_TO_CHECK_TRADES_AGAINST[chainId] : []), [chainId])

  // All pairs from base tokens
  const basePairs: [Token, Token][] = useMemo(
    () =>
      flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])).filter(
        ([t0, t1]) => t0.address !== t1.address
      ),
    [bases]
  )

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
          // the direct pair
          [tokenA, tokenB],
          // token A against all bases
          ...bases.map((base): [Token, Token] => [tokenA, base]),
          // token B against all bases
          ...bases.map((base): [Token, Token] => [tokenB, base]),
          // each base against all bases
          ...basePairs,
        ]
          .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
          .filter(([t0, t1]) => t0.address !== t1.address)
          // This filter will remove all the pairs that are not supported by the CUSTOM_BASES settings
          // This option is currently not used on Goosebumps DEX
          .filter(([t0, t1]) => {
            if (!isSupportedChainId(chainId)) return true
            const customBases = CUSTOM_BASES[chainId]
            if (!customBases) return true

            const customBasesA: Token[] | undefined = customBases[t0.address]
            const customBasesB: Token[] | undefined = customBases[t1.address]

            if (!customBasesA && !customBasesB) return true
            if (customBasesA && !customBasesA.find((base) => t1.equals(base))) return false
            if (customBasesB && !customBasesB.find((base) => t0.equals(base))) return false

            return true
          })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  )

  const allPairs = usePairs(allPairCombinations)

  // only pass along valid pairs, non-duplicated pairs
  return useMemo(
    () =>
      Object.values(
        allPairs
          // filter out invalid pairs
          .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
          // filter out duplicated pairs
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
            return memo
          }, {})
      ),
    [allPairs]
  )
}

/**
 * Sorting that sorts the base factory as first when price impact is below the `maxPriceImpact`
 */
function sortTrades(chainId: ChainId, maxPriceImpact: number, tradeA: Trade, tradeB: Trade): number {
  const baseFactory: string = BASE_FACTORY_ADDRESS[chainId]
  const aFirstFactory = tradeA.route.pairs.length > 0 ? tradeA.route.pairs[0].factory : null
  const aLastFactory = tradeA.route.pairs.length > 0 ? tradeA.route.pairs[tradeA.route.pairs.length - 1].factory : null
  const bFirstFactory = tradeB.route.pairs.length > 0 ? tradeB.route.pairs[0].factory : null
  const bLastFactory = tradeB.route.pairs.length > 0 ? tradeB.route.pairs[tradeB.route.pairs.length - 1].factory : null
  const aPriceImpact = parseFloat(tradeA.priceImpact.toFixed(2))
  const bPriceImpact = parseFloat(tradeB.priceImpact.toFixed(2))
  if (aFirstFactory === baseFactory && aLastFactory === baseFactory && (bFirstFactory !== baseFactory || bLastFactory !== baseFactory) && aPriceImpact <= maxPriceImpact)
    return -1;
  if (bFirstFactory === baseFactory && bLastFactory === baseFactory && (aFirstFactory !== baseFactory || aLastFactory !== baseFactory) && bPriceImpact <= maxPriceImpact)
    return 1;
  if ((aFirstFactory === baseFactory || aLastFactory === baseFactory) && bFirstFactory !== baseFactory && bLastFactory !== baseFactory && aPriceImpact <= maxPriceImpact)
    return -1;
  if ((bFirstFactory === baseFactory || bLastFactory === baseFactory) && aFirstFactory !== baseFactory && aLastFactory !== baseFactory && bPriceImpact <= maxPriceImpact)
    return 1;
  return 0;
}
/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export function useTradeExactIn(chainId: ChainId | undefined, currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Trade | null {
  const allowedPairs = useAllCommonPairs(currencyAmountIn?.currency, currencyOut)
  // console.log('[allowedPairs].useTradeExactIn.allowedPairs=', allowedPairs)

  return useMemo(() => {
    if (isSupportedChainId(chainId) && currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      const numRes = (window?.location?.href?.toLowerCase().indexOf("onlydirect") !== -1) ? 1 : 3
      // console.log("[allowedPairs].useTradeExactIn.numRes =", numRes)
      const trades = Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: numRes, maxNumResults: 3 })
      const sortedTrades = trades.sort((a, b) => sortTrades(chainId, 3, a, b))
      return sortedTrades[0] ?? null
    }
    return null
  }, [allowedPairs, chainId, currencyAmountIn, currencyOut])
}

/**
 * Returns the best trade for the token in to the exact amount of token out
 */
export function useTradeExactOut(chainId: ChainId | undefined, currencyIn?: Currency, currencyAmountOut?: CurrencyAmount): Trade | null {
  // console.log('[allowedPairs].useTradeExactOut.start=', currencyIn, currencyAmountOut?.currency)
  const allowedPairs = useAllCommonPairs(currencyIn, currencyAmountOut?.currency)
  // console.log('[allowedPairs].useTradeExactOut.allowedPairs=', allowedPairs)

  return useMemo(() => {
    if (isSupportedChainId(chainId) && currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      const numRes = (window?.location?.href?.toLowerCase().indexOf("onlydirect") !== -1) ? 1 : 3
      // console.log("[allowedPairs].useTradeExactOut.numRes=", numRes)
      const trades = Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: numRes, maxNumResults: 3 })
      const sortedTrades = trades.sort((a, b) => sortTrades(chainId, 3, a, b))
      return sortedTrades[0] ?? null
    }
    return null
  }, [allowedPairs, chainId, currencyIn, currencyAmountOut])
}

export function useIsTransactionUnsupported(currencyIn?: Currency, currencyOut?: Currency): boolean {
  const unsupportedTokens: { [address: string]: Token } = useUnsupportedTokens()
  const { chainId } = useActiveWeb3React()

  const tokenIn = wrappedCurrency(currencyIn, chainId)
  const tokenOut = wrappedCurrency(currencyOut, chainId)

  // if unsupported list loaded & either token on list, mark as unsupported
  if (unsupportedTokens) {
    if (tokenIn && Object.keys(unsupportedTokens).includes(tokenIn.address)) {
      return true
    }
    if (tokenOut && Object.keys(unsupportedTokens).includes(tokenOut.address)) {
      return true
    }
  }

  return false
}
