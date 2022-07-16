import React, { useState } from 'react'
import { Flex } from '@goosebumps/uikit'
import styled from 'styled-components'
import Select from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import { BRIDGE, titles, variants } from '../types'

const CardWrapper = styled(Flex) `
    flex-direction: column;
    background: #18283A;
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

const BridgeCard = ({variant = variants.CONNECT_FROM,  ...props}) => {
    const { t } = useTranslation()
    const [type, setType] = useState(BRIDGE.ETHEREUM)

    const renderImage = (_type) => {
        if(_type === BRIDGE.ETHEREUM)
            return <img src="images/bridge/ETH.png" alt="eth" />
        if(_type === BRIDGE.BSC)
            return <img src="images/bridge/BSC.png" alt="bsc" />
        if(_type === BRIDGE.POLYGON)
            return <img src="images/bridge/BSC.png" alt="matic" />
        return <></>
    }

    return (<CardWrapper {...props} >
            <CardTitle>{titles[variant]}</CardTitle>
            <CardImage>{renderImage(type)}</CardImage>
            <Select
                options={[
                    {
                        label: t("Ethereum"),
                        value: "ethereum"
                    },
                    {
                        label: t("BSC"),
                        value: "bsc"
                    },
                    {
                        label: t("Polygon"),
                        value: "polygon"
                    }
                ]}
                header = {{
                    boxShadow: "none",
                    background: "#18283A"
                }}
                listContainer={{
                    border: "none",
                    backgroundColor: "#18283A"
                }}
                defaultOptionIndex={0}
            />
        </CardWrapper>
    )
}

export default BridgeCard