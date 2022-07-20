import { createSlice } from '@reduxjs/toolkit'
import { ChainIdStorageName } from 'config/constants'
import { HomeState } from 'state/types'

const initialState: HomeState = {
    network: { label: 'BSC Testnet', value: 'bsctestnet', chainId: 97},
    searchKey: ''
}

export const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setNetworkInfo: (state, action) => {
      // console.log("setNetworkInfo action=", action.payload)
      window.localStorage.setItem(ChainIdStorageName, `${action.payload.network.chainId}`)
      return action.payload
    },
  },
})

export const { setNetworkInfo } = HomeSlice.actions

export default HomeSlice.reducer
