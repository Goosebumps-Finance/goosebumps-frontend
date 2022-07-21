import { useCallback } from 'react'
import { stakeFarm } from 'utils/calls'
import { useMasterchef, useStakingContract } from 'hooks/useContract'

// const useStakeFarmsOld = (pid: number) => {
//   const masterChefContract = useMasterchef()

//   const handleStake = useCallback(
//     async (amount: string) => {
//       const txHash = await stakeFarm(masterChefContract, pid, amount)
//       console.info(txHash)
//     },
//     [masterChefContract, pid],
//   )

//   return { onStake: handleStake }
// }

const useStakeFarms = (pid: number) => {
  const stakingContract = useStakingContract(pid)

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stakeFarm(stakingContract, amount)
      console.info(txHash)
    },
    [stakingContract],
  )

  return { onStake: handleStake }
}

export default useStakeFarms
