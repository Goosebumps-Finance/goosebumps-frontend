import { MenuItemsType, DropdownMenuItemType, menuStatus } from '@goosebumps/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  {
    label: t("Home"),
    href: "/",
    items: []
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
    href: "/swap",
    items: [
      {
        label: t("Exchange"),
        href: "/swap",
      }, {
        label: t("Liquidity"),
        href: "/liquidity"
      }
    ],
  },
  {
    label: t('Bridge'),
    href: '/bridge',
    items: [ ],
  }
]

export default config
