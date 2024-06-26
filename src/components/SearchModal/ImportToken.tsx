import React, { useState } from 'react'
import { Token, Currency } from '@goosebumps/zx-sdk'
import { Button, Text, ErrorIcon, Flex, Message, Checkbox, Link, Tag, Grid } from '@goosebumps/uikit'
import { AutoColumn } from 'components/Layout/Column'
import { useAddUserToken } from 'state/user/hooks'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { ListLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import { useSelector } from 'react-redux'
import { State } from 'state/types'
import linq from 'linq'
import networks from 'config/constants/networks'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveWeb3React()

  const { t } = useTranslation()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  const { network } = useSelector((state:State) => state.home)
  const detailedNetwork = linq.from(networks).where((x) => x.Name === network.value).single()
  const tokenNames = {
    "ETH" : "ERC20",
    "BNB" : "BEP20",
    "MATIC": "ERC20"
  }

  return (
    <AutoColumn gap="lg">
      <Message variant="warning">
        <Text>
          {t(
            `Anyone can create a ${tokenNames[detailedNetwork.Currency.Name]} token on ${detailedNetwork.Display} with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.`,
          )}
          <br />
          <br />
          {t('If you purchase an arbitrary token, you may be unable to sell it back.')}
        </Text>
      </Message>

      {tokens.map((token) => {
        const list = chainId && inactiveTokenList?.[chainId]?.[token.address]?.list
        const address = token.address ? `${truncateHash(token.address)}` : null
        return (
          <Grid key={token.address} gridTemplateRows="1fr 1fr 1fr" gridGap="4px">
            {list !== undefined ? (
              <Tag
                variant="success"
                outline
                scale="sm"
                startIcon={list.logoURI && <ListLogo logoURI={list.logoURI} size="12px" />}
              >
                {t('via')} {list.name}
              </Tag>
            ) : (
              <Tag variant="failure" outline scale="sm" startIcon={<ErrorIcon color="failure" />}>
                {t('Unknown Source')}
              </Tag>
            )}
            <Flex alignItems="center">
              <Text mr="8px">{token.name}</Text>
              <Text>({token.symbol})</Text>
            </Flex>
            {chainId && (
              <Flex justifyContent="space-between" width="100%">
                <Text mr="4px">{address}</Text>
                <Link href={getBscScanLink(token.address, 'address', chainId)} external>
                  ({t('View on Scan')})
                </Link>
              </Flex>
            )}
          </Grid>
        )
      })}

      <Flex justifyContent="space-between" alignItems="center" mb="20px">
        <Flex alignItems="center" onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            scale="sm"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Text ml="8px" style={{ userSelect: 'none' }}>
            {t('I understand')}
          </Text>
        </Flex>
        <Button
          variant="danger"
          disabled={!confirmed}
          onClick={() => {
            tokens.map((token) => addToken(token))
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0])
            }
          }}
          className=".token-dismiss-button"
        >
          {t('Import')}
        </Button>
      </Flex>
    </AutoColumn>
  )
}

export default ImportToken
