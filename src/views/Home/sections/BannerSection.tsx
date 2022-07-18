import { Box, Button, Flex } from '@goosebumps/uikit'
import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const SectionContainer = styled(Flex)`
  background-image: url('/images/goosebumps/1banner-bg.jpg');
  background-position: center center;
  background-size: cover;
  padding-top: 200px;
  margin-top: -140px;
  height: 100%;
  color: white;
  // ${({ theme }) => theme.mediaQueries.sm} {
  //     padding-bottom: 32px;
  // }
  // ${({ theme }) => theme.mediaQueries.lg} {
  //     padding-bottom: 48px;
  // }
`

const TitleDiv = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 30px;
  line-height: 1.2;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 58px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 46px;
  }
`

const ContentPanel = styled(Box)`
  max-width: 620px;
  margin: auto;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 30px;
    margin-left: auto;
    text-align: left;
  }
`

const BannerImage = styled.img`
  width: fit-content;
  hegith: auto;
  padding: 0px 30px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px;
  }
`

const BannerSection = () => {
  const history = useHistory()

  return (
    <SectionContainer flexDirection={['column', 'column', 'column', 'column', 'row']} justifyContent="space-between">
      <Flex flexDirection="column" flex={1} p="30px">
        <ContentPanel>
          <TitleDiv>Manage Your Crypto and Portfolio From One Place</TitleDiv>
          <p style={{ marginBottom: '40px' }}>
            Goosebumps powered by Empire Token is a decentralized exchange with a unique portfolio tracking and charting
            system.
          </p>
          <div>
            <Button variant="secondary" m="5px" onClick={() => history.push('/portfolio-tracker')}>
              Portfolio Tracker
            </Button>
            <Button variant="secondary" m="5px" onClick={() => history.push('/charts')}>
              Charts
            </Button>
            <Button variant="secondary" m="5px" onClick={() => history.push('/stake')}>
              Stake
            </Button>
            <Button variant="secondary" m="5px" onClick={() => history.push('/swap')}>
              DEX
            </Button>
          </div>
        </ContentPanel>
      </Flex>
      <Flex flex={1} justifyContent={['center', 'center', 'center', 'center', 'flex-end']} alignItems="end">
        <BannerImage src="/images/goosebumps/1banner-img.png" alt="portfolio tracker" />
      </Flex>
    </SectionContainer>
  )
}

export default BannerSection
