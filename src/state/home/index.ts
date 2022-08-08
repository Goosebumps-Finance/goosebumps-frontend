import { createSlice } from '@reduxjs/toolkit'
import { ChainIdStorageName } from 'config/constants'
import { HomeState } from 'state/types'

const initialState: HomeState = {
    network: { label: 'BSC', value: 'bsc', chainId: 56},
    searchKey: ''
}

export const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setNetworkInfo: (state, action) => {
      console.log("setNetworkInfo action=", action.payload)
      window.localStorage.setItem(ChainIdStorageName, `${action.payload.network.chainId}`)
      if(action.payload.searchKey)
        state.searchKey = action.payload.searchKey
      if(action.payload.network)
        state.network = action.payload.network
    }
  },
})

export const { setNetworkInfo } = HomeSlice.actions

export default HomeSlice.reducer
