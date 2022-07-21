import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { BIG_TEN } from 'utils/bigNumber'
import getGasPrice from 'utils/getGasPrice'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarmOld = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (pid === 0) {
    const tx = await masterChefContract.enterStaking(value, { ...options, gasPrice })
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.deposit(pid, value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const stakeFarm = async (stakingContract, amount, decimals?) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(decimals? BIG_TEN.pow(decimals) : DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await stakingContract.stake(value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarmOld = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (pid === 0) {
    const tx = await masterChefContract.leaveStaking(value, { ...options, gasPrice })
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.withdraw(pid, value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (stakingContract, amount, decimals?) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(decimals? BIG_TEN.pow(decimals) : DEFAULT_TOKEN_DECIMAL).toString()
  const tx = await stakingContract.unstake(value, { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarmOld = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()
  if (pid === 0) {
    const tx = await masterChefContract.leaveStaking('0', { ...options, gasPrice })
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.deposit(pid, '0', { ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (stakingContract) => {
  const gasPrice = getGasPrice()
  const tx = await stakingContract.withdrawRewards({ ...options, gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}