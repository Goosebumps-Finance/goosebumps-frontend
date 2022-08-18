import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_SERVER } from 'config'
import { ChainIdStorageName } from 'config/constants'
import { HomeState } from 'state/types'
import { getAsyncData } from 'utils/requester'

const initialState: HomeState = {
    network: { label: 'BSC', value: 'bsc', chainId: 56},
    searchKey: '',
    addressType: null
}

export const fetchAddressType = createAsyncThunk(
  'home/fetchAddressType',
  async (args: {address: string, network:string}, thunkAPI) => {
    const res = await getAsyncData(`${API_SERVER}api/Search/IsToken`, {address: args.address, network: args.network});
    if(res) {
      return res.result.contractType;
    }
    return null;
  }
)

export const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setNetworkInfo: (state, action) => {
      // console.log("setNetworkInfo action=", action.payload)
      window.localStorage.setItem(ChainIdStorageName, `${action.payload.network.chainId}`)
      if(action.payload.searchKey !== undefined)
        state.searchKey = action.payload.searchKey
      if(action.payload.network)
        state.network = action.payload.network
    },
    setAddressType: (state, action) => {
      // console.log("setAddressType, action=", action)
      state.addressType = action.payload.addressType
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAddressType.fulfilled, (state, action) => {
      state.addressType = action.payload
    })
  }
})

export const { setNetworkInfo, setAddressType } = HomeSlice.actions

export default HomeSlice.reducer
