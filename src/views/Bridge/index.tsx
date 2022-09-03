import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Flex, Input } from '@goosebumps/uikit'
import { ChainId } from '@goosebumps/zx-sdk'
import linq from 'linq'
import { AppBody } from 'components/App'
import ConnectWalletButton from 'components/ConnectWalletButton'
import networks from 'config/constants/networks'
import { State } from 'state/types'
import { setNetworkInfo } from 'state/home'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Page from 'views/Page'
import changeNetwork from 'utils/changeNetwork'

import { StyledBridgeContainer, StyledBridgeContentWrapper } from './styles'
import BridgeCard from './components/BridgeCard'
import './bridge.scss'

const options = {
  [ChainId.MAINNET]: 0,
  [ChainId.TESTNET]: 1,
  [ChainId.ETHEREUM]: 2,
  [ChainId.POLYGON]: 3,
}

const Bridge = () => {
  const { account } = useActiveWeb3React()
  const { network } = useSelector((state: State) => state.home)
  const dispatch = useDispatch()

  const [fromIndex, setFromIndex] = useState(0)
  const [isChanged, setIsChanged] = useState(0)
  const [toIndex, setToIndex] = useState(3)
  const [tokenIndex, setTokenIndex] = useState(3)
  const [loadingStatus, setLoadingStatus] = useState(-1)

  useEffect(() => {
    dispatch(setNetworkInfo({ searchKey: "", network }))
  }, [])

  useEffect(() => {
    switch (network.chainId) {
      case ChainId.MAINNET:
        setFromIndex(0)
        break
      case ChainId.TESTNET:
        setFromIndex(1)
        break
      case ChainId.ETHEREUM:
        setFromIndex(2)
        break
      case ChainId.POLYGON:
        setFromIndex(3)
        break
      default:
        break
    }
    console.log("Bridge chainId = ", network.chainId)
  }, [network])

  const onChangeFromNetwork = async (newNetwork) => {
    const detailedNetwork = linq.from(networks).where((x) => x.Name === newNetwork.value).single()
    const info = { ...newNetwork, chainId: detailedNetwork.chainId };
    console.log("onChangeFromNetwork info = ", info)
    console.log("onChangeFromNetwork fromIndex = ", fromIndex)
    await changeNetwork(detailedNetwork, setLoadingStatus)
    if (loadingStatus === 1) {
      dispatch(setNetworkInfo({ network: { ...newNetwork, chainId: detailedNetwork.chainId } }))
    }
    setLoadingStatus(-1)

  }

  const onChangeToNetwork = async (newNetwork) => {
    let _index = 0;
    // if(newNetwork.value === "ethereum") _index = 0
    if (newNetwork.value === "bsc") _index = 0
    // if(newNetwork.value === "polygon") _index = 2
    if (newNetwork.value === "bsc_testnet") _index = 1
    console.log("onChangeToNetwork network = ", newNetwork, "_index=", _index)
    setToIndex(_index)
  }

  const onChangeTokenNetwork = async (newNetwork) => {
    let _index = 0;
    // if(newNetwork.value === "ethereum") _index = 0
    if (newNetwork.value === "bsc") _index = 0
    // if(newNetwork.value === "polygon") _index = 2
    if (newNetwork.value === "bsc_testnet") _index = 1
    setTokenIndex(_index)
  }

  return (
    <Page style={{ marginBottom: '30px' }}>
      <StyledBridgeContainer>
        <AppBody>
          <StyledBridgeContentWrapper>
            <Flex
              flexDirection={['column', 'column', 'row']}
              justifyContent={['center', 'center', 'space-between']}
              mb="30px"
            >
              <BridgeCard
                variant="from"
                style={{ marginBottom: '30px' }}
                onChangeNetwork={onChangeFromNetwork}
                selIndex={fromIndex}
              />
              <BridgeCard
                variant="to"
                onChangeNetwork={onChangeToNetwork}
                selIndex={toIndex}
              />
            </Flex>
            {account ? (
              <Flex flexDirection="column" alignItems="center" mb="30px">
                <BridgeCard
                  variant="token"
                  onChangeNetwork={onChangeTokenNetwork}
                  selIndex={tokenIndex}
                />
              </Flex>
            ) : (
              <></>
            )}
            {account ? (
              <div className="textOnInput mt-5">
                <label htmlFor="inputText">Recipient</label>
                <input className="input-with-label" type="text" placeholder="Input recipient address" />
              </div>
            ) : (
              <> </>
            )}
            <div className="textOnInput mt-4 mb-4">
              <label htmlFor="inputText">Enter Amount</label>
              <input className="input-with-label" type="text" placeholder="Input amount" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {account ? (
                <Button variant="secondary">Transfer Amount</Button>
              ) : (
                // : <Button variant='secondary'> Connect Wallet</Button>
                <ConnectWalletButton />
              )}
            </div>
          </StyledBridgeContentWrapper>
        </AppBody>
      </StyledBridgeContainer>
    </Page>
  )
}

export default Bridge
