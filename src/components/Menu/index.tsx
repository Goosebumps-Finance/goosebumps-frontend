import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'
import { useHistory } from 'react-router-dom'
import { InputGroup, Menu as UikitMenu } from '@goosebumps/uikit'
import linq from 'linq'
import { ethers } from 'ethers'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import Select, { OptionProps } from 'components/Select/Select'
import useTheme from 'hooks/useTheme'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { setNetworkInfo } from 'state/home'
import { usePhishingBannerManager } from 'state/user/hooks'
import { API_SERVER } from 'config'
import networks from 'config/constants/networks.json';
import { getAsyncData } from 'utils/requester'
import { changeNetwork } from 'utils/changeNetwork'

import config from './config/config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'

const SearchItem = ({network, setNetwork}) => {
  const { t } = useTranslation();
  // useEffect(() => {
  //   setNetwork({
  //     label: t("Ethereum"),
  //     value: "ethereum"
  //   })
  // }, [t, setNetwork])
  return <>
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
        },
        {
          label: t("BSC Testnet"),
          value: "bsctestnet"
        }
      ]}
      header={{
        border: "1px solid #52555c",
        background: "transparent"
      }}
      listContainer={{
        border: "1px solid #52555c",
        borderTop: "none"
      }}
      defaultOptionIndex={3}
      onOptionChange={setNetwork}
    />
  </>
}

const Menu = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useLocation()
  const [showPhishingWarningBanner] = usePhishingBannerManager()

  const [network, setNetwork] = useState<OptionProps | null>(null)
  const [searchKey, setSearchKey] = useState('')

  const activeMenuItem = getActiveMenuItem({ menuConfig: config(t), pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const onSearchKeyChange = (e) => {
    setSearchKey(e.target.value)
    dispatch(setNetworkInfo({ network, searchKey }))
    if (ethers.utils.isAddress(e.target.value) || !e.target.value) {
      handleSearch(e.target.value)
    }
  }

  const handleSearch = async (address: string) => {
    console.log('handleSearch')
    if (network === null || address === '') return
    const isToken = await getAsyncData(`${API_SERVER}api/Search/IsToken`, { address, network: network.value })
    console.log('After getAsyncData isToken = ', isToken)
    if (isToken) {
      history.push(`/charts/${network?.value}/${address}`)
    } else if (address) {
      history.push(`/portfolio-tracker/${network?.value}/${address}`)
    } else {
      history.push(`/portfolio-tracker`)
    }
  }

  useEffect(() => {
    console.log("before dispatch Networkinfo network = ", network)
    dispatch(setNetworkInfo({network, searchKey}))
  }, [ network, searchKey, dispatch ])

  const onChangeNetwork = (info) => {
    console.log("onChangeNetwork info = ", info)
    const selNetwork = linq.from(networks).where((x) => x.Name === (info.value ? info.value : "bsctestnet")).single()
    // console.log("selNetwork = ", selNetwork)
    setNetwork(info)
    changeNetwork(selNetwork)
  }

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      searchItem={<SearchItem setNetwork={onChangeNetwork} network={network}/>}
      searchKey={searchKey}
      setSearchKey={onSearchKeyChange}
      // banner={showPhishingWarningBanner && <PhishingWarningBanner />}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config(t)}
      subLinks={activeMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
      footerLinks={footerLinks(t)}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      buyCakeLabel={t('Buy CAKE')}
      {...props}
    />
  )
}

export default Menu
