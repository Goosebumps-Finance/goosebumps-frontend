import { useCallback } from 'react'
import { unstakeFarm } from 'utils/calls'
import { useMasterchef, useStakingContract } from 'hooks/useContract'

// const useUnstakeFarms = (pid: number) => {
//   const masterChefContract = useMasterchef()

//   const handleUnstake = useCallback(
//     async (amount: string) => {
//       await unstakeFarm(masterChefContract, pid, amount)
//     },
//     [masterChefContract, pid],
//   )

//   return { onUnstake: handleUnstake }
// }

const useUnstakeFarms = (pid: number) => {
  const stakingContract = useStakingContract(pid)

  const handleUnstake = useCallback(
    async (amount: string) => {
      await unstakeFarm(stakingContract, amount)
    },
    [stakingContract],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakeFarms
