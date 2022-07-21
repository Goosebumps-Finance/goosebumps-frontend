import { SerializedFarmConfig } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from '../../utils/bigNumber'
import { fetchPublicFarmsData } from './fetchPublicFarmData'
import { fetchMasterChefData } from './fetchMasterChefData'

const fetchFarms = async (farmsToFetch: SerializedFarmConfig[]) => {
  const farmResult = await fetchPublicFarmsData(farmsToFetch)
  // console.log("farmResult: ", farmResult)
  
  // const masterChefResult = farmsToFetch[0].targetAddresses !== undefined ? null : (await fetchMasterChefData(farmsToFetch))

  return farmsToFetch.map((farm, index) => {
    const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
      farmResult[index]
    console.log("xxxx start: ")
    console.log("xxxx farmsToFetch[index].lpSymbol: ", farmsToFetch[index].lpSymbol)
    console.log("xxxx farmsToFetch[index]: ", farmsToFetch[index])
    console.log("xxxx lpTokenBalanceMC: ", lpTokenBalanceMC)
    console.log("xxxx lpTotalSupply: ", lpTotalSupply)

    // const [info, totalAllocPoint] = masterChefResult[index]

    // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))
    console.log("xxxx lpTokenRatio: ", lpTokenRatio)

    // Raw amount of token in the LP, including those not staked
    const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
    console.log("xxxx tokenAmountTotal: ", tokenAmountTotal)
    const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))
    console.log("xxxx quoteTokenAmountTotal: ", quoteTokenAmountTotal)

    // Amount of quoteToken in the LP that are staked in the MC
    const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)
    console.log("xxxx quoteTokenAmountMc: ", quoteTokenAmountMc)

    // Total staked in LP, in quote token value
    const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))
    console.log("xxxx lpTotalInQuoteToken: ", lpTotalInQuoteToken)

    console.log("xxxx end: ")

    // const allocPoint = info ? new BigNumber(info.allocPoint?._hex) : BIG_ZERO
    const allocPoint = BIG_ZERO
    // const poolWeight = totalAllocPoint ? allocPoint.div(new BigNumber(totalAllocPoint)) : BIG_ZERO
    const poolWeight = BIG_ZERO

    return {
      ...farm,
      token: farm.token,
      quoteToken: farm.quoteToken,
      tokenAmountTotal: tokenAmountTotal.toJSON(),
      lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
      tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
      poolWeight: poolWeight.toJSON(),
      multiplier: `${allocPoint.div(100).toString()}X`,
    }
  })
}

export default fetchFarms
