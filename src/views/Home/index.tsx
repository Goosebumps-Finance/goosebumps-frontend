import React, { useEffect } from 'react'
import { Flex } from '@goosebumps/uikit'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'state/types'
import { setNetworkInfo, setTimer } from 'state/home'
import PageSection from 'components/PageSection'
// import { useWeb3React } from '@web3-react/core'
// import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
// import { PageMeta } from 'components/Layout/Page'
// import Footer from './components/Footer'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopRight } from './components/WedgeSvgs'
import BannerSection from './sections/BannerSection'
import PortfolioSection from './sections/PortfolioSection'
import ChartSection from './sections/ChartSection'


const Home: React.FC = () => {

  const dispatch = useDispatch();
  const { network } = useSelector((state: State) => state.home);

  useEffect(() => {
    dispatch(setNetworkInfo({ searchKey: "", network }))
    // dispatch(setTimer(
    //   setTimeout(() => {
    //       dispatch(setNetworkInfo({ searchKey: "", network }))
    //   }, 1000) 
    // ))
  }, [])

  return (
    <>
      <PageSection
        index={2}
        innerProps={{ style: { margin: '0', width: '100%', maxWidth: '2000px', padding: 0 } }}
        style={{ marginTop: '-90px' }}
        hasCurvedDivider={false}
      >
        <BannerSection />
      </PageSection>
      <PageSection
        index={2}
        innerProps={{ style: { margin: '0', width: '100%', padding: 0, maxWidth: 'none' } }}
        // background="url('/images/goosebumps/2portfolio-bg.jpg') center center no-repeat"
        hasCurvedDivider={false}
      >
        <PortfolioSection />
      </PageSection>
      <PageSection
        index={2}
        innerProps={{ style: { margin: '0', width: '100%', padding: 0, maxWidth: 'none' } }}
        // background="url('/images/goosebumps/3wrap-bg.jpg') center center no-repeat"
        // style={{marginTop: "-48px", padding: "100px 0"}}
        hasCurvedDivider={false}
      >
        <ChartSection />
      </PageSection>
    </>
  )
}

export default Home
