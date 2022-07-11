import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { mockData } from "views/PortfolioTracker/mockData";

// export interface TokenInfoProps {
//     balance: number
//     deadBalance: number
//     isETH: boolean
//     lp: number
//     marketCap: number
//     price: number
//     reserv: {
//         token0: number
//         token1: number
//     }
//     supply: {
//         circulation: number
//         total: number
//     }
//     token: string
//     rewards?: number
// }

export interface TokenItemProps {
    info?: any
    pair: {
        smartContract: {
            address: {
                address: string
            };
        };
        buyCurrency: {
            address: string
            name: string
            symbol: string
        };
        sellCurrency: {
            address: string
            name: string
            symbol: string
        };
    };
    trades: {
        dateTime: string
        tx: string
        priceUSD: number
        tokenAmount: number
        holdingAmount: number
        transactionType: number
        buyPrices: any[]
        avarageBuyPriceOfHoldings?: number
        profit?: number
    }[];
    volume: number
    ins: number
    outs: number
    avarageBuyPriceOfHoldings?: number
    balance?: number
}

const initialState = {
    tokens: []
}

export const fetchTokenData = createAsyncThunk(
    'portfolio/fetchTokenData',
    async (args:{network:string, address:string}, thunkAPI) => {
        // console.log("portfolio/fetchTokenData network = ", args.network, " address = ", args.address);
        // tokens = await Requester.postAsync(
        //     `${config.API_SERVER}api/Portfolio/GetTrades`,
        //     { network: network.Name },
        //     addresses
        //   );
        // const response = await fetch(`https://reqres.in/api/users/${userId}`)
        const response = mockData;
        return response;
    }
)

export const portfolioSlice = createSlice({
    name: 'Portfolio',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTokenData.fulfilled, (state, action) => {
            state.tokens = action.payload
        })
    }
})

export default portfolioSlice.reducer