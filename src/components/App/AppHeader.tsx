import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon, NotificationDot } from '@goosebumps/uikit'
import { Link } from 'react-router-dom'
import { useExpertModeManager } from 'state/user/hooks'
import GlobalSettings from 'components/Menu/GlobalSettings'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  background-color: hsla(0,0%,100%,.1);
  // border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  const [expertMode] = useExpertModeManager()

  return (
    <AppHeaderContainer>
        <Flex>
          {backTo && (
            <IconButton as={Link} to={backTo}>
              <ArrowBackIcon width="32px" />
            </IconButton>
          )}
          {/* <Flex alignItems="center"> */}
            <Heading as="h2" mb="8px" style={{margin: 'auto'}}>
              {title}
            </Heading>
          {/* </Flex> */}
        </Flex>
        <Text color="textSubtle" fontSize="14px">
          {subtitle}
        </Text>
      {/* {!noConfig && (
        <Flex alignItems="center">
          <NotificationDot show={expertMode}>
            <GlobalSettings />
          </NotificationDot>
          <Transactions />
        </Flex>
      )} */}
    </AppHeaderContainer>
  )
}

export default AppHeader
