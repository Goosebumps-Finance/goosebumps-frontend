// import { TokenAmount, Pair, Currency } from '@goosebumps/zx-sdk'
// import { useMemo } from 'react'
// // import { abi as IGoosebumpsPairABI } from '@goosebumps/goosebumps-aggregator-dex/artifacts/contracts/GoosebumpsPair.sol/GoosebumpsPair.json'
// import { abi as IGoosebumpsPairABI } from '@goosebumps/goosebumps-v1-aggregator-dex/artifacts/contracts/GooseBumpsSwapPair.sol/GooseBumpsSwapPair.json'
// import { Interface } from '@ethersproject/abi'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
// import isSupportedChainId from 'utils/isSupportedChainId'
// import { FACTORY_ADDRESSES } from '../config/constants'

// import { useMultipleContractSingleData } from '../state/multicall/hooks'
// import { wrappedCurrency } from '../utils/wrappedCurrency'

// const PAIR_INTERFACE = new Interface(IGoosebumpsPairABI)

// export enum PairState {
//   LOADING,
//   NOT_EXISTS,
//   EXISTS,
//   INVALID,
// }

// export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
//   const { chainId } = useActiveWeb3React()

//   const tokens = useMemo(
//     () =>
//       currencies.map(([currencyA, currencyB]) => [
//         wrappedCurrency(currencyA, chainId),
//         wrappedCurrency(currencyB, chainId)
//       ]),
//     [chainId, currencies]
//   )

//   const pairTokens = useMemo(
//     () => {
//       if (tokens && isSupportedChainId(chainId)) {
//         return tokens.map(([tokenA, tokenB]) => {

//           return tokenA && tokenB && !tokenA.equals(tokenB) ? Object.entries(FACTORY_ADDRESSES[chainId]).map(([factory, initCodeHash]) => {
//             const initCodeHash_ = initCodeHash.toString()
//             return {
//               pairAddress: Pair.getAddress(factory, initCodeHash_, tokenA, tokenB),
//               factory,
//               initCodeHash_,
//               tokenA,
//               tokenB
//             }
//           }) : undefined
//         }).flat().reduce((address, value) => {
//           if (value !== undefined) address[value.pairAddress] = value;
//           return address;
//         }, {})
//       }
//       return {};
//     }, [chainId, tokens]
//   )

//   const results = useMultipleContractSingleData(Object.entries(pairTokens).map(([pair]) => pair), PAIR_INTERFACE, 'getReserves')
//   // console.log('[usePairs] = pairTokens', pairTokens)
//   // console.log('[usePairs] = Object.entries(pairTokens).map(([pair]) => pair)', Object.entries(pairTokens).map(([pair]) => pair))
//   // console.log('[usePairs] = results', results)

//   return useMemo(() => {
//     return results.map((result) => {
//       const { result: reserves, loading } = result
//       if (loading) return [PairState.LOADING, null]
//       if (!isSupportedChainId(chainId) || !result.address || !pairTokens[result.address]) return [PairState.INVALID, null]

//       const pairToken = pairTokens[result.address]
//       const { tokenA, tokenB } = pairToken

//       if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
//       if (!reserves) return [PairState.NOT_EXISTS, null]
//       // const { reserve0, reserve1 } = reserves
//       const reserve0 = reserves[0]
//       const reserve1 = reserves[1]
//       const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
//       // console.log('[usePairs] = pass', result)
//       // console.log('[usePairs] = token0', token0)
//       // console.log('[usePairs] = token1', token1)
//       // console.log('[usePairs] = reserve0', reserve0)
//       // console.log('[usePairs] = reserve1', reserve1)
//       // console.log('[usePairs] = TokenAmount', new TokenAmount(token0, reserve0.toString()))
//       // console.log('[usePairs] = TokenAmount', new TokenAmount(token0, reserve0))
//       // console.log('[usePairs] = new Pair', new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()), pairToken.factory, pairToken.initCodeHash))

//       return [
//         PairState.EXISTS,
//         new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()), pairToken.factory, pairToken.initCodeHash)
//       ];
//     })
//   }, [results, chainId, pairTokens])
// }

// export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
//   const pairs = usePairs([[tokenA, tokenB]])
//   return pairs && pairs.length > 0 ? pairs[0] : [PairState.NOT_EXISTS, null]
// }

// v1 DEX
import { TokenAmount, Pair, Currency } from '@goosebumps/zx-sdk'
import { useMemo } from 'react'
import { abi as IGoosebumpsPairABI } from '@goosebumps/goosebumps-v1-aggregator-dex/artifacts/contracts/GooseBumpsSwapPair.sol/GooseBumpsSwapPair.json'
import { Interface } from '@ethersproject/abi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import isSupportedChainId from 'utils/isSupportedChainId'

import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'

const PAIR_INTERFACE = new Interface(IGoosebumpsPairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]),
    [chainId, currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
      }),
    [tokens],
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]
      if (!isSupportedChainId(chainId) || !tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString())),
      ]
    })
  }, [results, chainId, tokens])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}
