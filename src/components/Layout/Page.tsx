import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
// import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import Container from './Container'

const StyledPage = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

const BlurCircle = styled.div`
  width: 100px;
  height: 150px;
  border-radius: 50px;
  // background-color: #142b44;
  position: absolute;
  // left: 10%;
  // top: 20%;
  filter: blur(36px);
  z-index: -1;
  ${({theme}) => theme.mediaQueries.sm} {
    width: 200px;
    height: 300px;
    border-radius: 100px;    
  }
`

export const PageMeta: React.FC<{ symbol?: string }> = ({ symbol }) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  // const cakePriceUsd = useCakeBusdPrice()
  // const cakePriceUsdDisplay = cakePriceUsd ? `$${cakePriceUsd.toFixed(3)}` : '...'

  const pageMeta = getCustomMeta(pathname, t) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
  // let pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title
  // if (symbol) {
  //   pageTitle = [symbol, title].join(' - ')
  // }

  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  )
}

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  symbol?: string
}

const Page: React.FC<PageProps> = ({ children, symbol, ...props }) => {
  return (
    <>
      <PageMeta symbol={symbol} />
      <StyledPage {...props}>
        <BlurCircle style={{
          backgroundColor: "#142b44",
          left: "10%",
          top: "20%"
        }} />
        <BlurCircle style={{
          backgroundColor: "#143744",
          right: "10%",
          top: "10%",
        }} />
        {children}
      </StyledPage>
    </>
  )
}

export default Page
