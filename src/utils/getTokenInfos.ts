import { ethers } from 'ethers'
import { Contract, Provider } from 'ethers-multicall'
import pairAbi from 'config/abi/pair.json'
import tokenAbi from 'config/abi/token.json'
import { calculatePricescaleNew } from './numberHelpers'

export const getTokenPricescale = async (pair, network) => {
  const provider = new ethers.providers.JsonRpcProvider(network.RPC)
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()

  const calls = []

  const pairContract = new Contract(pair.smartContract.address.address, pairAbi)
  const buyContract = new Contract(pair.buyCurrency.address, tokenAbi)
  const sellContract = new Contract(pair.sellCurrency.address, tokenAbi)
  const ethUsdPairContract = new Contract(network.USD.Pair, pairAbi)

  calls.push(pairContract.getReserves())
  calls.push(buyContract.decimals())
  calls.push(sellContract.decimals())
  calls.push(ethUsdPairContract.getReserves())

  const [reserves, buyDecimals, sellDecimals, ethUsdReserves] = await ethcallProvider.all(calls)

  let price = formatUnits(reserves._reserve1, sellDecimals) / formatUnits(reserves._reserve0, buyDecimals)

  if (network.USDs.find((x) => x.toLowerCase() === pair.buyCurrency.address) && price > 2) {
    price = 1 / price
  }
  if (pair.sellCurrency.address === network.Currency.Address) {
    price *=
      formatUnits(ethUsdReserves._reserve1, network.USD.Decimals) /
      formatUnits(ethUsdReserves._reserve0, network.Currency.Decimals)
  }
  return calculatePricescaleNew(price)
}

export const getTokenInfos = async (pairs, network, addresses = []) => {
  const provider = new ethers.providers.JsonRpcProvider(network.RPC)
  const ethcallProvider = new Provider(provider)
  await ethcallProvider.init()

  const calls = []

  pairs.map((pair) => {
    const pairContract = new Contract(pair.smartContract.address.address, pairAbi)
    const buyContract = new Contract(pair.buyCurrency.address, tokenAbi)
    const sellContract = new Contract(pair.sellCurrency.address, tokenAbi)

    calls.push(pairContract.getReserves())
    calls.push(buyContract.decimals())
    calls.push(sellContract.decimals())
    calls.push(buyContract.balanceOf('0x000000000000000000000000000000000000dEaD'))
    calls.push(buyContract.totalSupply())
    calls.push(pairContract.token0())
    addresses.map((address) => {
      calls.push(buyContract.balanceOf(ethers.utils.getAddress(address)))
      return address
    })

    return pair
  })

  const ethUsdPriceContract = new Contract(network.USD.Pair, pairAbi)
  calls.push(ethUsdPriceContract.getReserves())

  const responses = await ethcallProvider.all(calls)
  const ethUsdReserves = responses[responses.length - 1]
  const result = {
    infos: [],
    ethPrice:
      formatUnits(ethUsdReserves._reserve1, network.USD.Decimals) /
      formatUnits(ethUsdReserves._reserve0, network.Currency.Decimals),
  }
  const callCounts = (calls.length - 1) / pairs.length

  pairs.map((pair, index) => {
    const isETH =
      pair.sellCurrency.address === network.Currency.Address || pair.buyCurrency.address === network.Currency.Address
    const isUSD =
      network.USDs.find((x) => x.toLowerCase() === pair.buyCurrency.address) ||
      network.USDs.find((x) => x.toLowerCase() === pair.sellCurrency.address)
    const reserves = responses[index * callCounts]
    const buyDecimals = responses[index * callCounts + 1]
    const sellDecimals = responses[index * callCounts + 2]
    const deadBalance = formatUnits(responses[index * callCounts + 3], buyDecimals)
    const supply = formatUnits(responses[index * callCounts + 4], buyDecimals)
    const circulationSupply = supply - deadBalance
    const token0 = responses[index * callCounts + 5]
    const lp = formatUnits(reserves._reserve1, sellDecimals)

    const reserv = {
      token0: formatUnits(reserves._reserve0, sellDecimals),
      token1: formatUnits(reserves._reserve1, buyDecimals),
    }

    let price

    if (token0.toLowerCase() === pair.sellCurrency.address) {
      price = formatUnits(reserves._reserve0, sellDecimals) / formatUnits(reserves._reserve1, buyDecimals)
    } else {
      price = formatUnits(reserves._reserve1, sellDecimals) / formatUnits(reserves._reserve0, buyDecimals)
    }

    if (!(isETH && isUSD) && isUSD) {
      price = 1 / price
    }

    const marketCap = circulationSupply * price
    if (addresses) {
      let balance = 0
      for (let i = 0; i < addresses.length; i++) {
        balance += formatUnits(responses[index * callCounts + 6 + i], buyDecimals)
      }
      result.infos.push({
        reserv,
        deadBalance,
        token: pair.buyCurrency.address,
        supply: {
          total: supply,
          circulation: circulationSupply,
        },
        price,
        marketCap,
        isETH,
        lp,
        balance,
      })
    } else {
      result.infos.push({
        reserv,
        token: pair.buyCurrency.address,
        supply: {
          total: supply,
          circulation: circulationSupply,
        },
        price,
        marketCap,
        isETH,
        lp,
      })
    }
    return pair
  })
  return result
}

export const getTokenInfo = async (pair, network) => {
  const tokenInfos = await getTokenInfos([pair], network)
  return {
    ...tokenInfos.infos[0],
    ethPrice: tokenInfos.ethPrice,
  }
}

const formatUnits = (value, decimals) => {
  return parseFloat(ethers.utils.formatUnits(value, decimals))
}

export const getTokenAddress = async (pair) => {
  return "0x0"
}