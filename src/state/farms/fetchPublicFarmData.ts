import erc20 from 'config/abi/erc20.json'
import { chunk } from 'lodash'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarm } from '../types'
import { SerializedFarmConfig } from '../../config/constants/types'

const fetchFarmCalls = (farm: SerializedFarm) => {
  // const { lpAddresses, token, quoteToken } = farm
  const { lpAddresses, treasuryAddresses, token, quoteToken } = farm
  const lpAddress = getAddress(lpAddresses)
  const treasuryAddress = getAddress(treasuryAddresses)
  // console.log("xxxx treasuryAddress: ", treasuryAddress !== undefined ? treasuryAddress : getMasterChefAddress())
  return [
    // Balance of token in the LP contract
    {
      address: token.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: quoteToken.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    // Balance of LP tokens in the staking contract
    {
      address: lpAddress,
      name: 'balanceOf',
      params: [treasuryAddress??getMasterChefAddress()],
    },
    // Total supply of LP tokens
    {
      address: lpAddress,
      name: 'totalSupply',
    },
    // Token decimals
    {
      address: token.address,
      name: 'decimals',
    },
    // Quote token decimals
    {
      address: quoteToken.address,
      name: 'decimals',
    },
  ]
}

export const fetchPublicFarmsData = async (farms: SerializedFarmConfig[]): Promise<any[]> => {
  const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm))
  console.log("farmCalls: ", farmCalls)
  const chunkSize = farmCalls.length / farms.length
  const farmMultiCallResult = await multicallv2(erc20, farmCalls)
  // console.log("xxxx targetAddress: result1", farmMultiCallResult)
  // console.log("xxxx targetAddress: result", chunk(farmMultiCallResult, chunkSize))
  return chunk(farmMultiCallResult, chunkSize)
}
