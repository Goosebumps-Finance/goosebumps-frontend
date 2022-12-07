import { LOG_VIEW } from 'config'
import { SerializedFarmConfig } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from '../../utils/bigNumber'
import { fetchPublicFarmsData } from './fetchPublicFarmData'
import { fetchMasterChefData } from './fetchMasterChefData'

const fetchFarms = async (farmsToFetch: SerializedFarmConfig[]) => {
  const farmResult = await fetchPublicFarmsData(farmsToFetch)
  // LOG_VIEW("farmResult: ", farmResult)
  
  // const masterChefResult = farmsToFetch[0].targetAddresses !== undefined ? null : (await fetchMasterChefData(farmsToFetch))

  return farmsToFetch.map((farm, index) => {
    const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
      farmResult[index]
    // LOG_VIEW("xxxx start: ")
    // LOG_VIEW("xxxx farmsToFetch[index].lpSymbol: ", farmsToFetch[index].lpSymbol)
    // LOG_VIEW("xxxx farmsToFetch[index]: ", farmsToFetch[index])
    // LOG_VIEW("xxxx lpTokenBalanceMC: ", lpTokenBalanceMC)
    // LOG_VIEW("xxxx lpTotalSupply: ", lpTotalSupply)

    // const [info, totalAllocPoint] = masterChefResult[index]

    // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))
    // LOG_VIEW("xxxx lpTokenRatio: ", lpTokenRatio)

    // Raw amount of token in the LP, including those not staked
    const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals))
    // LOG_VIEW("xxxx tokenAmountTotal: ", tokenAmountTotal)
    const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))
    // LOG_VIEW("xxxx quoteTokenAmountTotal: ", quoteTokenAmountTotal)

    // Amount of quoteToken in the LP that are staked in the MC
    const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)
    // LOG_VIEW("xxxx quoteTokenAmountMc: ", quoteTokenAmountMc)

    // Total staked in LP, in quote token value
    const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))
    // LOG_VIEW("xxxx lpTotalInQuoteToken: ", lpTotalInQuoteToken)

    // LOG_VIEW("xxxx end: ")

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
