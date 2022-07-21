import { useCallback } from 'react'
import { harvestFarm } from 'utils/calls'
import { useMasterchef, useStakingContract } from 'hooks/useContract'

// const useHarvestFarmOld = (farmPid: number) => {
//   const masterChefContract = useMasterchef()

//   const handleHarvest = useCallback(async () => {
//     await harvestFarm(masterChefContract, farmPid)
//   }, [farmPid, masterChefContract])

//   return { onReward: handleHarvest }
// }

const useHarvestFarm = (farmPid: number) => {
  const stakingContract = useStakingContract(farmPid)

  const handleHarvest = useCallback(async () => {
    await harvestFarm(stakingContract)
  }, [stakingContract])

  return { onReward: handleHarvest }
}

export default useHarvestFarm
