import useInterval from 'hooks/useInterval'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { getChainId } from 'utils/getChainId'
import { getSimpleRpcProvider /* , simpleRpcProvider */ } from 'utils/providers'
import { setBlock } from '.'
import { State } from '../types'

export const usePollBlockNumber = (refreshTime = 6000) => {
  const dispatch = useAppDispatch()
  const isWindowVisible = useIsWindowVisible()

  useInterval(
    () => {
      const fetchBlock = async () => {
        const chainId = getChainId()
        const rpcProvider = getSimpleRpcProvider(chainId)
        const blockNumber = await rpcProvider.getBlockNumber()
        dispatch(setBlock({blockNumber, chainId}))
      }

      fetchBlock()
    },
    isWindowVisible ? refreshTime : null,
    true,
  )
}

export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
