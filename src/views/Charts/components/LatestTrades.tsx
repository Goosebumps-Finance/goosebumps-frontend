import { useSlowFresh } from 'hooks/useRefresh'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import NumberFormat from 'react-number-format'
import ReactTooltip from 'react-tooltip'
import ago from 's-ago'
import { Button } from '@goosebumps/uikit'
import { getLatestTrades } from 'utils/getChartsInfo'
import { calculatePricescale, calculateTokenscale } from 'utils/numberHelpers'

const LoadingPanel = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
  color: white;
`

const LatestTrades = ({ pair: propsPair, network }) => {
  const slowRefresh = useSlowFresh()

  const [pair, setPair] = useState(propsPair)
  const [init, setInit] = useState(true)
  const [loading, setLoading] = useState(true)
  const [trades, setTrades] = useState(null)
  const [lastTradesRequest, setLastTradesRequest] = useState(null)

  useEffect(() => {
    if (propsPair.smartContract.address.address !== pair.smartContract.address.address) {
      setPair(propsPair)
      setInit(true)
      setLoading(true)
    }
  }, [pair.smartContract.address.address, propsPair])

  useEffect(() => {
    if (init) {
      setInit(false)
      const getData = async () => {
        const now = parseInt(`${new Date().getTime() / 1000}`)
        const res = await getLatestTrades(pair, network, now - 24 * 60 * 60, now, 20)
        if (res) {
          setTrades(res)
          setLastTradesRequest(now)
          setLoading(false)
        }
      }
      getData()
    }
  }, [init, pair, network])

  useEffect(() => {
    const getData = async () => {
      const now = parseInt(`${new Date().getTime() / 1000}`)
      const res = await getLatestTrades(pair, network, lastTradesRequest, now)
      if (res != null && res.length) {
        // setTrades(res.concat(trades))
        setTrades(trades)
        setLastTradesRequest(now)
      }
    }
    if (!init && !loading) getData()
  }, [init, loading, lastTradesRequest, trades, pair, network, slowRefresh])

  const renderLoading = () => {
    return (
      <LoadingPanel>
        <span className="spinner-border" role="status" />
      </LoadingPanel>
    )
  }

  const renderContent = () => {
    if (loading) return <></>
    return (
      <>
        <h3 className="table-title">
          <span>TRADE HISTORY</span>
        </h3>
        <div className="table-responsive tournament-table latest-trades mt-0">
          <table className="table align-middle mb-0">
            <thead className="sticky-top">
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Type</th>
                <th scope="col">Tokens</th>
                <th scope="col">Price</th>
                <th scope="col">Value</th>
                <th scope="col">Dex</th>
                <th scope="col" style={{ width: '90px' }}>
                  {' '}
                </th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr key={`${trade.tx}${trade.value}`}>
                  <td>
                    <span
                      data-tip
                      data-for={`trade_tooltip_time_${index}`}
                      // href={trade.tx}
                      // target="_blank"
                      // rel="noopener noreferrer"
                    >
                      {ago(new Date(trade.time))}
                    </span>
                    <ReactTooltip place="bottom" id={`trade_tooltip_time_${index}`} aria-haspopup="true">
                      {new Date(trade.time).toLocaleString()}
                    </ReactTooltip>
                  </td>
                  <td>
                    <span
                      className={trade.isBuy ? 'buy' : 'sell'}
                      // href={trade.tx}
                      // target="_blank"
                      // rel="noopener noreferrer"
                    >
                      {trade.isBuy ? 'Buy' : 'Sell'}
                    </span>
                  </td>
                  <td>
                    <span
                    // href={trade.tx}
                    // target="_blank"
                    // rel="noopener noreferrer"
                    >
                      <NumberFormat
                        value={trade.tokens}
                        decimalScale={calculateTokenscale(trade.price)}
                        displayType="text"
                        thousandSeparator=","
                      />
                    </span>
                  </td>
                  <td>
                    <span
                      data-tip
                      data-for={`trade_tooltip_price_${index}`}
                      // href={trade.tx}
                      // target="_blank"
                      // rel="noopener noreferrer"
                    >
                      <NumberFormat
                        value={trade.priceUSD}
                        decimalScale={calculatePricescale(trade.priceUSD)}
                        decimalSeparator="."
                        displayType="text"
                        thousandSeparator=","
                        prefix="$"
                      />
                    </span>
                    <ReactTooltip place="bottom" id={`trade_tooltip_price_${index}`} aria-haspopup="true">
                      <NumberFormat
                        value={trade.price}
                        decimalScale={calculatePricescale(trade.price)}
                        displayType="text"
                        thousandSeparator=","
                        suffix={` ${trade.symbol}`}
                      />
                    </ReactTooltip>
                  </td>
                  <td>
                    <span
                      data-tip
                      data-for={`trade_tooltip_value_${index}`}
                      // href={trade.tx}
                      // target="_blank"
                      // rel="noopener noreferrer"
                    >
                      <NumberFormat
                        value={trade.valueUSD}
                        decimalScale={2}
                        decimalSeparator="."
                        displayType="text"
                        thousandSeparator=","
                        prefix="$"
                      />
                    </span>
                    <ReactTooltip place="bottom" id={`trade_tooltip_value_${index}`} aria-haspopup="true">
                      <NumberFormat
                        value={trade.value}
                        decimalScale={8}
                        decimalSeparator="."
                        displayType="text"
                        thousandSeparator=","
                        suffix={` ${trade.symbol}`}
                      />
                    </ReactTooltip>
                  </td>
                  <td>{trade.dex}</td>
                  <td className="text-end">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        window.open(`${network.Explorer}tx/${trade.tx}`, '_blank', 'noopener noreferrer')
                      }}
                      style={{
                        padding: '10px 14px',
                        height: 'auto',
                        borderRadius: '10px',
                        borderColor: 'gray',
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )
  }

  return (
    <>
      {loading && renderLoading()}
      {renderContent()}
    </>
  )
}

export default LatestTrades
