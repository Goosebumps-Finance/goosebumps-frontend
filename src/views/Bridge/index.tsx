import React from 'react'
import { Button, Flex, Input } from '@goosebumps/uikit'
import { AppBody } from 'components/App'
import Page from 'views/Page'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'

import { StyledBridgeContainer, StyledBridgeContentWrapper } from './styles'
import BridgeCard from './components/BridgeCard'
import './bridge.scss'

const Bridge = () => {
  const { account } = useActiveWeb3React()

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
              <BridgeCard variant="from" style={{ marginBottom: '30px' }} />
              <BridgeCard variant="to" />
            </Flex>
            {account ? (
              <Flex flexDirection="column" alignItems="center" mb="30px">
                <BridgeCard variant="token" />
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
