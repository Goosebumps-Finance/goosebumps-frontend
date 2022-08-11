import { Box, Button, Flex, InjectedModalProps, LinkExternal, Message, Skeleton, Text } from '@goosebumps/uikit'
import { useWeb3React } from '@web3-react/core'
import { tokens } from 'config/constants/tokens'
import { FetchStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import useAuth from 'hooks/useAuth'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React from 'react'
import { useSelector } from 'react-redux'
import linq from 'linq'
import { State } from 'state/types'
import { getBscScanLink } from 'utils'
import networks from 'config/constants/networks.json'
import { formatBigNumber, getFullDisplayBalance } from 'utils/formatBalance'
import CopyAddress from './CopyAddress'

interface WalletInfoProps {
  hasLowBnbBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { chainId } = useActiveWeb3React()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { balance: empireBalance, fetchStatus: cakeFetchStatus } = useTokenBalance(tokens().empire.address)
  const { logout } = useAuth()
  const { network } = useSelector((state:State) => state.home)
  const detailedNetwork = linq.from(networks).where((x) => x.Name === network.value).single()
  const currencyName = detailedNetwork.Currency.Name

  const handleLogout = () => {
    onDismiss()
    logout()
  }

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <CopyAddress account={account} mb="24px" />
      {hasLowBnbBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">{t(`${currencyName} Balance Low`)}</Text>
            <Text as="p">{t(`You need ${currencyName} for transaction fees.`)}</Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t(`${currencyName} Balance`)}</Text>
        {fetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatBigNumber(balance, 6)}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="textSubtle">{t('EMPIRE Balance')}</Text>
        {cakeFetchStatus !== FetchStatus.Fetched ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{getFullDisplayBalance(empireBalance, 9, 3)}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="end" mb="24px">
        <LinkExternal href={getBscScanLink(account, 'address', chainId)}>{t('View on Scan')}</LinkExternal>
      </Flex>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
