import React, { useEffect, useState } from 'react'
import { Flex } from '@goosebumps/uikit'
import styled from 'styled-components'
import CustomSelect from 'components/CustomSelect/CustomSelect'
import { useTranslation } from 'contexts/Localization'
import { BRIDGE, titles, variants } from '../types'

const CardWrapper = styled(Flex)`
  flex-direction: column;
  background: #18283a;
  border-radius: 20px;
  width: 220px;
  height: 200px;
  padding: 15px;
`

const CardTitle = styled.span`
  margin: 0 auto;
  color: #939393;
`

const CardImage = styled.div`
  margin: auto;
`

const BridgeCard = ({ variant = variants.CONNECT_FROM, onChangeNetwork, selIndex,  ...props }) => {
  const { t } = useTranslation()
  // const [type, setType] = useState(BRIDGE.ETHEREUM)

  const renderImage = (index) => {
    if (index === 0) return <img src="images/bridge/ETH.png" alt="eth" />
    if (index === 1 || index === 3) return <img src="images/bridge/BSC.png" alt="bsc" />
    if (index === 2) return <img src="images/bridge/ETH.png" alt="matic" />
    return <></>
  }

  return (
    <CardWrapper {...props}>
      <CardTitle>{titles[variant]}</CardTitle>
      <CardImage>{renderImage(selIndex)}</CardImage>
      <CustomSelect
        options={[
          // {
          //   label: t('Ethereum'),
          //   value: 'ethereum',
          // },
          {
            label: t('BSC'),
            value: 'bsc',
          },
          // {
          //   label: t('Polygon'),
          //   value: 'matic',
          // },
          {
            label: t('BSC Testnet'),
            value: 'bsc_testnet',
          },
        ]}
        header={{
          boxShadow: 'none',
          background: '#18283A',
        }}
        listContainer={{
          border: 'none',
          backgroundColor: '#18283A',
        }}
        defaultOptionIndex={0}
        onOptionChange={onChangeNetwork}
        selIndex={selIndex}
      />
    </CardWrapper>
  )
}

export default BridgeCard
