import { createSlice } from "@reduxjs/toolkit";
import {
    HomeState
} from 'state/types'

const initialState: HomeState = {
    network: { label: '', value: ''},
    searchKey: ''
}

export const HomeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setNetworkInfo: (state, action) => {
            return action.payload
        }
    }
})

export const { setNetworkInfo } = HomeSlice.actions

export default HomeSlice.reducer