import React from 'react'
import { useLocation } from 'react-router'
import { InputGroup, Menu as UikitMenu, menuConfig } from '@pancakeswap/uikit'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import PhishingWarningBanner from 'components/PhishingWarningBanner'
import Select from 'components/Select/Select'
import useTheme from 'hooks/useTheme'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { usePhishingBannerManager } from 'state/user/hooks'
import config from './config/config'
import UserMenu from './UserMenu'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'

const SearchItem = () => {
  const { t } = useTranslation();
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
        }
      ]}
    />
  </>
}

const Menu = (props) => {
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useLocation()
  const [showPhishingWarningBanner] = usePhishingBannerManager()

  console.log("pooh, menuConfig = ", menuConfig)

  const activeMenuItem = getActiveMenuItem({ menuConfig: config(t), pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  console.log("pooh, here config = ", config(t));
  console.log("pooh, pathName = ", pathname);
  console.log("pooh, here", activeMenuItem);

  return (
    <UikitMenu
      userMenu={<UserMenu />}
      globalMenu={<GlobalSettings />}
      searchItem={<SearchItem />}
      banner={showPhishingWarningBanner && <PhishingWarningBanner />}
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
