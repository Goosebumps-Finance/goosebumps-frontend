import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import linq from 'linq'
import styled from 'styled-components'

import Page from 'views/Page'
import networks from 'config/constants/networks.json'
import { getChartsInfo } from 'utils/getChartsInfo'
import Info from './components/Info'
import Chart from './components/Chart'
import LatestTrades from './components/LatestTrades'

export interface ParamProps {
  networkName?: string
  address?: string
  pairAddress?: string
}

const HintText = styled.p`
  font-weight: bold;
  font-size: 1.75rem;
`

const LoadingPanel = styled.div`
  display: flex;
  align-items: center;
  color: white;
`

const compareParms = (param1: ParamProps, param2: ParamProps) => {
  return (
    param1.address === param2.address &&
    param1.networkName === param2.networkName &&
    param1.pairAddress === param2.pairAddress
  )
}

const Charts = (props) => {
  const exchangeContainerRef = useRef()
  const exchangeRef = useRef()
  const hideExchangeRef = useRef()
  const [isLoading, setIsLoading] = useState(true)
  const [info, setInfo] = useState<any>(null)
  const params: ParamProps = useParams()
  params.networkName = params.networkName || 'bsc'
  params.address = params.address || '0x293c3ee9abacb08bb8ced107987f00efd1539288'

  const [currentParams, setParams] = useState<ParamProps>({})
  const network = linq
    .from(networks)
    .where((x) => x.Name === params.networkName)
    .single()

  useEffect(() => {
    if (!compareParms(params, currentParams) && info) {
      setInfo(null)
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [params, currentParams, info])

  useEffect(() => {
    const fetchData = async () => {
      if (!compareParms(params, currentParams)) {
        setParams(params)
        const _info = await getChartsInfo(params.address, network, params.pairAddress)
        setInfo(_info)
        console.log("fetchData info=", _info)
      }
    }
    fetchData()
  }, [params, currentParams, network])

  const renderLoading = () => {
    return (
      <LoadingPanel>
        <span className="spinner-border" role="status" /> <span style={{ margin: 'auto 20px' }}> </span>
      </LoadingPanel>
    )
  }

  const renderContent = () => {
    if (!info) return <HintText>No result</HintText>
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="overflow-hidden">
                <Info info={info} network={network} />
              </div>
            </div>
            <div className="col-lg-9 mt-4 mt-lg-0">
              <div className="row">
                <div
                  ref={exchangeContainerRef}
                  className="mb-4 mb-xl-0 order-1 col-12"
                  // className={"mb-4 mb-xl-0 order-1 col-xl-7"}
                >
                  <div className="row h-100 m-0">
                    <div className="col p-0">
                      <Chart title={info.title} pair={info.pair} network={network} />
                    </div>
                    {/* <div
                                className="d-none d-xl-block col-auto hider fa fa-arrow-right"
                                ref={hideExchangeRef}
                                onClick={onHideExchange}
                            ></div> */}
                  </div>
                </div>
                <div className="col-xl-5 order-3 order-xl-2 mt-4 mt-xl-0 ps-xl-0" ref={exchangeRef}>
                  {/* <Exchange
                            network={network}
                            fromSymbol={info.pair.sellCurrency.symbol}
                            fromAddress={info.pair.sellCurrency.address}
                            toSymbol={info.pair.buyCurrency.symbol}
                            toAddress={info.pair.buyCurrency.address}
                            /> */}
                </div>
                <div className="col-12 order-2 order-xl-3 mt-4">
                  <LatestTrades pair={info.pair} network={network} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return <Page>
    <div style={{minHeight: "80vh"}}>
      {isLoading ? renderLoading() : renderContent()}
    </div>
    </Page>
}

export default Charts
