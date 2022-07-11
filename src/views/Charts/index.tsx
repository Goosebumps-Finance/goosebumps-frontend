import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import linq from 'linq'

import networks from "config/constants/networks.json"

export interface ParamProps {
    networkName?: string
    address?: string
    pairAddress?: string
}

const Charts = (props) => {
    const exchangeContainerRef = useRef()
    const exchangeRef = useRef()
    const hideExchangeRef = useRef()
    const [info, setInfo] = useState()
    const params:ParamProps = useParams()
    params.networkName = params.networkName || "bsc"
    params.address = params.address || "0x293c3ee9abacb08bb8ced107987f00efd1539288"

    const [currentParams, setParams] = useState();
    const network = linq.from(networks).where((x) => x.Name === params.networkName).single();

    return (<>Charts</>)
}

export default Charts;