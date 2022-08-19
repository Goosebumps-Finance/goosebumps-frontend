import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import Page from 'views/Page';
import linq from 'linq';
import networks from 'config/constants/networks.json';
import { fetchAddressType, setNetworkInfo, setTimer } from 'state/home';
import { AppState } from 'state';
import Info from 'views/Charts/components/Info';
import { getChartsInfo } from 'utils/getChartsInfo';
import { getTokenAddress } from 'utils/getTokenInfos';

export interface ParamProps {
    networkName?: string
    address?: string
    pairAddress?: string
}

const compareParams = (param1: ParamProps, param2: ParamProps) => {
    return (
      param1.address === param2.address &&
      param1.networkName === param2.networkName
    )
}

const SimpleCharts = (props) => {
    const dispatch = useDispatch();

    const { addressType, searchKey } = useSelector((state:AppState) => state.home)

    const [ info, setInfo ] = useState<any>(null);
    const params: ParamProps = useParams();
    const location = useLocation();
    params.networkName = params.networkName || "bsc";
    params.address = params.address || "0x293c3ee9abacb08bb8ced107987f00efd1539288"

    const [ chartAddress, setChartAddress ] = useState(params.address);
    const [ loadingStep, setLoadingStep] = useState(-1);

    // const [currentParams, setParams] = useState<ParamProps>(params)
    const network = linq
        .from(networks)
        .where((x) => x.Name === params.networkName)
        .single()
    params.networkName = network.NickName

    useEffect(() => {
        if(params.address !== searchKey) {
            dispatch(setNetworkInfo({
                searchKey: params.address,
                network: {
                    label: network.Display,
                    value: network.Name,
                    chainId: network.chainId
                }
            }))
        }
    }, [])
    // Get params from url and set it to state variable
    useEffect(() => {
        console.log("Charts Params = ", params);
        // console.log("Charts CurrentParams = ", currentParams);
        // console.log("PathName=", location.pathname);
        const fetchData = async() => {
            // if (!compareParams(params, currentParams)) {
            // if(params.address !== searchKey) {
            //     setLoadingStep(-1);
            //     // setParams(params);
            //     // dispatch(setTimer(
            //     //     setTimeout(() => {
            //     //         dispatch(setNetworkInfo({
            //     //             searchKey: params.address,
            //     //             network: {
            //     //                 label: network.Display,
            //     //                 value: network.Name,
            //     //                 chainId: network.chainId
            //     //             }
            //     //         }))
            //     //     }, 1000)
            //     // ))
            //     dispatch(setNetworkInfo({
            //         searchKey: params.address,
            //         network: {
            //             label: network.Display,
            //             value: network.Name,
            //             chainId: network.chainId
            //         }
            //     }))
            // }
            if(addressType === "Token") {
                setLoadingStep(0);
                const _info:any = await getChartsInfo(params.address, network, params.pairAddress);
                setInfo(_info);
                setLoadingStep(1);
                console.log("getChartInfo(", params.address, ")", _info)
                if(_info.pairs?.length !== 0) {
                    setChartAddress(_info.pairs[0].smartContract.address.address);
                }
            } 
            if(addressType === "DEX") {
                setLoadingStep(1);
                setChartAddress(params.address);
            }
        }
        fetchData();
    }, [params])
    // Determine the address type 
    useEffect(() => {
        console.log("addressType=",addressType, "params=", params);
        if(!addressType && params.address) { // current address is token or not decided yet
            dispatch(fetchAddressType({address: params.address, network: params.networkName}));
        }
        // else {
        //     if(addressType === "Token") {
        //         setChartAddress(params.address)
        //     }
        //     if(addressType === "DEX") {
        //         setChartAddress(params.address)
        //         const fetchTokenAddress = async () => {
        //             const res = await getTokenAddress(params.address);
        //             console.log("fetchTokenAddress res = ", res);
        //         }
        //         fetchTokenAddress();
        //     }
        // }
    }, [])

    // Change Chart Colors
    useEffect(() => {
        // console.log("data title=", `dexscreener.charts.${params.networkName}.${chartAddress}`)
        const chartProperties = JSON.parse(localStorage.getItem(`dexscreener.charts.${params.networkName}.${chartAddress}`));
        // console.log("data=", chartProperties)
        // if(chartProperties) {
        //     chartProperties.charts[0].sessions.properties.graphics.backgrounds.outOfSession.color = "#29FF62";
        //     localStorage.setItem(`dexscreener.charts.${params.networkName}.${chartAddress}`, JSON.stringify(chartProperties));
        // }
        const data = JSON.parse(window.localStorage.getItem("tradingview.chartproperties.mainSeriesProperties"));
        // console.log("data =", data);
        // if(data) {
        //     data.style = 2;
        //     data.lineStyle.color = "#29FF62";
        //     window.localStorage.setItem("tradingview.chartproperties.mainSeriesProperties", JSON.stringify(data));
        // }

    }, [chartAddress, params]);
    
    return <Page>
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-3" style={{display: addressType==="DEX"?"none":""}}>
                    <div className="overflow-hidden">
                        {info ? <Info info={info} network={network} setPair={setChartAddress} /> : <></>}
                    </div>
                </div>
                <div className="col-lg-9 mt-4 mt-lg-0" style={{margin: "auto", display: loadingStep !== 1 ? "none" : "" }}>
                    <div style={{ width: "100%", minHeight: "80vh" }}>
                        <iframe 
                            title="Charts from Dexscreener"
                            scrolling="no"
                            src={`https://dexscreener.com/${params.networkName}/${chartAddress}?embed=1&amp;theme=dark`}
                            className="fit"
                            style={{width: "100%", height: "800px", display: 'block'}} />
                    </div>
                </div>
            </div>
        </div>
    </Page>
}

export default SimpleCharts;