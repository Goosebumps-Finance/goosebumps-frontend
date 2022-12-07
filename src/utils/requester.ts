import { BigNumber } from "@ethersproject/bignumber"
import { ChainId } from "@goosebumps/zx-sdk"
import { SWAP_FEE_0X, LOG_VIEW } from 'config'
import { ZxFetchResult } from 'config/constants/types'
import getGasPrice from './getGasPrice'

export const requestUrls = {
  [ChainId.MAINNET]: "https://bsc.api.0x.org/",
  [ChainId.TESTNET]: "https://bsctestnet.api.0x.org/", // doesn't supported
  [ChainId.ETHEREUM]: "https://api.0x.org/",
  [ChainId.POLYGON]: "https://polygon.api.0x.org/",
  3: "https://ropsten.api.0x.org/",
}

export const getAsyncData = (url, params) => {
  if (params !== undefined && params !== null) {
    url = `${url}?${new URLSearchParams(params)}`
  }
  // LOG_VIEW('getAsyncData url = ', url, ' params=', params)
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json().then((j) => j))
}

export const postAsyncData = (url, params, data) => {
  if (params !== undefined && params !== null) {
    url = `${url}?${new URLSearchParams(params)}`
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((res) => res.json().then((j) => j))
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export async function zxTradeExactIn(
  chainId: number,
  sellTokenAddress: string,
  buyTokenAddress: string,
  sellTokenAmount: BigNumber,
  slippage: number,
): Promise<ZxFetchResult> {
  // LOG_VIEW("zxTradeExactIn: ", slippage)
  let response: any | null = null
  let fetchError: string | null = null
  try {
    response = await getAsyncData(`${requestUrls[chainId]}swap/v1/quote`, {
      sellToken: sellTokenAddress,
      buyToken: buyTokenAddress,
      sellAmount: sellTokenAmount.mul(10000 - SWAP_FEE_0X).div(10000),
      slippagePercentage: slippage / 10000,
      gasPrice: getGasPrice(),
    });
    // LOG_VIEW("zxTradeExactIn", response)
  } catch (err) {
    LOG_VIEW("zxTradeExactIn fetch err", err)
  }

  if (response) {
    if (!response.price) {
      if (response.reason) {
        if (response.reason === "IncompleteTransformERC20Error") {
          fetchError = "Insufficient Slippage"
        }
        else if (response.validationErrors) {
          fetchError = `${response.reason}: ${response.validationErrors[0].reason}`
        }
        else if (response.values) {
          fetchError = `${response.reason}: ${response.values.message}`
        }
        else {
          fetchError = response.reason
        }
      }
      else {
        fetchError = "Unknown error"
      }
    }
  }
  else {
    fetchError = "Unknown error"
  }

  return {
    response,
    sellAmount: sellTokenAmount,
    buyAmount: response ? BigNumber.from(response.buyAmount) : null,
    fetchError
  }
}

/**
 * Returns the best trade for the exact amount of tokens in to the given token out
 */
export async function zxTradeExactOut(
  chainId: number,
  sellTokenAddress: string,
  buyTokenAddress: string,
  buyTokenAmount: BigNumber,
  slippage: number
): Promise<ZxFetchResult> {
  // LOG_VIEW("zxTradeExactOut: ", slippage)
  let response: any | null = null
  let fetchError: string | null = null
  try {
    response = await getAsyncData(`${requestUrls[chainId]}swap/v1/quote`, {
      sellToken: sellTokenAddress,
      buyToken: buyTokenAddress,
      buyAmount: buyTokenAmount,
      slippagePercentage: slippage / 10000,
      gasPrice: getGasPrice(),
    });
    // LOG_VIEW("zxTradeExactOut", response)
  } catch (err) {
    LOG_VIEW("zxTradeExactOut fetch err", err)
  }

  if (response) {
    if (!response.price) {
      if (response.reason) {
        if (response.reason === "IncompleteTransformERC20Error") {
          fetchError = "Insufficient Slippage"
        }
        else if (response.validationErrors) {
          fetchError = `${response.reason}: ${response.validationErrors[0].reason}`
        }
        else if (response.values) {
          fetchError = `${response.reason}: ${response.values.message}`
        }
        else {
          fetchError = response.reason
        }
      }
      else {
        fetchError = "Unknown error"
      }
    }
  }
  else {
    fetchError = "Unknown error"
  }

  return {
    response,
    sellAmount: response ? (BigNumber.from(response.sellAmount).mul(10000).div(10000 - SWAP_FEE_0X)) : null,
    buyAmount: buyTokenAmount,
    fetchError
  }
}
