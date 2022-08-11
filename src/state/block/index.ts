import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BlockState } from '../types'

const initialState: BlockState = { currentBlock: 0, initialBlock: 0, chainId: 56 }

export const blockSlice = createSlice({
  name: 'Block',
  initialState,
  reducers: {
    setBlock: (state, action) => {
      if (state.initialBlock === 0) {
        state.initialBlock = action.payload.blockNumber
      }

      state.currentBlock = action.payload.blockNumber
      state.chainId = action.payload.chainId
    },
  },
})

// Actions
export const { setBlock } = blockSlice.actions

export default blockSlice.reducer
