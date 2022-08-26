import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import linq from 'linq'
import _ from 'lodash';
import { ethers } from 'ethers'
import styled from 'styled-components'
import { Button } from '@goosebumps/uikit'
import Page from 'views/Page'
import { useAppDispatch } from 'state'
import { State } from 'state/types'
import { /* fetchTokenData, */ TokenItemProps } from 'state/portfolio'
import { setNetworkInfo, setTimer } from 'state/home'
import { useFastFresh, useSlowFresh } from 'hooks/useRefresh'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { isSupportedChain } from 'utils'
import { postAsyncData } from 'utils/requester'
import { API_SERVER } from 'config'
import { getTokenInfos } from 'utils/getTokenInfos'
import { calculatePricescale, calculateTokenscale } from 'utils/numberHelpers'
import networks from 'config/constants/networks.json'
import TradesModal from './components/TradesModal'
import { mockData } from './mockData'

const HintText = styled.p`
  font-weight: bold;
  font-size: 1.75rem;
  text-align: center;
`
const LoadingPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

const LabelSpan = styled.span`
  margin-left: 30px;
  color: #dbe1ff;
  font-size: 14px;
  font-family: 'Circular Std Book';
`

export interface PortfolioParamProps {
  networkName?: string
  address?: string
}

const PortfolioTracker = () => {
  const history = useHistory();
  const dispatch = useAppDispatch()
  const fastRefresh = useFastFresh()
  const slowRefresh = useSlowFresh()
  const { pathname } = useLocation()
  const { account: connectedAddress} = useActiveWeb3React();
  const { network, searchKey } = useSelector((state: State) => state.home)
  // const { tokens, status, reqAddress } = useSelector((state: State) => state.portfolio)

  // const [tokens, setTokens] = useState<any>([]);
  const [status, setStatus] = useState<any>(0);
  const [reqAddress, setReqAddress] = useState<string>('');

  // const [ searchAddress, setSearchAddress ] = useState(searchKey)
  const [loadingStep, setLoadingStep] = useState(0) // 0:hint, 1: loading, -1: error, 2: success
  const [isStartLoading, setIsStartLoading] = useState(false);
  const [tokenInfos, setTokenInfos] = useState([])
  const [curEthPrice, setCurEthPrice] = useState(0)
  const [selectedToken, setSelectedToken] = useState()
  const params: PortfolioParamProps = useParams()
  params.networkName = params.networkName || network.value;
  params.address = params.address || connectedAddress;
  // const [currentParams, setParams] = useState<PortfolioParamProps>(params);

  const detailedNetwork = params.networkName
    ? linq
        .from(networks)
        .where((x) => x.Name === params.networkName)
        .single()
    : null
  /* 
    networkName, address : values from url
    connectedAddress : wallet address from metamask
    network, searchKey : state.home
    tokens, status, reqAddress : state.portfolio
    tokenInfos : component.state
  */

  const fetchTokenData = async (_network, _address) => {
    const res = await postAsyncData(`${API_SERVER}api/Portfolio/GetTrades`, { network: _network }, [
      _address,
    ])
    
    // const res = mockData

    console.log("fetchTokenData res=", res);
    if(res) {
      setStatus(res.status);
      if(res.status === 200) {
        if(res.address === params.address) {
          const resFilter = _.filter(res.tokens, (a) => {return a.volume !== 0 && a.outs !== 0})
          // console.log("resFilter = ", resFilter)

          await getLiveInfo(resFilter);
          setLoadingStep(2);
          setReqAddress(res.address);
        } else {
          setLoadingStep(1);
        }
      }  else if(res.status !== 0 && res.tokens.length === 0) {
        setLoadingStep(-1);
      }
    }
    setIsStartLoading(false);
      //   if(status === 200 && reqAddress === params.address) {
  //     setIsStartLoading(false);
  //     getLiveInfo()
  //     setLoadingStep(2);
  //   } else if(status !== 0) {
  //     setIsStartLoading(false);
  //     setLoadingStep(-1);
  //   }
  }

  const getLiveInfo = async (tokens) => {
    const infos = await getTokenInfos(
      linq
        .from(tokens)
        .select((x: any) => x.pair)
        .toArray(),
      detailedNetwork,
      [params.address],
    )
    console.log("getLiveInfo getTokenInfos: infos = ", infos);

    if(infos === null) {
      setLoadingStep(-1);
      
    }

    const query = linq.from(infos.infos)
    const newTokenInfos: any = tokens.map((item: TokenItemProps) => {
      const newItem: any = { ...item }
      newItem.info = query.where((x) => x.token === newItem.pair.buyCurrency.address).singleOrDefault() || {}
      newItem.info.rewards = newItem.outs + newItem.info.balance - newItem.ins
      if (newItem.info.rewards < 0.00000001) {
        newItem.info.rewards = 0
      }
      // not determined
      newItem.info.rewardsSold = 0;

      newItem.trades = newItem.trades.map((trade) => {
        const newTrade: any = { ...trade }
        const customTradePrice = parseFloat(localStorage.getItem(`price_${newTrade.tx}`))
        if (customTradePrice) {
          newTrade.priceUSD = customTradePrice
        }

        newTrade.buyPrices.map((buyPrice) => {
          const customBuyPrice = localStorage.getItem(`price_${buyPrice.tx}`)
          if (customBuyPrice) {
            buyPrice.priceUSD = customBuyPrice
          }
          return buyPrice
        })

        // console.log("trade.buyPrices: ", newTrade.buyPrices)
        try {
          newTrade.avarageBuyPriceOfHoldings = newTrade.buyPrices.length
            ? linq
                .from(newTrade.buyPrices)
                .select((x: any) => x.priceUSD * x.amount)
                .toArray()
                .reduce((a, b) => a + b) /
              linq
                .from(newTrade.buyPrices)
                .select((x: any) => x.amount)
                .toArray()
                .reduce((a, b) => a + b)
            : 0
        } catch (error) {
          console.log(error)
          newTrade.avarageBuyPriceOfHoldings = 0
        }

        const slippageTradeTx: any = localStorage.getItem(`slippage_${newTrade.tx}`)
        newTrade.profit =
          newTrade.transactionType === 2 || newTrade.transactionType === 4
            ? ((100 - slippageTradeTx) / 100 || 0) * (newTrade.priceUSD * newTrade.tokenAmount) -
              newTrade.avarageBuyPriceOfHoldings * newTrade.tokenAmount
            : 0
        return newTrade
      })
      // console.log(newItem);

      const buysAndIns = linq
        .from(newItem.trades)
        .where((x: any) => x.transactionType === 1 || x.transactionType === 3)

      // console.log("buysAndIns: ", buysAndIns)
      try {
        newItem.avarageBuyPriceOfHoldings =
          newItem.info.balance > 0
            ? buysAndIns
                .select((x: any) => x.priceUSD * x.holdingAmount)
                .toArray()
                .reduce((a, b) => a + b) /
              buysAndIns
                .select((x: any) => x.holdingAmount)
                .toArray()
                .reduce((a, b) => a + b)
            : 0
        if(Number.isNaN(newItem.avarageBuyPriceOfHoldings))
          newItem.avarageBuyPriceOfHoldings = 0;
      } catch (error) {
        console.log(error)
        newItem.avarageBuyPriceOfHoldings = 0
      }
      // console.log("item.trades: ", newItem.trades)
      try {
        newItem.info.profit = {
          holdings:
            newItem.info.isETH && newItem.info.balance > 0
              ? newItem.info.balance * newItem.info.price * infos.ethPrice -
                newItem.avarageBuyPriceOfHoldings * newItem.info.balance
              : 0,
          sold: linq
            .from(newItem.trades)
            .select((x: any) => x.profit)
            .toArray()
            .reduce((x, y) => x + y),
        }
      } catch (error) {
        console.log(error)
        newItem.info.profit = {
          holdings:
            newItem.info.isETH && newItem.info.balance > 0
              ? newItem.info.balance * newItem.info.price * infos.ethPrice -
                newItem.avarageBuyPriceOfHoldings * newItem.info.balance
              : 0,
          sold: 0,
        }
      }

      newItem.info.pricescale = calculatePricescale(
        newItem.info.isETH ? newItem.info.price * infos.ethPrice : newItem.info.price,
      )
      newItem.info.ethscale = calculatePricescale(newItem.info.price)
      newItem.info.tokenscale = calculateTokenscale(
        newItem.info.isETH ? newItem.info.price * infos.ethPrice : newItem.info.price,
      )
      return newItem
    })

    setCurEthPrice(infos.ethPrice)
    // sort by holdings
    newTokenInfos.sort((a, b) => {
      const aPrice = a.info.isETH ? a.info.balance * a.info.price * infos.ethPrice : a.info.balance * a.info.price;
      const bPrice = b.info.isETH ? b.info.balance * b.info.price * infos.ethPrice : b.info.balance * b.info.price;
      return bPrice - aPrice
    });
    // console.log("newTokenInfos = ", newTokenInfos);
    setTokenInfos(newTokenInfos)
  }  

  // At the beginning
  useEffect(() => {
    console.log("useEffect 1 searchKey = ", searchKey)
    // setParams(params);
    if(searchKey !== params.address) {
      dispatch(setNetworkInfo({
        searchKey: params.address,
        network: {
            label: detailedNetwork.Display,
            value: detailedNetwork.Name,
            chainId: detailedNetwork.chainId
        }
      })) 
    }
  }, [])

  useEffect(() => {
    console.log("params changed params=", params)
    if(params.address === undefined) {
      setLoadingStep(0);
    } else if(params.address !== reqAddress) {
      if(!isStartLoading) {
        console.log("need fetch");
        setIsStartLoading(true);
        fetchTokenData(params.networkName, params.address);
      } else {
        setIsStartLoading(false);
      }
      setLoadingStep(1)
      setTokenInfos([]);
      
    }
  }, [params])
  // Get params from url and set it to state variable
  useEffect(() => {
    console.log("useEffect 2")
    // console.log("Params = ", params)
    // console.log("CurrentParams = ", currentParams)
    // console.log("searchKey=", searchKey, "!=", !searchKey);
    if(params.address === undefined) {
      setLoadingStep(0);
    } else {
      // if(searchKey !== params.address) {
      //   // dispatch(setTimer(
      //   //   setTimeout(() => {
      //   //       dispatch(setNetworkInfo({
      //   //           searchKey: params.address,
      //   //           network: {
      //   //               label: detailedNetwork.Display,
      //   //               value: detailedNetwork.Name,
      //   //               chainId: detailedNetwork.chainId
      //   //           }
      //   //       }))
      //   //   }, 1000)    
      //   // ))
      //   dispatch(setNetworkInfo({
      //       searchKey: params.address,
      //       network: {
      //           label: detailedNetwork.Display,
      //           value: detailedNetwork.Name,
      //           chainId: detailedNetwork.chainId
      //       }
      //   }))
      // }
      if(loadingStep !== 2) { // if hint, then change step to loading
        setLoadingStep(1);
      }
      // console.log("before FetchTokenData currentParams=", currentParams)
      if(!isStartLoading) {
        setIsStartLoading(true);
        // dispatch(fetchTokenData({network: params.networkName, address: params.address}));
        fetchTokenData(params.networkName, params.address);
        
      }
    }
  }, [slowRefresh])
  // When wallet connected, set params variable
  useEffect(() => {
    console.log("useEffect 3")
    if( connectedAddress ) {
      setTokenInfos([]);
      setIsStartLoading(false);
      dispatch(setNetworkInfo({
        searchKey: connectedAddress,
        network: {
            label: detailedNetwork.Display,
            value: detailedNetwork.Name,
            chainId: detailedNetwork.chainId
        }
      })) 
      // params.address = connectedAddress;
      // setParams({address: connectedAddress, networkName: currentParams.networkName});
    } else if(!params.address) {
      setLoadingStep(-1);
      dispatch(setNetworkInfo({
        searchKey: "",
        network: {
            label: detailedNetwork.Display,
            value: detailedNetwork.Name,
            chainId: detailedNetwork.chainId
        }
      })) 
    }
  }, [connectedAddress])

  // When searchKey changed, set params variable
  // useEffect(() => {
  //   console.log("useEffect 4")
  //   if(currentParams.address !== searchKey && ethers.utils.isAddress(searchKey)) {
  //     setLoadingStep(1);
  //     setTokenInfos([]);
  //     setParams({address: searchKey, networkName: currentParams.networkName});
  //     // setParams({address: params.address, networkName: currentParams.networkName});
  //   }
  // }, [searchKey])

  // Check loading data from backend
  // useEffect(() => {
  //   console.log("useEffect 5")
  //   // console.log("reqAddress = ", reqAddress)
  //   if(status === 200 && reqAddress === params.address) {
  //     setIsStartLoading(false);
  //     const getLiveInfo = async () => {
  //       const infos = await getTokenInfos(
  //         linq
  //           .from(tokens)
  //           .select((x: any) => x.pair)
  //           .toArray(),
  //         detailedNetwork,
  //         [params.address],
  //       )

  //       const query = linq.from(infos.infos)
  //       const newTokenInfos: any = tokens.map((item: TokenItemProps) => {
  //         const newItem: any = { ...item }
  //         newItem.info = query.where((x) => x.token === newItem.pair.buyCurrency.address).singleOrDefault() || {}
  //         newItem.info.rewards = newItem.outs + newItem.info.balance - newItem.ins
  //         if (newItem.info.rewards < 0.00000001) {
  //           newItem.info.rewards = 0
  //         }
  //         // not determined
  //         newItem.info.rewardsSold = 0;

  //         newItem.trades = newItem.trades.map((trade) => {
  //           const newTrade: any = { ...trade }
  //           const customTradePrice = parseFloat(localStorage.getItem(`price_${newTrade.tx}`))
  //           if (customTradePrice) {
  //             newTrade.priceUSD = customTradePrice
  //           }

  //           newTrade.buyPrices.map((buyPrice) => {
  //             const customBuyPrice = localStorage.getItem(`price_${buyPrice.tx}`)
  //             if (customBuyPrice) {
  //               buyPrice.priceUSD = customBuyPrice
  //             }
  //             return buyPrice
  //           })

  //           // console.log("trade.buyPrices: ", newTrade.buyPrices)
  //           try {
  //             newTrade.avarageBuyPriceOfHoldings = newTrade.buyPrices.length
  //               ? linq
  //                   .from(newTrade.buyPrices)
  //                   .select((x: any) => x.priceUSD * x.amount)
  //                   .toArray()
  //                   .reduce((a, b) => a + b) /
  //                 linq
  //                   .from(newTrade.buyPrices)
  //                   .select((x: any) => x.amount)
  //                   .toArray()
  //                   .reduce((a, b) => a + b)
  //               : 0
  //           } catch (error) {
  //             console.log(error)
  //             newTrade.avarageBuyPriceOfHoldings = 0
  //           }

  //           const slippageTradeTx: any = localStorage.getItem(`slippage_${newTrade.tx}`)
  //           newTrade.profit =
  //             newTrade.transactionType === 2 || newTrade.transactionType === 4
  //               ? ((100 - slippageTradeTx) / 100 || 0) * (newTrade.priceUSD * newTrade.tokenAmount) -
  //                 newTrade.avarageBuyPriceOfHoldings * newTrade.tokenAmount
  //               : 0
  //           return newTrade
  //         })
  //         // console.log(newItem);

  //         const buysAndIns = linq
  //           .from(newItem.trades)
  //           .where((x: any) => x.transactionType === 1 || x.transactionType === 3)

  //         // console.log("buysAndIns: ", buysAndIns)
  //         try {
  //           newItem.avarageBuyPriceOfHoldings =
  //             newItem.info.balance > 0
  //               ? buysAndIns
  //                   .select((x: any) => x.priceUSD * x.holdingAmount)
  //                   .toArray()
  //                   .reduce((a, b) => a + b) /
  //                 buysAndIns
  //                   .select((x: any) => x.holdingAmount)
  //                   .toArray()
  //                   .reduce((a, b) => a + b)
  //               : 0
  //           if(Number.isNaN(newItem.avarageBuyPriceOfHoldings))
  //             newItem.avarageBuyPriceOfHoldings = 0;
  //         } catch (error) {
  //           console.log(error)
  //           newItem.avarageBuyPriceOfHoldings = 0
  //         }
  //         // console.log("item.trades: ", newItem.trades)
  //         try {
  //           newItem.info.profit = {
  //             holdings:
  //               newItem.info.isETH && newItem.info.balance > 0
  //                 ? newItem.info.balance * newItem.info.price * infos.ethPrice -
  //                   newItem.avarageBuyPriceOfHoldings * newItem.info.balance
  //                 : 0,
  //             sold: linq
  //               .from(newItem.trades)
  //               .select((x: any) => x.profit)
  //               .toArray()
  //               .reduce((x, y) => x + y),
  //           }
  //         } catch (error) {
  //           console.log(error)
  //           newItem.info.profit = {
  //             holdings:
  //               newItem.info.isETH && newItem.info.balance > 0
  //                 ? newItem.info.balance * newItem.info.price * infos.ethPrice -
  //                   newItem.avarageBuyPriceOfHoldings * newItem.info.balance
  //                 : 0,
  //             sold: 0,
  //           }
  //         }

  //         newItem.info.pricescale = calculatePricescale(
  //           newItem.info.isETH ? newItem.info.price * infos.ethPrice : newItem.info.price,
  //         )
  //         newItem.info.ethscale = calculatePricescale(newItem.info.price)
  //         newItem.info.tokenscale = calculateTokenscale(
  //           newItem.info.isETH ? newItem.info.price * infos.ethPrice : newItem.info.price,
  //         )
  //         return newItem
  //       })

  //       setCurEthPrice(infos.ethPrice)
  //       setTokenInfos(newTokenInfos)
  //       // console.log("newTokenInfos = ", newTokenInfos)
  //     }         
  //     getLiveInfo()
  //     setLoadingStep(2);
  //   } else if(status !== 0) {
  //     setIsStartLoading(false);
  //     setLoadingStep(-1);
  //   }
  // }, [tokens, status])

  
  const renderLoading = () => {
    return (
      <LoadingPanel>
        {/* <span className="spinner-border" role="status" />{' '} */}
        <span style={{transform: "scale(0.7)"}}><div className="lds-roller"><div/><div/><div/><div/><div/><div/><div/><div/></div></span>
        <span style={{ margin: 'auto 20px' }}> This will take few seconds </span>
      </LoadingPanel>
    )
  }

  const renderContent = () => {
    // if (loadingStep < 2) return <></>
    // Get data from the server
    // const tokenData = mockData;
    return (
      <>
        <div className="portfolio-page container-fluid">
          <div className="head-title">
            <div className="row">
              <div className="col-lg-6">
                <h2>Portfolio For</h2>
                <div>
                  <div className="mt-2" style={{ color: 'white' }}>
                    {searchKey}{' '}
                  </div>
                </div>
              </div>
              <div className="col-lg-6 text-right mt-auto">
                <p>
                  Rewards :
                  <LabelSpan>
                    <i className="fa fa-circle blue" aria-hidden="true" id="icon1" /> Earned
                  </LabelSpan>
                  <LabelSpan>
                    <i className="fa fa-circle red" aria-hidden="true" /> Sold
                  </LabelSpan>
                  <br />
                  Profit :
                  <LabelSpan>
                    <i className="fa fa-circle blue" aria-hidden="true" /> Holdings
                  </LabelSpan>
                  <LabelSpan>
                    <i className="fa fa-circle red" aria-hidden="true" /> Sold
                  </LabelSpan>
                  <LabelSpan>
                    <i className="fa fa-circle yellow" aria-hidden="true" /> Total
                  </LabelSpan>
                </p>
              </div>
            </div>
          </div>
          <div className="table-responsive tournament-table mb-50 your-assets">
            <table className="table align-middle mb-0">
              <thead className="sticky-top">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Volume</th>
                  <th scope="col" style={{paddingLeft: "30px"}}>Rewards</th>
                  <th scope="col">Holdings</th>
                  <th scope="col">MarketCap</th>
                  <th scope="col">
                    Average Buy
                    <br />
                    Price of Holdings
                  </th>
                  <th scope="col" style={{paddingLeft: "60px"}}>Profit</th>
                  <th scope="col"> </th>
                </tr>
              </thead>
              <tbody>
                {tokenInfos.length ? (
                  tokenInfos.map((token, index) => (
                    <tr key={`${JSON.stringify(token)}`}>
                      <td>
                        {token.pair.buyCurrency.name}
                        <br />
                        <span className="text-secondary">({token.pair.buyCurrency.symbol})</span>
                      </td>
                      <td>
                        {token.info.isETH ? ( // Token PriceUSD
                          <>
                            <NumberFormat
                              value={token.info.price * curEthPrice}
                              decimalScale={token.info.pricescale}
                              displayType="text"
                              thousandSeparator=","
                              prefix="$"
                            />
                            <br />
                            <span className="text-secondary">
                              (
                              <NumberFormat
                                value={token.info.price}
                                decimalScale={token.info.pricescale}
                                displayType="text"
                                thousandSeparator=","
                                suffix={` ${token.pair.sellCurrency.symbol}`}
                              />
                              )
                            </span>
                          </>
                        ) : (
                          <NumberFormat
                            value={token.info.price}
                            decimalScale={token.info.ethscale}
                            displayType="text"
                            thousandSeparator=","
                            suffix={` ${token.pair.sellCurrency.symbol}`}
                          />
                        )}
                      </td>
                      <td> {/* Volume */}
                        <NumberFormat
                          value={token.volume}
                          decimalScale={0}
                          decimalSeparator=""
                          displayType="text"
                          thousandSeparator=","
                          prefix="$"
                        />
                      </td>
                      <td> {/* Rewards */}
                        <LabelSpan>
                          <i className="fa fa-circle blue" aria-hidden="true" />{' '}
                          <NumberFormat
                            value={token.info.rewards}
                            decimalScale={token.info.tokenscale}
                            displayType="text"
                            thousandSeparator=","
                          />
                        </LabelSpan>
                        {/* <label>
                                    <i className="fa fa-circle blue" aria-hidden="true"/>
                                    <NumberFormat
                                    value={token.info.rewards}
                                    decimalScale={token.info.tokenscale}
                                    displayType="text"
                                    thousandSeparator=","
                                    />
                                </label> */}
                        <br />
                        <LabelSpan>
                          <i className="fa fa-circle red" aria-hidden="true" />{' '}
                          <NumberFormat
                            value={token.info.rewardsSold}
                            decimalScale={token.info.tokenscale}
                            displayType="text"
                            thousandSeparator=","
                          />
                        </LabelSpan>
                        {/* <label>
                                    <i className="fa fa-circle red" aria-hidden="true"/>
                                    <NumberFormat
                                    value={token.rewardsSold}
                                    decimalScale={token.info.tokenscale}
                                    displayType="text"
                                    thousandSeparator=","
                                    />
                                </label> */}
                      </td>
                      <td> {/* Holdings */}
                        {token.info.isETH ? (
                          <>
                            <NumberFormat
                              value={token.info.balance * token.info.price * curEthPrice}
                              decimalScale={2}
                              displayType="text"
                              thousandSeparator=","
                              prefix="$"
                            />
                            <br />
                            <span className="text-secondary">
                              (
                              <NumberFormat
                                value={token.info.balance * token.info.price}
                                decimalScale={2}
                                displayType="text"
                                thousandSeparator=","
                                suffix={` ${token.pair.sellCurrency.symbol}`}
                              />
                              )
                            </span>
                          </>
                        ) : (
                          <>
                            <NumberFormat
                              value={token.info.balance * token.info.price}
                              decimalScale={2}
                              displayType="text"
                              thousandSeparator=","
                              suffix={` ${token.pair.sellCurrency.symbol}`}
                            />
                          </>
                        )}
                      </td>
                      <td> {/* MarketCap */}
                        {token.info.isETH ? (
                          <>
                            <NumberFormat
                              value={token.info.supply?.circulation * (token.info.price * curEthPrice)}
                              decimalScale={0}
                              decimalSeparator=""
                              displayType="text"
                              thousandSeparator=","
                              prefix="$"
                            />
                            <br />
                            <span className="text-secondary">
                              (
                              <NumberFormat
                                value={token.info.supply?.circulation * token.info.price}
                                decimalSeparator=""
                                decimalScale={0}
                                displayType="text"
                                thousandSeparator=","
                                suffix={` ${token.pair.sellCurrency.symbol}`}
                              />
                              )
                            </span>
                          </>
                        ) : (
                          <NumberFormat
                            value={token.info.supply?.circulation * token.info.price}
                            decimalScale={0}
                            decimalSeparator=""
                            displayType="text"
                            thousandSeparator=","
                            suffix={` ${token.pair.sellCurrency.symbol}`}
                          />
                        )}
                      </td>
                      <td> {/* average buy price of holdings */}
                        <NumberFormat
                          value={token.avarageBuyPriceOfHoldings}
                          decimalScale={token.info.pricescale}
                          displayType="text"
                          thousandSeparator=","
                          prefix="$"
                        />
                      </td>
                      <td> {/* Profit */}
                        <LabelSpan>
                          <i className="fa fa-circle blue" aria-hidden="true" />{' '}
                          <NumberFormat
                            value={token.info.profit.holdings}
                            decimalScale={2}
                            displayType="text"
                            thousandSeparator=","
                            prefix="$"
                          />
                        </LabelSpan>
                        <br />
                        <LabelSpan>
                          <i className="fa fa-circle red" aria-hidden="true" />{' '}
                          <NumberFormat
                            value={token.info.profit.sold}
                            decimalScale={2}
                            displayType="text"
                            thousandSeparator=","
                            prefix="$"
                          />
                        </LabelSpan>
                        <br />
                        <LabelSpan>
                          <i className="fa fa-circle yellow" aria-hidden="true" />{' '}
                          <NumberFormat
                            value={token.info.profit.sold + token.info.profit.holdings}
                            decimalScale={2}
                            displayType="text"
                            thousandSeparator=","
                            prefix="$"
                          />
                        </LabelSpan>
                      </td>
                      <td> {/* Actions */}
                        <Button
                          variant="secondary"
                          style={{
                            borderRadius: '10px',
                            padding: '10px 14px',
                            borderColor: 'grey',
                            height: 'auto',
                            marginRight: '8px',
                          }}
                          onClick={() => {
                            window.open(
                              `${detailedNetwork.Explorer}token/${token.pair.buyCurrency.address}`,
                              '_blank',
                              'noopener noreferrer',
                            )
                          }}
                        >
                          Explorer
                        </Button>
                        <Button
                          variant="secondary"
                          style={{
                            borderRadius: '10px',
                            padding: '10px 14px',
                            borderColor: 'grey',
                            height: 'auto',
                            marginRight: '8px',
                          }}
                          onClick={() => {
                            window.open(`/charts/${detailedNetwork.Name}/${token.pair.buyCurrency.address}`, '_parent')
                          }}
                        >
                          Charts
                        </Button>
                        <Button
                          onClick={() => setSelectedToken(token)}
                          variant="secondary"
                          style={{
                            borderRadius: '10px',
                            padding: '10px 14px',
                            borderColor: 'grey',
                            height: 'auto',
                            marginRight: '8px',
                          }}
                        >
                          Trades
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center">
                      <p className="p-5">NO RESULT</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <TradesModal network={detailedNetwork} token={selectedToken} hide={() => setSelectedToken(null)} />
      </>
    )
  }

  return (
    <Page>
      <div style={{width: "100%", minHeight: "80vh"}}>
        {loadingStep === -1 ? 
          <HintText style={{margin: 'auto'}}>Loading data failed. {status?.error}</HintText>
          :
          <>
            {loadingStep === 0 && <HintText style={{margin: 'auto'}}>Please connect wallet or input wallet address.</HintText>}
            {loadingStep === 1 && renderLoading()}
            {loadingStep === 2 && renderContent()}
        </>}
      </div>
    </Page>
  )
}

export default PortfolioTracker
