import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API_SERVER } from 'config'
import { HomeState } from 'state/types'
import { getChainId } from 'utils/getChainId'
import { getAsyncData } from 'utils/requester'

const initialState: HomeState = {
    network: { label: 'BSC', value: 'bsc', chainId: getChainId()}, // TODO prince
    searchKey: '',
    addressType: null,
    timer: null
}

// let timer = null;

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

// export const setNetworkInfo = createAsyncThunk(
//   'home/setNetworkInfo',
//   async (args: {searchKey: string, network:any} , thunkAPI) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       return {
//         searchKey,
//         network
//       }
//     }, 1000);
//   }
// )

export const HomeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setTimer: (state, action) => {
      console.log("setNetworkInfo state.timer =", state.timer)
      if(state.timer) {
        console.log("setNetworkInfo clearTimeout=", state.timer)
        clearTimeout(state.timer);
      }
      state.timer = action.payload.timer
    },
    setNetworkInfo: (state, action) => {
      // console.log("setNetworkInfo action=", action.payload)
      window.localStorage.setItem("SELECTED_CHAIN_ID", `${action.payload.network.chainId}`)
      console.log("setNetworkInfo payload =", action.payload);
      if(action.payload.searchKey !== undefined) {
        state.searchKey = action.payload.searchKey
        // const setSearchKey = (state1, action1) => {
        //   console.log("setNetworkInfo state1=", state1, "action1=", action1)
        //   // state1.searchKey = action1.payload.searchKey;
        //   return {
        //     searchKey: action1.payload.searchKey
        //   }
        // }
        // clearTimeout(timer);
        // timer = setTimeout(() => setSearchKey(state, action), 1000)
      }
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

export const { setNetworkInfo, setAddressType, setTimer } = HomeSlice.actions

export default HomeSlice.reducer
