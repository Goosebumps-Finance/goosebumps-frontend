import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@goosebumps/uikit'
import Footer from 'components/Menu/Footer'
import { PageMeta } from 'components/Layout/Page'

const StyledPage = styled.div<{ $removePadding: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: ${({ $removePadding }) => ($removePadding ? '0' : '16px')};
  padding-bottom: 24px;
  // min-height: calc(100vh - 64px);
  min-height: 50vh;
  // background: ${({ theme }) => theme.colors.gradients.bubblegum};
  // background: linear-gradient(rgb(14 18 26) 20%, #02141a 100%);

  ${({ theme }) => theme.mediaQueries.xs} {
    background-size: auto;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '24px')};
    // padding-bottom: 10px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: ${({ $removePadding }) => ($removePadding ? '0' : '32px')};
    // padding-bottom: 10px;
    // min-height: calc(100vh - 100px);
    min-height: 50vh;
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

const Page: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { removePadding?: boolean; hideFooterOnDesktop?: boolean }
> = ({ children, removePadding = false, hideFooterOnDesktop = false, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage $removePadding={removePadding} {...props}>
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
        <Flex flexGrow={1} />
        <Box display={['block', null, null, hideFooterOnDesktop ? 'none' : 'block']} width="100%">
          <Footer />
        </Box>
      </StyledPage>
    </>
  )
}

export default Page
