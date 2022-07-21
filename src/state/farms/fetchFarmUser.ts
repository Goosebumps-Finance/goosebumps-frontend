import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import stakingABI from 'config/abi/staking.json'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { SerializedFarmConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const gooseFarmFlag = (farmsToFetch.length > 0 && farmsToFetch[0].targetAddresses)

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    const targetAddress = getAddress(farm.targetAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, gooseFarmFlag ? targetAddress : masterChefAddress] }
  })

  const rawLpAllowances = await multicall<BigNumber[]>(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const gooseFarmFlag = (farmsToFetch.length > 0 && farmsToFetch[0].targetAddresses)
  
  const calls = farmsToFetch.map((farm) => {
    const targetAddress = getAddress(farm.targetAddresses)
    
    return {
      address: gooseFarmFlag ? targetAddress : masterChefAddress,
      name: gooseFarmFlag ? 'staker' : 'userInfo',
      params: gooseFarmFlag ? [account] : [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall( gooseFarmFlag ? stakingABI : masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: SerializedFarmConfig[]) => {
  const masterChefAddress = getMasterChefAddress()

  const gooseFarmFlag = (farmsToFetch.length > 0 && farmsToFetch[0].targetAddresses)

  const calls = farmsToFetch.map((farm) => {
    const targetAddress = getAddress(farm.targetAddresses)
    
    return {
      address: gooseFarmFlag ? targetAddress : masterChefAddress,
      name: gooseFarmFlag ? 'getTotalRewards' : 'pendingCake',
      params: gooseFarmFlag ? [account] : [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(gooseFarmFlag ? stakingABI : masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}
