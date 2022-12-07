import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { ChainId } from '@goosebumps/zx-sdk'
import linq from 'linq'
import { API_SERVER, BASE_URL, LOG_VIEW } from 'config'
import { HomeState } from 'state/types'
import { getChainId } from 'utils/getChainId'
import { getAsyncData } from 'utils/requester'
import networks from 'config/constants/networks'
// import tokens from 'config/constants/tokens'

const getInitialState = () => {
  const initialNetwork = linq.from(networks).where((x) => x.chainId === getChainId()).single()
  return { label: initialNetwork.Display, value: initialNetwork.Name, chainId: initialNetwork.chainId }
}

// const isStakeOrFarm = () => {
//   if (window?.location?.href) {
//     switch (window?.location?.href) {
//       case `${BASE_URL}/farms`:
//       case `${BASE_URL}/stake`:
//         return true;
//       default:
//         return false;
//     }
//   } else {
//     // eslint-disable-next-line no-alert
//     window.alert(`Please refresh website to switch network correctly!`)
//     return false;
//   }
// }

// const isChartOrPortfolio = () => {
//   const isChart: boolean = window?.location?.href?.toLowerCase().indexOf("charts") !== -1
//   const isPortfolio: boolean = window?.location?.href?.toLowerCase().indexOf("portfolio-tracker") !== -1
//   return isChart || isPortfolio
// }

const initialState: HomeState = {
  network: getInitialState(), // TODO prince
  searchKey: '',
  addressType: null,
  timer: null
}

// let timer = null;

export const fetchAddressType = createAsyncThunk(
  'home/fetchAddressType',
  async (args: { address: string, network: string }, thunkAPI) => {
    const res = await getAsyncData(`${API_SERVER}api/Search/IsToken`, { address: args.address, network: args.network });
    if (res) {
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
      // LOG_VIEW("setNetworkInfo state.timer =", state.timer)
      if (state.timer) {
        // LOG_VIEW("setNetworkInfo clearTimeout=", state.timer)
        clearTimeout(state.timer);
      }
      state.timer = action.payload.timer
    },
    setNetworkInfo: (state, action) => {
      // LOG_VIEW("setNetworkInfo action=", action.payload)
      // let chainId: number
      // switch (action.payload.network.chainId) {
      //   // case ChainId.ETHEREUM:
      //   // case ChainId.POLYGON:
      //   case ChainId.MAINNET:
      //   case ChainId.TESTNET:
      //     chainId = action.payload.network.chainId
      //     break
      //   default:
      //     chainId = getChainId()
      //     break
      // }
      // window.localStorage.setItem("SELECTED_CHAIN_ID", `${chainId}`)
      // LOG_VIEW("setNetworkInfo payload =", action.payload);
      window.localStorage.setItem("SELECTED_CHAIN_ID", `${action.payload.network.chainId}`)
      if (action.payload.searchKey !== undefined) {
        state.searchKey = action.payload.searchKey
        // const setSearchKey = (state1, action1) => {
        //   LOG_VIEW("setNetworkInfo state1=", state1, "action1=", action1)
        //   // state1.searchKey = action1.payload.searchKey;
        //   return {
        //     searchKey: action1.payload.searchKey
        //   }
        // }
        // clearTimeout(timer);
        // timer = setTimeout(() => setSearchKey(state, action), 1000)
      }
      if (action.payload.network && action.payload.network.chainId !== state.network.chainId) {
        // LOG_VIEW("setNetworkInfo: network changed")
        state.network = action.payload.network
        // if (isStakeOrFarm()) {
        //   window?.location?.reload()
        // }
        if (window?.location?.href?.toLowerCase().indexOf("charts") !== -1) {
          // LOG_VIEW("setNetworkInfo on charts")
          window.location.href = `${BASE_URL}/charts`
        } else if (window?.location?.href?.toLowerCase().indexOf("portfolio-tracker") !== -1) {
          // LOG_VIEW("setNetworkInfo on portfolio-tracker")
          window.location.href = `${BASE_URL}/portfolio-tracker`
          // window.alert(`Please visit portfolio tracker page again after chain switching!`)
        } else if (window?.location?.href) {
          // LOG_VIEW("setNetworkInfo on other part")
          window?.location?.reload()
        } else {
          // LOG_VIEW("setNetworkInfo on exception")
          // eslint-disable-next-line no-alert
          window.alert(`Please refresh website to switch network correctly!`)
        }
      }
    },
    setAddressType: (state, action) => {
      // LOG_VIEW("setAddressType, action=", action)
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
