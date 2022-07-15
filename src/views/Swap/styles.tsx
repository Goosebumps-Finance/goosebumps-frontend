import { Box, Flex } from '@goosebumps/uikit'
import styled from 'styled-components'

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: fit-content;
  padding: 0 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 40px;
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    ${({ $isChartExpanded }) => ($isChartExpanded ? 'padding: 0 120px' : 'padding: 0 40px')};
  }
`

export const StyledInputCurrencyWrapper = styled(Box)`
  max-width: 600px;
  width: 328px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 450px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 600px;
  }
`
