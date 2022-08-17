import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Page from 'views/Page';
import linq from 'linq';
import networks from 'config/constants/networks.json';

export interface ParamProps {
    networkName?: string
    address?: string
    pairAddress?: string
}

const compareParams = (param1: ParamProps, param2: ParamProps) => {
    return (
      param1.address === param2.address &&
      param1.networkName === param2.networkName &&
      param1.pairAddress === param2.pairAddress
    )
}

const SimpleCharts = (props) => {

    const params: ParamProps = useParams();
    params.networkName = params.networkName || "bsc";
    params.address = params.address || "0x293c3ee9abacb08bb8ced107987f00efd1539288"

    const [currentParams, setParams] = useState<ParamProps>({})
    const network = linq
        .from(networks)
        .where((x) => x.Name === params.networkName)
        .single()
    params.networkName = network.NickName

    useEffect(() => {
        console.log("Charts Params = ", params);
        if (!compareParams(params, currentParams)) {
            setParams(params);
        }
    }, [params])

    return <Page>
        <div style={{ width: "100%", minHeight: "80vh" }}>
            <iframe 
                title="Charts from Dexscreener"
                scrolling="no"
                src={`https://dexscreener.com/${params.networkName}/${params.address}?embed=1&amp;theme=dark`}
                className="fit"
                style={{width: "100%", height: "800px", display: 'block'}} />
        </div>
    </Page>
}

export default SimpleCharts;