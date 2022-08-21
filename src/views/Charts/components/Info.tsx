import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import NumberFormat from 'react-number-format'
import { useFastFresh } from 'hooks/useRefresh'
import { getTokenInfo } from 'utils/getTokenInfos'
import { calculatePricescale } from 'utils/numberHelpers'

const LoadingPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto 0px;
  color: white;
`

const Info = ({ info, network, setPair }) => {
  // const fastRefresh = useFastFresh()
  const [loading, setLoading] = useState(true)
  const [liveInfo, setLiveInfo] = useState<any>({})
  const [show, setShow] = useState(false)
  const [hasCMC, setHasCMC] = useState(false);

  useEffect(() => {
    if(!info) return;
    // console.log("bug= getData loading = ", loading)
    // console.log("bug= getData liveInfo = ", liveInfo)
    setHasCMC(info.cmc && Object.hasOwn(info.cmc, "id"));
    console.log("hasCMC=",info.cmc && Object.hasOwn(info.cmc, "id"))
    const getData = async () => {
      const res = await getTokenInfo(info.pair, network)
      // console.log("setLiveInfo res = ", res)
      if (res) {
        setLiveInfo(res)
        if (loading) setLoading(false)
      }
      
    }
    getData()
  }, [loading, info, network])

  const linkify = (inputText) => {
    let replacedText

    // URLs starting with http://, https://, or ftp://
    const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>')

    // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    const replacePattern2 = /(^|[^/])(www\.[\S]+(\b|$))/gim
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>')

    // Change email addresses to mailto:: links.
    const replacePattern3 = /(([a-zA-Z0-9\-_.])+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>')

    return replacedText
  }

  const getIconForUrl = (url) => {
    if (url.indexOf('//t.me') > 0) {
      return 'fa fa-telegram'
    }
    if (url.indexOf('discord.gg') > 0) {
      return 'fab fa-discord'
    }
    if (url.indexOf('medium.com') > 0) {
      return 'fa fa-medium'
    }
    if (url.indexOf('twitter.com') > 0) {
      return 'fa fa-twitter'
    }
    if (url.indexOf('reddit.com') > 0) {
      return 'fa fa-reddit'
    }
    if (url.indexOf('facebook.com') > 0) {
      return 'fa fa-facebook'
    }
    return 'fa fa-question-circle'
  }

  const onPairChange = (e) => {
    // window.location = `/charts/${network.Name}/${info.address}/${e.target.value}`;
    console.log("setPair=", setPair, e.target.value)
    if(setPair) {
      setPair(e.target.value)
    }
    // alert(e.target.value)
  }

  const renderLoading = () => {
    return (
      <LoadingPanel>
        <span className="spinner-border" role="status" />
      </LoadingPanel>
    )
  }

  const renderCMC = () => {
    if(hasCMC)
    {
      info.cmc.urls.chat.map((item) => {
        return item
      })
    }
    
    return (
      <>
        <div className="row">
          <div className="row col">
            <img
              src={ hasCMC && info.cmc.logo || '/images/logo-icon.png'}
              width="64"
              className="col-auto"
              alt="{info.pair.buyCurrency.symbol}"
            />
            <div className="col align-self-center" style={{ color: 'white' }}>
              <div className="fs-5">{info.pair.buyCurrency.name}</div>
              <div className="fs-6">{info.pair.buyCurrency.symbol}</div>
            </div>
          </div>
          <div className="col-auto color-green text-end fs-5">
            {liveInfo.isETH ? (
              <>
                <NumberFormat
                  value={liveInfo.price * liveInfo.ethPrice}
                  decimalScale={calculatePricescale(liveInfo.price * liveInfo.ethPrice)}
                  decimalSeparator="."
                  displayType="text"
                  thousandSeparator=","
                  prefix="$"
                />
                <div className="text-secondary fs-6">
                  (
                  <NumberFormat
                    value={liveInfo.price}
                    decimalScale={calculatePricescale(liveInfo.price)}
                    decimalSeparator="."
                    displayType="text"
                    thousandSeparator=","
                    suffix={` ${info.pair.sellCurrency.symbol}`}
                  />
                  )
                </div>
              </>
            ) : (
              <NumberFormat
                value={liveInfo.price}
                decimalScale={calculatePricescale(liveInfo.price)}
                decimalSeparator="."
                displayType="text"
                thousandSeparator=","
                suffix={` ${info.pair.sellCurrency.symbol}`}
              />
            )}
          </div>
        </div>

        <div className="mt-2 row align-items-center" style={{ color: 'white' }}>
          <div className="col text-truncate">{info.address}</div>
          <div className="col-auto">
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(info.address)}
              className="default-btn p-2 border-0"
            >
              <i className="fa fa-clone" />
            </button>{' '}
            <a
              className="default-btn p-2 border-0"
              href={`${network.Explorer}token/${info.pair.buyCurrency.address}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Scan"
            >
              <i className="fa fa-external-link" />
            </a>
          </div>
        </div>

        <select
          className="form-select py-1 mt-2"
          onChange={onPairChange}
          defaultValue={info.pair.smartContract.address.address}
        >
          {info.pairs.map((item, index) => (
            <option key={JSON.stringify(item)} value={item.smartContract.address.address}>
              {item.buyCurrency.symbol}/{item.sellCurrency.symbol} ({item.exchange.fullName})
            </option>
          ))}
        </select>

        <div className="text-center d-lg-none">
          <button onClick={() => setShow(!show)} type="button" className="default-btn btn-sq mt-2 w-100">
            {!show ? 'Show more details' : 'Hide details'}
          </button>
        </div>

        <div className={show ? 'd-lg-block' : 'd-none d-lg-block'}>
          <div className="mt-4">
            <div style={{ color: 'white' }}>
              <b>Price:</b>
              <div className="color-green">
                {liveInfo.isETH ? (
                  <>
                    <NumberFormat
                      value={liveInfo.price * liveInfo.ethPrice}
                      decimalScale={calculatePricescale(liveInfo.price * liveInfo.ethPrice)}
                      decimalSeparator="."
                      displayType="text"
                      thousandSeparator=","
                      prefix="$"
                    />{' '}
                    <span className="text-secondary">
                      (
                      <NumberFormat
                        value={liveInfo.price}
                        decimalScale={calculatePricescale(liveInfo.price)}
                        decimalSeparator="."
                        displayType="text"
                        thousandSeparator=","
                        suffix={` ${info.pair.sellCurrency.symbol}`}
                      />
                      )
                    </span>
                  </>
                ) : (
                  <NumberFormat
                    value={liveInfo.price}
                    decimalScale={calculatePricescale(liveInfo.price)}
                    decimalSeparator="."
                    displayType="text"
                    thousandSeparator=","
                    suffix={` ${info.pair.sellCurrency.symbol}`}
                  />
                )}
              </div>
            </div>
            <div className="mt-2" style={{ color: 'white' }}>
              <b>Market Cap (Includes locked, excludes burned):</b>
              <div className="color-green">
                {liveInfo.isETH ? (
                  <>
                    <NumberFormat
                      value={liveInfo.marketCap * liveInfo.ethPrice}
                      decimalScale={0}
                      decimalSeparator=""
                      displayType="text"
                      thousandSeparator=","
                      prefix="$"
                    />{' '}
                    <span className="text-secondary">
                      (
                      <NumberFormat
                        value={liveInfo.marketCap}
                        decimalScale={2}
                        decimalSeparator="."
                        displayType="text"
                        thousandSeparator=","
                        suffix={` ${info.pair.sellCurrency.symbol}`}
                      />
                      )
                    </span>
                  </>
                ) : (
                  <NumberFormat
                    value={liveInfo.marketCap}
                    decimalScale={2}
                    decimalSeparator="."
                    displayType="text"
                    thousandSeparator=","
                    suffix={` ${info.pair.sellCurrency.symbol}`}
                  />
                )}
              </div>
            </div>
            <div className="mt-2" style={{ color: 'white' }}>
              <b>
                LP Holdings for {info.pair.buyCurrency.symbol}/{info.pair.sellCurrency.symbol}:
              </b>
              <div className="color-green">
                {liveInfo.isETH ? (
                  <>
                    <NumberFormat
                      value={liveInfo.lp * liveInfo.ethPrice}
                      decimalScale={0}
                      decimalSeparator=""
                      displayType="text"
                      thousandSeparator=","
                      prefix="$"
                    />{' '}
                    <span className="text-secondary">
                      (
                      <NumberFormat
                        value={liveInfo.lp}
                        decimalScale={2}
                        decimalSeparator="."
                        displayType="text"
                        thousandSeparator=","
                        suffix={` ${info.pair.sellCurrency.symbol}`}
                      />
                      )
                    </span>
                  </>
                ) : (
                  <NumberFormat
                    value={liveInfo.lp}
                    decimalScale={2}
                    decimalSeparator="."
                    displayType="text"
                    thousandSeparator=","
                    suffix={` ${info.pair.sellCurrency.symbol}`}
                  />
                )}
              </div>
            </div>
            <div className="mt-2" style={{ color: 'white' }}>
              <b>Total Supply:</b>
              <div className="color-green">
                <NumberFormat
                  value={liveInfo.supply.total}
                  decimalScale={0}
                  decimalSeparator=""
                  displayType="text"
                  thousandSeparator=","
                />
              </div>
            </div>
            <div className="mt-2" style={{ color: 'white' }}>
              <b>Circulation Supply:</b>
              <br />
              <div className="color-green">
                <NumberFormat
                  value={liveInfo.supply.circulation}
                  decimalScale={0}
                  decimalSeparator=""
                  displayType="text"
                  thousandSeparator=","
                />
              </div>
            </div>
          </div>

          <div
            className="mt-4"
            dangerouslySetInnerHTML={{
              __html: hasCMC ? linkify(info.cmc.description) : "No description",
            }}
            style={{ color: 'white' }}
          />
          {hasCMC?<div className="mt-4">
            <div className="social-icons">
              {info.cmc.urls.website.map((item, index) => (
                <a key={item} href={item} rel="noopener noreferrer">
                  <i className="fa fa-globe" />
                </a>
              ))}
              {info.cmc.urls.chat.map((item, index) => (
                <a key={item} href={item} rel="noopener noreferrer">
                  <i className={getIconForUrl(item)} />
                </a>
              ))}
              {info.cmc.urls.twitter.map((item, index) => (
                <a key={item} href={item} rel="noopener noreferrer">
                  <i className={getIconForUrl(item)} />
                </a>
              ))}
              {info.cmc.urls.facebook.map((item, index) => (
                <a key={item} href={item} rel="noopener noreferrer">
                  <i className={getIconForUrl(item)} />
                </a>
              ))}
              {info.cmc.urls.announcement.map((item, index) => (
                <a key={item} href={item} rel="noopener noreferrer">
                  <i className={getIconForUrl(item)} />
                </a>
              ))}
              {info.cmc.urls.message_board.map((item, index) => (
                <a key={item} href={item} rel="noopener noreferrer">
                  <i className={getIconForUrl(item)} />
                </a>
              ))}
              {info.cmc.urls.reddit.map((item, index) => (
                <a key={item} href={item} rel="noopener noreferrer">
                  <i className={getIconForUrl(item)} />
                </a>
              ))}
              {info.cmc.urls.technical_doc.map((item, index) => (
                <a key={item} href={item} rel="noopener noreferrer">
                  <i className="fa fa-file-alt" />
                </a>
              ))}
              {info.cmc.urls.source_code.map((item, index) => (
                <a key={item} href={item} rel="noopener noreferrer">
                  <i className="fa fa-file-code" />
                </a>
              ))}
            </div>
          </div>:<></>}
          
        </div>
      </>
    )
  }

  const renderContent = () => {
    return (
      <>
        <div className="row">
          <div className="row col">
            <img
              src="/images/unknown_token.png"
              width="64"
              className="col-auto"
              alt="{info.pair.buyCurrency.symbol}"
              style={{width: "64px", height: "auto", padding: "0.5rem", marginLeft: "1rem"}}
            />
            <div className="col align-self-center" style={{color: 'white'}}>
              <div className="fs-5">{info.pair.buyCurrency.name}</div>
              <div className="fs-6">{info.pair.buyCurrency.symbol}</div>
            </div>
          </div>
          <div className="col-auto color-green text-end fs-5">
            {liveInfo.isETH ? (
              <>
                <NumberFormat
                  value={liveInfo.price * liveInfo.ethPrice}
                  decimalScale={calculatePricescale(liveInfo.price * liveInfo.ethPrice)}
                  decimalSeparator="."
                  displayType="text"
                  thousandSeparator=","
                  prefix="$"
                />
                <div className="text-secondary fs-6">
                  (
                  <NumberFormat
                    value={liveInfo.price}
                    decimalScale={calculatePricescale(liveInfo.price)}
                    decimalSeparator="."
                    displayType="text"
                    thousandSeparator=","
                    suffix={` ${info.pair.sellCurrency.symbol}`}
                  />
                  )
                </div>
              </>
            ) : (
              <NumberFormat
                value={liveInfo.price}
                decimalScale={calculatePricescale(liveInfo.price)}
                decimalSeparator="."
                displayType="text"
                thousandSeparator=","
                suffix={` ${info.pair.sellCurrency.symbol}`}
              />
            )}
          </div>
        </div>

        <div className="row mt-2">
          <div className="text-truncate">
            <span className="float-end ps-1" >
              {/* <i className="fa fa-clone"></i>{" "} */}
              <a
                href={`${network.Explorer}token/${info.pair.buyCurrency.address}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Scan"
              >
                <i className="fa fa-external-link" />
              </a>
            </span>
            <span style={{color: 'white'}}>{info.address}</span>
          </div>
        </div>

        <select
          className="form-select py-1 mt-2"
          onChange={onPairChange}
          defaultValue={info.pair.smartContract.address.address}
        >
          {info.pairs.map((item, index) => (
            <option key={JSON.stringify(item)} value={item.smartContract.address.address}>
              {item.buyCurrency.symbol}/{item.sellCurrency.symbol} ({item.exchange.fullName})
            </option>
          ))}
        </select>

        <div className="text-center d-lg-none">
          <button onClick={() => setShow(!show)} type="button" className="default-btn btn-sq mt-2 w-100">
            {!show ? 'Show more details' : 'Hide details'}
          </button>
        </div>

        <div className={show ? 'd-lg-block' : 'd-none d-lg-block'}>
          <div className="mt-4">
            <div>
              <b style={{color: 'white'}}>Price:</b>
              <div className="color-green">
                {liveInfo.isETH ? (
                  <>
                    <NumberFormat
                      value={liveInfo.price * liveInfo.ethPrice}
                      decimalScale={calculatePricescale(liveInfo.price * liveInfo.ethPrice)}
                      decimalSeparator="."
                      displayType="text"
                      thousandSeparator=","
                      prefix="$"
                    />{' '}
                    <span className="text-secondary">
                      (
                      <NumberFormat
                        value={liveInfo.price}
                        decimalScale={calculatePricescale(liveInfo.price)}
                        decimalSeparator="."
                        displayType="text"
                        thousandSeparator=","
                        suffix={` ${info.pair.sellCurrency.symbol}`}
                      />
                      )
                    </span>
                  </>
                ) : (
                  <NumberFormat
                    value={liveInfo.price}
                    decimalScale={calculatePricescale(liveInfo.price)}
                    decimalSeparator="."
                    displayType="text"
                    thousandSeparator=","
                    suffix={` ${info.pair.sellCurrency.symbol}`}
                  />
                )}
              </div>
            </div>
            <div className="mt-2">
              <b style={{color: 'white'}}>Market Cap (Includes locked, excludes burned):</b>
              <div className="color-green">
                {liveInfo.isETH ? (
                  <>
                    <NumberFormat
                      value={liveInfo.marketCap * liveInfo.ethPrice}
                      decimalScale={0}
                      decimalSeparator=""
                      displayType="text"
                      thousandSeparator=","
                      prefix="$"
                    />{' '}
                    <span className="text-secondary">
                      (
                      <NumberFormat
                        value={liveInfo.marketCap}
                        decimalScale={2}
                        decimalSeparator="."
                        displayType="text"
                        thousandSeparator=","
                        suffix={` ${info.pair.sellCurrency.symbol}`}
                      />
                      )
                    </span>
                  </>
                ) : (
                  <NumberFormat
                    value={liveInfo.marketCap}
                    decimalScale={2}
                    decimalSeparator="."
                    displayType="text"
                    thousandSeparator=","
                    suffix={` ${info.pair.sellCurrency.symbol}`}
                  />
                )}
              </div>
            </div>
            <div className="mt-2">
              <b style={{color: 'white'}}>
                LP Holdings for {info.pair.buyCurrency.symbol}/{info.pair.sellCurrency.symbol}:
              </b>
              <div className="color-green">
                {liveInfo.isETH ? (
                  <>
                    <NumberFormat
                      value={liveInfo.lp * liveInfo.ethPrice}
                      decimalScale={0}
                      decimalSeparator=""
                      displayType="text"
                      thousandSeparator=","
                      prefix="$"
                    />{' '}
                    <span className="text-secondary">
                      (
                      <NumberFormat
                        value={liveInfo.lp}
                        decimalScale={2}
                        decimalSeparator="."
                        displayType="text"
                        thousandSeparator=","
                        suffix={` ${info.pair.sellCurrency.symbol}`}
                      />
                      )
                    </span>
                  </>
                ) : (
                  <NumberFormat
                    value={liveInfo.lp}
                    decimalScale={2}
                    decimalSeparator="."
                    displayType="text"
                    thousandSeparator=","
                    suffix={` ${info.pair.sellCurrency.symbol}`}
                  />
                )}
              </div>
            </div>
            <div className="mt-2">
              <b style={{color: 'white'}}>Total Supply:</b>
              <div className="color-green">
                <NumberFormat
                  value={liveInfo.supply.total}
                  decimalScale={0}
                  decimalSeparator=""
                  displayType="text"
                  thousandSeparator=","
                />
              </div>
            </div>
            <div className="mt-2">
              <b style={{color: 'white'}}>Circulation Supply:</b>
              <br />
              <div className="color-green">
                <NumberFormat
                  value={liveInfo.supply.circulation}
                  decimalScale={0}
                  decimalSeparator=""
                  displayType="text"
                  thousandSeparator=","
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return <>{loading ? renderLoading() : hasCMC ? renderCMC() : renderContent()}</>
}

export default Info
