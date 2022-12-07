import { API_SERVER, LOG_VIEW } from 'config'
import { ethers } from 'ethers'
// import { mockLatestTradeData } from "views/Charts/mockChartData";
import { getAsyncData } from './requester'

export const getChartsInfo = async (address, network, pairAddress) => {
  // const pairs = await Requester.getAsync(
  //     `${config.API_SERVER}api/Charts/GetPairs`,
  //     { address: address, network: network.Name }
  // );
  // const pairs = mockPairsData;
  // LOG_VIEW('getChartsInfo address=', address, ' network =', network, ' pairAddress=', pairAddress)
  if (address === '' || network === null) return [];
  const pairs = await getAsyncData(`${API_SERVER}api/Charts/GetPairs`, { address, network: network.Name })
  // LOG_VIEW("getChartsInfo pairs=", pairs)
  let pair

  if (pairAddress == null) {
    pair = pairs[0]
  } else {
    const filter = pairs.filter((x) => x.smartContract.address.address === pairAddress)
    if (filter.length) {
      pair = filter[0]
    }
  }
  const info = {
    address,
    pairs,
    pair,
    title: `${pair.buyCurrency.symbol}/${pair.sellCurrency.symbol} (${pair.exchange.fullName})`,
    cmc: {},
  }

  // const cmc = await Requester.getAsync(
  //     `${config.API_SERVER}api/Charts/GetCMCInfo`,
  //     { address: ethers.utils.getAddress(address), network: network.Name }
  // );
  // const cmc = mockCMCData;
  // const cmc = await getAsyncData(`${API_SERVER}api/Charts/GetCMCInfo`, {
  //   address: ethers.utils.getAddress(address),
  //   network: network.Name,
  // })
  // // LOG_VIEW("getChartsInfo info=", info)
  // // LOG_VIEW('getChartsInfo cmc=', cmc)

  // if (cmc != null && cmc.id) {
  //   info.cmc = cmc
  // }

  return info
}

export const getLatestTrades = async (pair, network, startTime, endTime, limit = -1) => {
  // Requester.getAsync(`${config.API_SERVER}api/Charts/GetLatestTrades`, {
  //     token0: props.pair.buyCurrency.address,
  //     token1: props.pair.sellCurrency.address,
  //     pair: props.pair.smartContract.address.address,
  //     network: props.network.Name,
  //     startTime: now - 24 * 60 * 60,
  //     endTime: now,
  //     limit: 20,
  //   }).then((response) => {
  //     setTrades(response);
  //     setLastTradesRequest(now);
  //     setLoading(false);
  //   });
  // const res = mockLatestTradeData;
  let params = {}
  // LOG_VIEW('getLatestTrades : pair = ', pair, ' network: ', network)
  if (limit === 20) {
    params = {
      token0: pair.buyCurrency.address,
      token1: pair.sellCurrency.address,
      pair: pair.smartContract.address.address,
      network: network.Name,
      startTime,
      endTime,
      limit,
    }
  } else {
    params = {
      token0: pair.buyCurrency.address,
      token1: pair.sellCurrency.address,
      pair: pair.smartContract.address.address,
      network: network.Name,
      startTime,
      endTime,
    }
  }
  // LOG_VIEW('getLatestTrades params = ', params)
  const res = await getAsyncData(`${API_SERVER}api/Charts/GetLatestTrades`, params)
  // LOG_VIEW('GetLatestTrades: res = ', res)
  return res
}
