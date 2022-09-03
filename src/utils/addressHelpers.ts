// import { ChainId } from '@goosebumps/zx-sdk'
import addresses from 'config/constants/contracts'
import { Address } from 'config/constants/types'
// import { constant } from 'lodash'
import { VaultKey } from 'state/types'
import { getChainId } from './getChainId'

export const getAddress = (address: Address): string => {
  return address[getChainId()]
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getLotteryV2Address = () => {
  return getAddress(addresses.lotteryV2)
}
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile)
}
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits)
}
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory)
}
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund)
}
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo)
}
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial)
}
export const getTradingCompetitionAddress = () => {
  return getAddress(addresses.tradingCompetition)
}
export const getTradingCompetitionAddressV2 = () => {
  return getAddress(addresses.tradingCompetitionV2)
}
export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft)
}

export const getVaultPoolAddress = (vaultKey: VaultKey) => {
  if (!vaultKey) {
    return null
  }
  return getAddress(addresses[vaultKey])
}

export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault)
}
export const getIfoPoolAddress = () => {
  return getAddress(addresses.ifoPool)
}
export const getPredictionsAddress = () => {
  return getAddress(addresses.predictions)
}
export const getChainlinkOracleAddress = () => {
  return getAddress(addresses.chainlinkOracle)
}
export const getBunnySpecialCakeVaultAddress = () => {
  return getAddress(addresses.bunnySpecialCakeVault)
}
export const getBunnySpecialPredictionAddress = () => {
  return getAddress(addresses.bunnySpecialPrediction)
}
export const getBunnySpecialLotteryAddress = () => {
  return getAddress(addresses.bunnySpecialLottery)
}
export const getBunnySpecialXmasAddress = () => {
  return getAddress(addresses.bunnySpecialXmas)
}
export const getFarmAuctionAddress = () => {
  return getAddress(addresses.farmAuction)
}
export const getAnniversaryAchievement = () => {
  return getAddress(addresses.AnniversaryAchievement)
}
export const getNftMarketAddress = () => {
  return getAddress(addresses.nftMarket)
}
export const getNftSaleAddress = () => {
  return getAddress(addresses.nftSale)
}
export const getPancakeSquadAddress = () => {
  return getAddress(addresses.pancakeSquad)
}
export const getStakingAddress = () => {
  return getAddress(addresses.staking)
}
export const getStakingWithFixedLockTimeAddress = () => {
  return getAddress(addresses.stakingWithFixedLockTime)
}
export const getStakingWithReflectionAddress = () => {
  return getAddress(addresses.stakingWithReflection)
}
export const getStakingWithReflectionAndLockAddress = () => {
  return getAddress(addresses.stakingWithReflectionAndLock)
}
export const getFarmingAddress = () => {
  return getAddress(addresses.farming)
}
export const getFarmingBUSDAddress = () => {
  return getAddress(addresses.farmingBUSD)
}
export const getFarmingWithFixedLockTimeAddress = () => {
  return getAddress(addresses.farmingWithFixedLockTime)
}
export const getFarmingWithFixedLockTimeBUSDAddress = () => {
  return getAddress(addresses.farmingWithFixedLockTimeBUSD)
}
