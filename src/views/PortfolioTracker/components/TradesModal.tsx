import React from 'react'
import { Modal } from 'react-bootstrap'
import NumberFormat from 'react-number-format'
import { Button } from '@goosebumps/uikit'

const TradesModal = ({ hide, token, network }) => {
  if (!token) {
    return null
  }

  const styles = {
    btnStyle: {
      borderRadius: '10px',
      borderColor: 'grey',
      height: 'auto',
      padding: '10px 14px',
    },
  }

  const isBuyOrIn = (trade) => trade.transactionType === 1 || trade.transactionType === 3

  const getTransactionType = (trade) => {
    switch (trade.transactionType) {
      case 1:
        return 'Buy'
      case 2:
        return 'Sell'
      case 3:
        return 'In'
      case 4:
        return 'Out'
      default:
        return ''
    }
  }

  return (
    <Modal show size="xl" onHide={hide}>
      <div className="bg-dark border border-info">
        <Modal.Header className="border-info">
          <Modal.Title>Trades for {token.pair.buyCurrency.name}</Modal.Title>
          <Button variant="secondary" onClick={hide} style={styles.btnStyle}>
            <i className="fa fa-times" />
          </Button>
        </Modal.Header>
        <Modal.Body className="p-0 table-responsive m-0">
          <table className="table table-dark table-striped m-0 text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th scope="col">Tokens</th>
                <th scope="col">Price</th>
                <th scope="col">Value</th>
                <th scope="col">Avg. Buy Price</th>
                <th scope="col">Slippage</th>
                <th scope="col">Profit</th>
                <th scope="col"> </th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {token.trades.map((trade, index) => (
                <tr key={JSON.stringify(trade)}>
                  <td>{new Date(trade.dateTime).toLocaleString()}</td>
                  <td className={isBuyOrIn(trade) ? 'text-success' : 'text-danger'}>{getTransactionType(trade)}</td>
                  <td>
                    <NumberFormat
                      value={trade.tokenAmount}
                      decimalScale={token.info.tokenscale}
                      displayType="text"
                      thousandSeparator=","
                    />
                  </td>
                  <td>
                    {trade.transactionType === 3 || trade.transactionType === 4 ? (
                      <div className="input-group" style={{ width: 130 }}>
                        <NumberFormat
                          className="form-control py-1 px-2"
                          value={trade.priceUSD}
                          decimalScale={token.info.pricescale}
                          onChange={(e) => {
                            // localStorage.setItem(`price_${trade.tx}`, `0`)
                            localStorage.setItem(
                              `price_${trade.tx}`,
                              `${parseFloat(e.target.value.replace(/[^0-9.]/g, ''))}`,
                            )
                          }}
                          thousandSeparator=","
                          prefix="$"
                        />
                        <Button
                          onClick={(e) => {
                            // localStorage.setItem(`price_${trade.tx}`, 0)
                            localStorage.setItem(`price_${trade.tx}`, `0`)
                          }}
                          style={styles.btnStyle}
                          // className="default-btn btn-sq px-3 py-1 align-middle"
                        >
                          <i className="fa fa-times" />{' '}
                        </Button>
                      </div>
                    ) : (
                      <NumberFormat
                        value={trade.priceUSD}
                        decimalScale={token.info.pricescale}
                        displayType="text"
                        thousandSeparator=","
                        prefix="$"
                      />
                    )}
                  </td>
                  <td>
                    <NumberFormat
                      value={trade.priceUSD * trade.tokenAmount}
                      decimalScale={2}
                      displayType="text"
                      thousandSeparator=","
                      prefix="$"
                    />
                  </td>
                  <td>
                    {isBuyOrIn(trade) ? (
                      <>-</>
                    ) : (
                      <NumberFormat
                        value={trade.avarageBuyPriceOfHoldings}
                        decimalScale={token.info.pricescale}
                        displayType="text"
                        thousandSeparator=","
                        prefix="$"
                      />
                    )}
                  </td>
                  <td>
                    {!isBuyOrIn(trade) ? (
                      <NumberFormat
                        value={localStorage.getItem(`slippage_${trade.tx}`) || 0}
                        decimalScale={2}
                        displayType="text"
                        thousandSeparator=","
                        suffix="%"
                      />
                      // <div className="input-group" style={{ width: 130 }}>
                      //   <NumberFormat
                      //     className="form-control py-1 px-2"
                      //     value={localStorage.getItem(`slippage_${trade.tx}`) || 0}
                      //     decimalScale={2}
                      //     onChange={(e) => {
                      //       // localStorage.setItem(`slippage_${trade.tx}`, parseFloat(e.target.value.replace(/[^0-9.]/g, "")))
                      //       localStorage.setItem(
                      //         `slippage_${trade.tx}`,
                      //         `${parseFloat(e.target.value.replace(/[^0-9.]/g, ''))}`,
                      //       )
                      //     }}
                      //     thousandSeparator=","
                      //     suffix="%"
                      //   />
                      //   <Button
                      //     onClick={(e) => {
                      //       // localStorage.setItem(`slippage_${trade.tx}`, 0)
                      //       localStorage.setItem(`slippage_${trade.tx}`, `0`)
                      //     }}
                      //     variant="secondary"
                      //     style={styles.btnStyle}
                      //     // className="default-btn btn-sq px-3 py-1 align-middle"
                      //   >
                      //     <i className="fa fa-times" />{' '}
                      //   </Button>
                      // </div>
                    ) : (
                      <>-</>
                    )}
                  </td>
                  <td>
                    {isBuyOrIn(trade) ? (
                      <>-</>
                    ) : (
                      <NumberFormat
                        value={trade.profit}
                        decimalScale={2}
                        displayType="text"
                        thousandSeparator=","
                        prefix="$"
                      />
                    )}
                  </td>
                  <td className="text-end">
                    <Button
                      variant="secondary"
                      style={{
                        borderRadius: '10px',
                        borderColor: 'grey',
                        height: 'auto',
                        padding: '0.25rem 1rem',
                      }}
                      onClick={() => {
                        window.open(`${network.Explorer}tx/${trade.tx}`, '_blank', 'noopener noreferrer')
                      }}
                    >
                      Details
                    </Button>
                    {/* <a className="default-btn btn-sq px-3 py-1 align-middle" 
                                        href={`${network.Explorer}tx/${trade.tx}`} target="_blank" rel="noopener noreferrer">Details</a> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer className="border-info">
          <Button variant="secondary" style={styles.btnStyle} onClick={hide}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  )
}

export default TradesModal
