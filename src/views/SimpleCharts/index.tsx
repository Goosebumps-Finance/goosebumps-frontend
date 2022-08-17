import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Page from 'views/Page';
import linq from 'linq';
import networks from 'config/constants/networks.json';
import { fetchAddressType, setNetworkInfo } from 'state/home';
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

    const { addressType } = useSelector((state:AppState) => state.home)

    const [ info, setInfo ] = useState<any>(null);
    const params: ParamProps = useParams();
    params.networkName = params.networkName || "bsc";
    params.address = params.address || "0x293c3ee9abacb08bb8ced107987f00efd1539288"

    const [ chartAddress, setChartAddress ] = useState(params.address);

    const [currentParams, setParams] = useState<ParamProps>({})
    const network = linq
        .from(networks)
        .where((x) => x.Name === params.networkName)
        .single()
    params.networkName = network.NickName

    // Get params from url and set it to state variable
    useEffect(() => {
        console.log("Charts Params = ", params);
        const fetchData = async() => {
            if (!compareParams(params, currentParams)) {
                setParams(params);
                dispatch(setNetworkInfo({
                    searchKey: params.address,
                    network: {
                        label: network.Display,
                        value: network.Name,
                        chainId: network.chainId
                    }
                }))
                if(addressType === "Token") {
                    const _info = await getChartsInfo(params.address, network, params.pairAddress);
                    setInfo(_info);
                    console.log("getChartInfo(", params.address, ")", _info)
                }                
            }
        }
        fetchData();        
    }, [params])
    // Determine the address type 
    useEffect(() => {
        if(!addressType) { // current address is token or not decided yet
            dispatch(fetchAddressType({address: params.address, network: params.networkName}));
        } else {
            if(addressType === "Token") {
                setChartAddress(params.address)
            }
            if(addressType === "DEX") {
                const fetchTokenAddress = async () => {
                    const res = await getTokenAddress(params.address);
                    console.log("fetchTokenAddress res = ", res);
                }
                fetchTokenAddress();
            }
        }
    }, [addressType])

    console.log("addressType=", addressType)
    return <Page>
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-3" style={{display: addressType==="DEX"?"none":""}}>
                    <div className="overflow-hidden">
                        <Info info={info} network={network} setPair={setChartAddress} />
                    </div>
                </div>
                <div className="col-lg-9 mt-4 mt-lg-0" style={{margin: "auto"}}>
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