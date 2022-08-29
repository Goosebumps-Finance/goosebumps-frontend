import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { useMasterchef } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

// const useApproveFarm = (lpContract: Contract) => {
//   const masterChefContract = useMasterchef()
//   const { callWithGasPrice } = useCallWithGasPrice()
//   const handleApprove = useCallback(async () => {
//     const tx = await callWithGasPrice(lpContract, 'approve', [masterChefContract.address, ethers.constants.MaxUint256])
//     const receipt = await tx.wait()
//     return receipt.status
//   }, [lpContract, masterChefContract, callWithGasPrice])

//   return { onApprove: handleApprove }
// }

const useApproveFarm = (lpContract: Contract, targetAddress?: string) => {
  const masterChefContract = useMasterchef()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    const tx = await callWithGasPrice(lpContract, 'approve', [targetAddress ?? masterChefContract.address, ethers.constants.MaxUint256])
    const receipt = await tx.wait()
    return receipt.status
  }, [lpContract, masterChefContract, targetAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveFarm
