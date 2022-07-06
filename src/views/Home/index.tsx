import React from 'react'
import { Flex } from '@goosebumps/uikit'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import { PageMeta } from 'components/Layout/Page'
import Hero from './components/Hero'
import { swapSectionData, earnSectionData, cakeSectionData } from './components/SalesSection/data'
import MetricsSection from './components/MetricsSection'
import SalesSection from './components/SalesSection'
import WinSection from './components/WinSection'
import FarmsPoolsRow from './components/FarmsPoolsRow'
import Footer from './components/Footer'
import CakeDataRow from './components/CakeDataRow'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopRight } from './components/WedgeSvgs'
import UserBanner from './components/UserBanner'
import IFOBanner from './components/Banners/IFOBanner'
import BannerSection from './sections/BannerSection'
import PortfolioSection from './sections/PortfolioSection'
import ChartSection from './sections/ChartSection'

const showBanner = true

const HomeBanner = ({ account }: { account: string }) => {
  if (!showBanner) {
    return null
  }

  return (
    <Flex
      pt={[account ? '220px' : '0', null, null, account ? '76px' : '0']}
      mt={[account ? '0' : '-16px', null, null, account ? '0' : '-48px']}
      pb="24px"
    >
      <IFOBanner />
    </Flex>
  )
}

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const UserBannerWrapper = styled(Container)`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const Home: React.FC = () => {
  
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  return (
    <>
      <PageSection
        index={2}
        innerProps={{style: {margin: '0', width: '100%', maxWidth: '2000px', paddingLeft: 0, paddingRight: 0, paddingTop: 0}}}
        style={{marginTop: "-90px"}}
        hasCurvedDivider={false}
      >
        <BannerSection />
      </PageSection>
      <PageSection
        index={2}
        innerProps={{style: {margin: '0', width: '100%', padding: 0}}}
        background="url('/images/goosebumps/2portfolio-bg.jpg') center center no-repeat"
        style={{marginTop: "-48px", padding: "100px 0"}}
        hasCurvedDivider={false}
      >
        <PortfolioSection />
      </PageSection>
      <PageSection
        index={2}
        innerProps={{style: {margin: '0', width: '100%', padding: 0}}}
        background="url('/images/goosebumps/3wrap-bg.jpg') center center no-repeat"
        style={{marginTop: "-48px", padding: "100px 0"}}
        hasCurvedDivider={false}
      >
        <ChartSection />        
      </PageSection>
    </>
  )
}

export default Home
