import React, { useMemo } from 'react'
import styled from 'styled-components'
import { isAddress } from 'utils'
import { getChainId } from 'utils/getChainId'
import LogoLoader from './LogoLoader'

const StyledLogo = styled(LogoLoader)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`

export const CurrencyLogo: React.FC<{
  address?: string
  size?: string
}> = ({ address, size = '24px', ...rest }) => {
  const src = useMemo(() => {
    const checksummedAddress = isAddress(address)
    const defaultTokenAddrs = ['0x293C3Ee9ABaCb08BB8ceD107987F00EfD1539288', '0xE7C6D00B5314EE2651Df6E18e84d6d6dF0EA96a6']
    if(typeof checksummedAddress === 'string' && defaultTokenAddrs.includes(checksummedAddress)) {
      // return `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${defaultTokenAddrs[0]}/logo.png`
      return `https://goosebumps.finance/images/tokens/${getChainId()}/${defaultTokenAddrs[0]}.png`
      // return `https://cryptosnowprince.com/images/tokens/${getChainId()}/${defaultTokenAddrs[0]}.png`
    }
    if (checksummedAddress) {
      // return `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${checksummedAddress}/logo.png`
      return `https://goosebumps.finance/images/tokens/${getChainId()}/${checksummedAddress}.png`
      // return `https://cryptosnowprince.com/images/tokens/${getChainId()}/${checksummedAddress}.png`
    }
    return null
  }, [address])

  return <StyledLogo size={size} src={src} alt="token logo" {...rest} />
}

const DoubleCurrencyWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 32px;
`

interface DoubleCurrencyLogoProps {
  address0?: string
  address1?: string
  size?: number
}

export const DoubleCurrencyLogo: React.FC<DoubleCurrencyLogoProps> = ({ address0, address1, size = 16 }) => {
  return (
    <DoubleCurrencyWrapper>
      {address0 && <CurrencyLogo address={address0} size={`${size.toString()}px`} />}
      {address1 && <CurrencyLogo address={address1} size={`${size.toString()}px`} />}
    </DoubleCurrencyWrapper>
  )
}
