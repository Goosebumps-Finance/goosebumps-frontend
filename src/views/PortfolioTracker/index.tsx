import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import linq from 'linq';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { Button } from '@goosebumps/uikit'
import Page from 'views/Page';
import { useAppDispatch } from 'state';
import { State } from 'state/types'
import { fetchTokenData, TokenItemProps } from 'state/portfolio';
import { setNetworkInfo } from 'state/home';
import { useFastFresh, useSlowFresh } from 'hooks/useRefresh';
import { isSupportedChain } from 'utils';
import { getTokenInfos } from 'utils/getTokenInfos';
import { calculatePricescale, calculateTokenscale } from 'utils/numberHelpers';
import networks from 'config/constants/networks.json';
import TradesModal from './components/TradesModal';

const HintText = styled.p`
    font-weight: bold;
    font-size: 1.75rem;
`
const LoadingPanel = styled.div`
    display: flex;
    align-items: center;
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
    const dispatch = useAppDispatch();
    const fastRefresh = useFastFresh();
    const slowRefresh = useSlowFresh();
    const { pathname } = useLocation();
    // const { network, searchKey } = useSelector((state: State) => state.home)
    const { tokens } = useSelector((state:State) => state.portfolio)
    // const [ searchAddress, setSearchAddress ] = useState(searchKey)
    const [ isHintText, setIsHintText ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ tokenInfos, setTokenInfos ] = useState([]);
    const [ curEthPrice, setCurEthPrice ] = useState(0);
    const [selectedToken, setSelectedToken] = useState();
    const { networkName, address } = useParams<PortfolioParamProps>();
    const detailedNetwork = networkName ? linq.from(networks).where((x) => x.Name === networkName).single() : null;
    
    // const detailedNetwork = network ? linq.from(networks).where((x) => x.Name === network.value).single() : null;
    // const [currentParams, setParams] = useState();
    // const network = params.networkName;

    useEffect(() => {
        // console.log("useEffect networkName: ", networkName, !networkName)
        // console.log("useEffect address: ", address, !address)
        if(!networkName || !address) {
            setIsHintText(true);
            setIsLoading(false);
        } else {
            setIsHintText(false)            
            setTokenInfos([]);
            setCurEthPrice(0);
        }
    }, [networkName, address])

    useEffect(() => {
        // console.log("useEffect tokenInfos = ", tokenInfos, " curEthPrice = ", curEthPrice);
        // console.log("tokenInfos: ", !tokenInfos)
        // console.log("curEthPrice: ", !curEthPrice)
        if(!isHintText && (!tokenInfos || !curEthPrice)) {
            setIsLoading(true);
        } else {
            setIsLoading(false);
        }
    }, [curEthPrice, tokenInfos, isHintText])
    
    useEffect(() => {
        // console.log("useEffect fetchTokenData address =", address)
        if(address !== undefined) {
            dispatch(fetchTokenData({network: networkName, address}));
        }
    }, [ dispatch, networkName, address, slowRefresh ])

    // useEffect(() => {
    //     const args = pathname.split("/");
    //     if(args[1] === "portfolio-tracker" && isSupportedChain(args[2]) && ethers.utils.isAddress(args[3])) {
    //         const networkInfo = linq.from(networks).where((x) => x.Name === args[2]).single();
    //         const selNetwork = {
    //             label: networkInfo.Display,
    //             value: networkInfo.Name
    //         }
    //         if(network.value !== selNetwork.value) {
    //             dispatch(setNetworkInfo({ network: selNetwork, searchKey: args[3] }))
    //         }
    //         setSearchAddress(args[3]);
    //     }
    // }, [network, pathname, dispatch])

    useEffect(() => {
        // console.log("tokens = ", tokens)
        if(tokens.length !== 0 && address !== undefined) {
            const getLiveInfo = async () => {
                const infos = await getTokenInfos(
                    linq.from(tokens).select((x:any) => x.pair).toArray(),
                    detailedNetwork,
                    [ address ]
                )
                // console.log("getLiveInfo, infos = ", infos)
                
                const query = linq.from(infos.infos);
                const newTokenInfos:any = tokens.map((item:TokenItemProps) => {
                    const newItem:any = {...item};
                    newItem.info = query.where((x) => x.token === newItem.pair.buyCurrency.address).singleOrDefault() || {};
                    newItem.info.rewards = newItem.outs + newItem.info.balance - newItem.ins;
                    if (newItem.info.rewards < 0.00000001) {
                        newItem.info.rewards = 0;
                    }

                    newItem.trades = newItem.trades.map((trade) => {
                        const newTrade:any = { ...trade };
                        const customTradePrice = parseFloat(localStorage.getItem(`price_${newTrade.tx}`));
                        if (customTradePrice) {
                            newTrade.priceUSD = customTradePrice;
                        }
                
                        newTrade.buyPrices.map((buyPrice) => {
                            const customBuyPrice = localStorage.getItem(`price_${buyPrice.tx}`);
                            if (customBuyPrice) {
                                buyPrice.priceUSD = customBuyPrice;
                            }
                            return buyPrice;
                        });
                
                        // console.log("trade.buyPrices: ", newTrade.buyPrices)
                        try {
                            newTrade.avarageBuyPriceOfHoldings = newTrade.buyPrices.length
                                ? linq
                                .from(newTrade.buyPrices)
                                .select((x:any) => x.priceUSD * x.amount)
                                .toArray()
                                .reduce((a, b) => a + b) /
                                linq
                                .from(newTrade.buyPrices)
                                .select((x:any) => x.amount)
                                .toArray()
                                .reduce((a, b) => a + b)
                                : 0;
                        } catch (error) {
                            console.log(error)
                            newTrade.avarageBuyPriceOfHoldings = 0;
                        }
                
                        const slippageTradeTx:any = localStorage.getItem(`slippage_${newTrade.tx}`);
                        newTrade.profit =
                        newTrade.transactionType === 2 || newTrade.transactionType === 4
                            ? ((100 - slippageTradeTx) / 100 ||
                            0) *
                            (newTrade.priceUSD * newTrade.tokenAmount) -
                            newTrade.avarageBuyPriceOfHoldings * newTrade.tokenAmount
                            : 0;
                
                        return newTrade;
                    });
                    // console.log(newItem);
                    
                    const buysAndIns = linq
                        .from(newItem.trades)
                        .where((x:any) => x.transactionType === 1 || x.transactionType === 3);

                    // console.log("buysAndIns: ", buysAndIns)
                    try {
                        newItem.avarageBuyPriceOfHoldings =
                        newItem.info.balance > 0
                            ? buysAndIns
                            .select((x:any) => x.priceUSD * x.holdingAmount)
                            .toArray()
                            .reduce((a, b) => a + b) /
                            buysAndIns
                            .select((x:any) => x.holdingAmount)
                            .toArray()
                            .reduce((a, b) => a + b)
                            : 0;
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
                            .select((x:any) => x.profit)
                            .toArray()
                            .reduce((x, y) => x + y),
                        };
                    } catch (error) {
                        console.log(error)
                        newItem.info.profit = {
                        holdings:
                            newItem.info.isETH && newItem.info.balance > 0
                            ? newItem.info.balance * newItem.info.price * infos.ethPrice -
                            newItem.avarageBuyPriceOfHoldings * newItem.info.balance
                            : 0,
                        sold: 0,
                        };
                    }

                    newItem.info.pricescale = calculatePricescale(
                        newItem.info.isETH ? newItem.info.price * infos.ethPrice : newItem.info.price
                    );
                    newItem.info.ethscale = calculatePricescale(newItem.info.price);
                    newItem.info.tokenscale = calculateTokenscale(
                        newItem.info.isETH ? newItem.info.price * infos.ethPrice : newItem.info.price
                    );
                    return newItem;
                });

                setCurEthPrice(infos.ethPrice);
                setTokenInfos(newTokenInfos);
                // console.log("newTokenInfos = ", newTokenInfos)
                // return {
                //     ethPrice: infos.ethPrice,
                //     tokens
                // }
            }
            getLiveInfo();
        }
    }, [ tokens, detailedNetwork, address, tokenInfos ])

    const renderLoading = () => {
        return (<LoadingPanel >
            <span className="spinner-border" role="status"/> <span style={{margin: 'auto 20px'}}> This will take few seconds </span>
        </LoadingPanel>)
    }

    const renderContent = () => {
        if(isLoading || isHintText) return <></>;
        // Get data from the server
        // const tokenData = mockData;

        return <>
        <div className="portfolio-page container-fluid">
            <div className="head-title">
                <div className="row">
                    <div className="col-lg-6">
                        <h2>Portfolio For</h2>
                        <div>
                            <div className="mt-2" style={{color: 'white'}}>
                                {address}{" "}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 text-right mt-auto">
                    <p>
                        Rewards :
                        <LabelSpan><i className="fa fa-circle blue" aria-hidden="true" id="icon1"/>{" "} Earned</LabelSpan>
                        <LabelSpan><i className="fa fa-circle red" aria-hidden="true"/> Sold</LabelSpan>
                        <br />
                        Profit :
                        <LabelSpan><i className="fa fa-circle blue" aria-hidden="true"/>{" "} Holdings</LabelSpan>
                        <LabelSpan><i className="fa fa-circle red" aria-hidden="true"/> Sold</LabelSpan>
                        <LabelSpan><i className="fa fa-circle yellow" aria-hidden="true"/>{" "} Total</LabelSpan>
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
                        <th scope="col">Rewards</th>
                        <th scope="col">Holdings</th>
                        <th scope="col">MarketCap</th>
                        <th scope="col">
                        Average Buy
                        <br />
                        Price of Holdings
                        </th>
                        <th scope="col">Profit</th>
                        <th scope="col">{" "}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tokenInfos.length ? (
                        tokenInfos.map((token, index) => (
                            <tr key={`${JSON.stringify(token)}`}>
                                <td>
                                {token.pair.buyCurrency.name}
                                <br />
                                <span className="text-secondary">
                                    ({token.pair.buyCurrency.symbol})
                                </span>
                                </td>
                                <td>
                                {token.info.isETH ? (
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
                                <td>
                                <NumberFormat
                                    value={token.volume}
                                    decimalScale={0}
                                    decimalSeparator=""
                                    displayType="text"
                                    thousandSeparator=","
                                    prefix="$"
                                />
                                </td>
                                <td>
                                <LabelSpan>
                                    <i className="fa fa-circle blue" aria-hidden="true"/>
                                    {" "}
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
                                    <i className="fa fa-circle red" aria-hidden="true"/>
                                    {" "}
                                    <NumberFormat
                                    value={token.rewardsSold}
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
                                <td>
                                {token.info.isETH ? (
                                    <>
                                    <NumberFormat
                                        value={
                                        token.info.balance * token.info.price * curEthPrice
                                        }
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
                                <td>
                                {token.info.isETH ? (
                                    <>
                                    <NumberFormat
                                        value={
                                        token.info.supply?.circulation *
                                        (token.info.price * curEthPrice)
                                        }
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
                                        value={
                                            token.info.supply?.circulation *
                                            token.info.price
                                        }
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
                                    value={
                                        token.info.supply?.circulation * token.info.price
                                    }
                                    decimalScale={0}
                                    decimalSeparator=""
                                    displayType="text"
                                    thousandSeparator=","
                                    suffix={` ${token.pair.sellCurrency.symbol}`}
                                    />
                                )}
                                </td>
                                <td>
                                <NumberFormat
                                    value={token.avarageBuyPriceOfHoldings}
                                    decimalScale={token.info.pricescale}
                                    displayType="text"
                                    thousandSeparator=","
                                    prefix="$"
                                />
                                </td>
                                <td>
                                {/* <label>
                                    <i className="fa fa-circle blue" aria-hidden="true"/>
                                    <NumberFormat
                                    value={token.info.profit.holdings}
                                    decimalScale={2}
                                    displayType="text"
                                    thousandSeparator=","
                                    prefix="$"
                                    />
                                </label> */}
                                <LabelSpan>
                                    <i className="fa fa-circle blue" aria-hidden="true"/>
                                    {" "}
                                    <NumberFormat
                                    value={token.info.profit.holdings}
                                    decimalScale={2}
                                    displayType="text"
                                    thousandSeparator=","
                                    prefix="$"
                                    />
                                </LabelSpan>
                                <br />
                                {/* <label>
                                    <i className="fa fa-circle red" aria-hidden="true"/>
                                    <NumberFormat
                                    value={token.info.profit.sold}
                                    decimalScale={2}
                                    displayType="text"
                                    thousandSeparator=","
                                    prefix="$"
                                    />
                                </label> */}
                                <LabelSpan>
                                    <i className="fa fa-circle red" aria-hidden="true"/>
                                    {" "}
                                    <NumberFormat
                                    value={token.info.profit.sold}
                                    decimalScale={2}
                                    displayType="text"
                                    thousandSeparator=","
                                    prefix="$"
                                    />
                                </LabelSpan>
                                <br />
                                {/* <label>
                                    <i
                                    className="fa fa-circle yellow"
                                    aria-hidden="true"
                                    />
                                    <NumberFormat
                                    value={
                                        token.info.profit.sold + token.info.profit.holdings
                                    }
                                    decimalScale={2}
                                    displayType="text"
                                    thousandSeparator=","
                                    prefix="$"
                                    />
                                </label> */}
                                <LabelSpan>
                                    <i
                                    className="fa fa-circle yellow"
                                    aria-hidden="true"
                                    />
                                    {" "}
                                    <NumberFormat
                                    value={
                                        token.info.profit.sold + token.info.profit.holdings
                                    }
                                    decimalScale={2}
                                    displayType="text"
                                    thousandSeparator=","
                                    prefix="$"
                                    />
                                </LabelSpan>
                                </td>
                                <td>
                                {/* <a
                                    className="default-btn btn-sq me-2"
                                    href={`${detailedNetwork.Explorer}token/${token.pair.buyCurrency.address}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Explorer
                                </a> */}
                                <Button
                                    variant="secondary"
                                    style={{borderRadius: "10px", padding: "10px 14px", borderColor: "grey", height: "auto", marginRight: "8px"}}
                                    onClick={() => {
                                        window.open(`${detailedNetwork.Explorer}token/${token.pair.buyCurrency.address}`, "_blank", "noopener noreferrer")
                                    }}
                                >
                                    Explorer
                                </Button>
{/*                                 
                                <Button
                                    variant="secondary"
                                    style={{borderRadius: "10px", padding: "10px 14px", borderColor: "grey", height: "auto"}}
                                >
                                    <Link
                                        to={`/charts/${detailedNetwork.Name}/${token.pair.buyCurrency.address}`}
                                    >
                                        Charts
                                    </Link>
                                </Button> */}
                                <Button
                                    variant="secondary"
                                    style={{borderRadius: "10px", padding: "10px 14px", borderColor: "grey", height: "auto", marginRight: "8px"}}
                                    onClick={() => {
                                        window.open(`/charts/${detailedNetwork.Name}/${token.pair.buyCurrency.address}`, "_parent")
                                    }}
                                >
                                    Charts
                                </Button>
                                <Button
                                    // className="default-btn btn-sq"
                                    onClick={() => setSelectedToken(token)}
                                    variant="secondary"
                                    style={{borderRadius: "10px", padding: "10px 14px", borderColor: "grey", height: "auto", marginRight: "8px"}}
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
            <TradesModal
                network={detailedNetwork}
                token={selectedToken}
                hide = {() => setSelectedToken(null)}
            />
        </>
    }

    return (<Page>
        {isHintText && <HintText>Use search bar to track an address</HintText>}
        {isLoading && renderLoading()}
        {renderContent()}
    </Page>)
}

export default PortfolioTracker;