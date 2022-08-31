import React from 'react'
import styled from 'styled-components'
import { Flex, Text, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip } from '@goosebumps/uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { DeserializedPool } from 'state/types'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { vaultPoolConfig } from 'config/constants/pools'

// const ApyLabelContainer = styled(Flex)`
//   cursor: pointer;

//   &:hover {
//     opacity: 0.5;
//   }
// `

const ApyLabelContainer = styled(Flex)``

interface AprRowProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
  performanceFee?: number
}

const AprRow: React.FC<AprRowProps> = ({ pool, stakedBalance, performanceFee = 0 }) => {
  const { t } = useTranslation()
  const {
    stakingToken,
    earningToken,
    isFinished,
    apr,
    rawApr,
    earningTokenPrice,
    stakingTokenPrice,
    userData,
    vaultKey,
  } = pool

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const tooltipContent = vaultKey
    ? t('APY includes compounding, APR doesn’t. This pool’s CAKE is compounded automatically, so we show APY.')
    : t('This pool’s rewards aren’t compounded automatically, so we show APR')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })

  const apyModalLink = stakingToken.address ? `/swap?outputCurrency=${stakingToken.address}` : '/swap'

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      earningTokenPrice={earningTokenPrice}
      stakingTokenPrice={stakingTokenPrice}
      apr={vaultKey ? rawApr : apr}
      linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
      linkHref={apyModalLink}
      stakingTokenBalance={stakedBalance.plus(stakingTokenBalance)}
      stakingTokenSymbol={stakingToken.symbol}
      earningTokenSymbol={earningToken.symbol}
      autoCompoundFrequency={vaultPoolConfig[vaultKey]?.autoCompoundFrequency ?? 0}
      performanceFee={performanceFee}
    />,
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {/* {tooltipVisible && tooltip} */}
      {/* <TooltipText ref={targetRef}>{vaultKey ? `${t('APY')}:` : `${t('APR')}:`}</TooltipText> */}
      <Text>{t('APR')}</Text>
      {/* {apr || isFinished || true ? (
        <ApyLabelContainer alignItems="center" onClick={onPresentApyModal}>
        <ApyLabelContainer alignItems="center">
          <Balance
            fontSize="16px"
            isDisabled={isFinished}
            isDisabled={false}
            value={apr}
            value={isFinished ? 0 : apr}
            decimals={2}
            unit="%"
            onClick={onPresentApyModal}
          />
          {!isFinished && (
            <IconButton variant="text" scale="sm">
              <CalculateIcon color="textSubtle" width="18px" />
            </IconButton>
          )}
        </ApyLabelContainer>
      ) : (
        <Skeleton width="82px" height="32px" />
      )} */}
      <ApyLabelContainer alignItems="center">
        <Balance
          fontSize="16px"
          isDisabled={false}
          value={apr}
          decimals={2}
          unit="%"
        />
      </ApyLabelContainer>
    </Flex>
  )
}

export default AprRow
