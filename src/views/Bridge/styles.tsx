import { Box, Flex } from '@goosebumps/uikit'
import styled from 'styled-components'

export const StyledBridgeContainer = styled(Flex) `
    flex-shrink: 0;
    height: fit-content;
    padding: 0 24px;

    ${({ theme }) => theme.mediaQueries.lg} {
        padding: 0 40px;
    }
`

export const StyledBridgeContentWrapper = styled(Box)`
    padding: 50px;
`