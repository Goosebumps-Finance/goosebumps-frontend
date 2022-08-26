import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Pair } from '@goosebumps/sdk'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from '@goosebumps/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'state/types'
import { setNetworkInfo } from 'state/home'
import isSupportedChainId from 'utils/isSupportedChainId'
import { BASE_FACTORY_ADDRESS } from 'config/constants'

import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'

const Body = styled(CardBody)`
  // background-color: ${({ theme }) => theme.colors.dropdownDeep};
  background-color: #121e30;
  border: none;
`

export default function Pool() {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const dispatch = useDispatch();
  const { network } = useSelector((state: State) => state.home);

  useEffect(() => {
    dispatch(setNetworkInfo({ searchKey: "", network }))
  }, [])

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => isSupportedChainId(chainId) ? trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens, chainId), tokens })) : undefined,
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  // filter if pair is set and if the liquidity is provided on goosebumps dex
  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter(
    (v2Pair): v2Pair is Pair => Boolean(v2Pair && isSupportedChainId(chainId) && v2Pair.factory === BASE_FACTORY_ADDRESS[chainId])
  )

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t('Connect to a wallet to view your liquidity.')}
        </Text>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody>
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <Body>
          {renderBody()}
          {account && !v2IsLoading && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Button
                id="import-pool-link"
                variant="secondary"
                scale="md"
                as={Link}
                to="/liquidityFindToken"
                style={{ borderColor: '#ffffff' }}
              >
                {t('Find other LP tokens')}
              </Button>
            </Flex>
          )}
        </Body>
        <CardFooter style={{ textAlign: 'center' }}>
          <Button
            id="join-pool-button"
            as={Link}
            to="/liquidityAdd"
            width="200px"
            startIcon={<AddIcon color="white" />}
            style={{ borderColor: '#ffffff', borderRadius: '10px' }}
          >
            {t('Add Liquidity')}
          </Button>
        </CardFooter>
      </AppBody>
    </Page>
  )
}
