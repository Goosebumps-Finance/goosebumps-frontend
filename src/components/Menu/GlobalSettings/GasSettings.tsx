import React from 'react'
import { Flex, Button, Text } from '@goosebumps/uikit'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from 'contexts/Localization'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/user/hooks/helpers'
import { useGasPriceManager } from 'state/user/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()
  const { chainId } = useActiveWeb3React();
console.log("gasSettings gasPrice=", gasPrice)
  return (
    <Flex flexDirection="column">
      <Flex mb="12px" alignItems="center">
        <Text>{t('Default Transaction Speed (GWEI)')}</Text>
        <QuestionHelper
          text={t(
            'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees',
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI[chainId].default)
          }}
          style={{ padding: gasPrice === GAS_PRICE_GWEI[chainId].default ? '0px 20px' : '0px 20px' }}
          variant={gasPrice === GAS_PRICE_GWEI[chainId].default ? 'primary' : 'tertiary'}
        >
          {t('Standard (%gasPrice%)', { gasPrice: GAS_PRICE[chainId].default })}
        </Button>
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI[chainId].fast)
          }}
          style={{ padding: gasPrice === GAS_PRICE_GWEI[chainId].fast ? '0px 20px' : '0px 20px' }}
          variant={gasPrice === GAS_PRICE_GWEI[chainId].fast ? 'primary' : 'tertiary'}
        >
          {t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE[chainId].fast })}
        </Button>
        <Button
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI[chainId].instant)
          }}
          style={{ padding: gasPrice === GAS_PRICE_GWEI[chainId].instant ? '0px 20px' : '0px 20px' }}
          variant={gasPrice === GAS_PRICE_GWEI[chainId].instant ? 'primary' : 'tertiary'}
        >
          {t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE[chainId].instant })}
        </Button>
      </Flex>
    </Flex>
  )
}

export default GasSettings
