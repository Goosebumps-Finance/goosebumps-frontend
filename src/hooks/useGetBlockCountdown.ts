import { useEffect, useRef, useState } from 'react'
import { BSC_BLOCK_TIME } from 'config'
import { getSimpleRpcProvider /* , simpleRpcProvider */ } from 'utils/providers'
import { ChainIdStorageName } from 'config/constants'

/**
 * Returns a countdown in seconds of a given block
 */
const useBlockCountdown = (blockNumber: number) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  useEffect(() => {
    const startCountdown = async () => {
      let chainId = parseInt(window.localStorage.getItem(ChainIdStorageName), 10)
      if(Number.isNaN(chainId)) chainId = 56
      const rpcProvider = getSimpleRpcProvider(chainId)
      const currentBlock = await rpcProvider.getBlockNumber()

      if (blockNumber > currentBlock) {
        setSecondsRemaining((blockNumber - currentBlock) * BSC_BLOCK_TIME)

        // Clear previous interval
        if (timer.current) {
          clearInterval(timer.current)
        }

        timer.current = setInterval(() => {
          setSecondsRemaining((prevSecondsRemaining) => {
            if (prevSecondsRemaining === 1) {
              clearInterval(timer.current)
            }

            return prevSecondsRemaining - 1
          })
        }, 1000)
      }
    }

    startCountdown()

    return () => {
      clearInterval(timer.current)
    }
  }, [setSecondsRemaining, blockNumber, timer])

  return secondsRemaining
}

export default useBlockCountdown
