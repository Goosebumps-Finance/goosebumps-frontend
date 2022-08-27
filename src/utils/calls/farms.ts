import BigNumber from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { BIG_TEN } from 'utils/bigNumber'
import getGasPrice from 'utils/getGasPrice'
import { estimateGas } from './estimateGas'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT * 1.5,
}

export const stakeFarmOld = async (masterChefContract: Contract, pid: number, amount: string) => {
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

export const stakeFarm = async (stakingContract: Contract, amount: string, decimals?: number) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(decimals ? BIG_TEN.pow(decimals) : DEFAULT_TOKEN_DECIMAL).toString()

  const estimatedGas = estimateGas(stakingContract, 'stake', [value], 2000)
  // console.log("stakeFarm estimatedGas=", estimatedGas)
  const tx = await stakingContract.stake(value, { gasLimit: estimatedGas, gasPrice })
  // const tx = await stakingContract.stake(value, { ...options, gasPrice })
  // const tx = await stakingContract.stake(value, { gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarmOld = async (masterChefContract: Contract, pid: number, amount: string) => {
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

export const unstakeFarm = async (stakingContract: Contract, amount: string, decimals?: number) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(decimals ? BIG_TEN.pow(decimals) : DEFAULT_TOKEN_DECIMAL).toString()

  const estimatedGas = estimateGas(stakingContract, 'unstake', [value], 2000)
  // console.log("unstakeFarm estimatedGas=", estimatedGas)
  const tx = await stakingContract.unstake(value, { gasLimit: estimatedGas, gasPrice })
  // const tx = await stakingContract.unstake(value, { ...options, gasPrice })
  // const tx = await stakingContract.unstake(value, { gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarmOld = async (masterChefContract: Contract, pid: number) => {
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

export const harvestFarm = async (stakingContract: Contract) => {
  const gasPrice = getGasPrice()

  const estimatedGas = estimateGas(stakingContract, 'withdrawRewards', [], 2000)
  // console.log("harvestFarm estimatedGas=", estimatedGas)
  const tx = await stakingContract.withdrawRewards({ gasLimit: estimatedGas, gasPrice })
  // const tx = await stakingContract.withdrawRewards({ ...options, gasPrice })
  // const tx = await stakingContract.withdrawRewards({ gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}