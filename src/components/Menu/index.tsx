import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { useHistory } from 'react-router-dom'
import { InputGroup, Menu as UikitMenu } from '@goosebumps/uikit'
import linq from 'linq'
import { ethers } from 'ethers'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import CustomSelect, { OptionProps } from 'components/CustomSelect/CustomSelect'
import useTheme from 'hooks/useTheme'
import { usePriceEmpireBusd } from 'state/farms/hooks'
import { setAddressType, setNetworkInfo } from 'state/home'
import { State } from 'state/types'
import { usePhishingBannerManager } from 'state/user/hooks'
import { API_SERVER } from 'config'
import { ChainIdStorageName } from 'config/constants'
import networks from 'config/constants/networks.json';
import { getAsyncData } from 'utils/requester'
import changeNetwork from 'utils/changeNetwork'

import config from './config/config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'

const SearchItem = ({onChangeNetwork, selIndex}) => {
  const { t } = useTranslation();
  return <>
    <CustomSelect
      options={[
        // {
        //   label: t("Ethereum"),
        //   value: "ethereum"
        // },
        {
          label: t("BSC"),
          value: "bsc"
        },
        // {
        //   label: t("Polygon"),
        //   value: "matic"
        // },
        {
          label: t("BSC Testnet"),
          value: "bsc_testnet"
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
      defaultOptionIndex={0}
      onOptionChange={onChangeNetwork}
      selIndex={selIndex}
    />
  </>
}

const Menu = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceEmpireBusd()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useLocation()
  const [showPhishingWarningBanner] = usePhishingBannerManager()

  const { network, searchKey } = useSelector((state:State) => state.home)
  const [networkIndex, setNetworkIndex] = useState(0)
  const [loadingStatus, setLoadingStatus] = useState(-1)

  const activeMenuItem = getActiveMenuItem({ menuConfig: config(t), pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const [timer, setTimer] = useState<any>();


  const onSearchKeyChange = (newKey) => {
    
    dispatch(setNetworkInfo({ searchKey: newKey, network }));
    if (ethers.utils.isAddress(newKey) || !newKey) {
      handleSearch(newKey)
    }
  }

  const handleSearch = async (address: string) => {
    // console.log('handleSearch address = ', address)

    if (timer) {
      // console.log("handleSearch clear time:", timer);
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(async () => {
        if (network === null || address === '' || !ethers.utils.isAddress(address)) {
          dispatch(setAddressType({addressType: null}));
          return;
        }
        const res = await getAsyncData(`${API_SERVER}api/Search/IsToken`, { address, network: network.value })
        // console.log('After getAsyncData isToken = ', res)
        /*
          smartcontract: "Token"  - Token address
          smartcontract: "DEX"  - Pair address
        */
          // console.log("isToken res = ", res);
          if(res.status !== 200) {
          console.log("res = ", res)
          // alert(res.error);
          return;
        }
        
        dispatch(setAddressType({addressType: res.result ? res.result.contractType : null}));
        if (res.result) {
          history.push(`/charts/${network?.value}/${address}`)
        } else if (address) {
          history.push(`/portfolio-tracker/${network?.value}/${address}`)
        } else {
          history.push(`/portfolio-tracker`)
        }
      }, 1000)
    );
  }

  const onChangeNetwork = async (newNetwork) => {
    const detailedNetwork = linq.from(networks).where((x) => x.Name === newNetwork.value).single()
    const info = {...newNetwork, chainId: detailedNetwork.chainId};
    console.log("onChangeNetwork info = ", info)
    await changeNetwork(detailedNetwork)
    // // if(loadingStatus === 1) {
    //   console.log("onChangeNetwork searchKey=", searchKey)
    //   dispatch(setNetworkInfo({network: {...newNetwork, chainId: detailedNetwork.chainId}}))
    //   handleSearch(searchKey)
    // // }
    // setLoadingStatus(-1)
  }

  useEffect(() => {
    let _index = 0;
    // if(network.chainId === 1) _index = 0
    if(network.chainId === 56) _index = 0
    // if(network.chainId === 137) _index = 2
    if(network.chainId === 97) _index = 1
    setNetworkIndex(_index)
    // if(searchKey) {
      // console.log("searchKey=", searchKey)
      handleSearch(searchKey)
    // }
  }, [network, searchKey])

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      searchItem={<SearchItem onChangeNetwork={onChangeNetwork} selIndex={networkIndex} />}
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
