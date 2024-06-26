import React from 'react'
import styled from 'styled-components'
import useLastTruthy from 'hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwap0xDetails, AdvancedSwapDetailsProps, AdvancedSwap0xDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  margin-top: ${({ show }) => (show ? '16px' : 0)};
  padding-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  // max-width: 400px;
  border-radius: 20px;
  // background-color: ${({ theme }) => theme.colors.invertedContrast};
  background-color: #121e30;

  transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
  transition: transform 300ms ease-in-out;
`

export function AdvancedSwap0xDetailsDropdown({ response }: AdvancedSwap0xDetailsProps) {
  return (
    <AdvancedDetailsFooter show={response !== null}>
      <AdvancedSwap0xDetails response={response} />
    </AdvancedDetailsFooter>
  )
}

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
