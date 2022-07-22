import { ChainIdStorageName } from 'config/constants'
import useInterval from 'hooks/useInterval'
import useIsWindowVisible from 'hooks/useIsWindowVisible'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { getSimpleRpcProvider /* , simpleRpcProvider */ } from 'utils/providers'
import { setBlock } from '.'
import { State } from '../types'

export const usePollBlockNumber = (refreshTime = 6000) => {
  const dispatch = useAppDispatch()
  const isWindowVisible = useIsWindowVisible()

  useInterval(
    () => {
      const fetchBlock = async () => {
        let chainId = parseInt(window.localStorage.getItem(ChainIdStorageName), 10)
        if(Number.isNaN(chainId)) chainId = 97
        const rpcProvider = getSimpleRpcProvider(chainId)
        const blockNumber = await rpcProvider.getBlockNumber()
        dispatch(setBlock(blockNumber))
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
