import React from 'react'
import styled from 'styled-components'
import { Card } from '@goosebumps/uikit'
import { StyledInputCurrencyWrapper } from 'views/Swap/styles';

export const BodyWrapper = styled(Card)`
  border-radius: 24px;
  // max-width: 436px;
  background: #121e30;
  width: 100%;
  z-index: 1;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <StyledInputCurrencyWrapper>
      <BodyWrapper background="#121e30">{children}</BodyWrapper>
    </StyledInputCurrencyWrapper>
}
