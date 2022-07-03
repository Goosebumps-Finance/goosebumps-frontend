import { MenuItemsType, DropdownMenuItemType, menuStatus } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t("Home"),
    href: "/",
    showItemsOnMobile: false,
    items: [],
  },
  {
    label: t("Portfolio Tracker"),
    href: "/portfolio",
    items: [],
  },
  {
    label: t("Charts"),
    href: "/charts",
    items: [],
  },
  {
    label: t("Stake"),
    href: "/stake",
    items: [],
  },
  {
    label: t('DEX'),
    icon: 'Swap',
    href: '/swap',
    items: [],
  },
  {
    label: t('Bridge'),
    href: '/Bridge',
    icon: 'Bridge',
    items: [ ],
  }
]

export default config
