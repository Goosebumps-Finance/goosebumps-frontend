import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'Goosebumps',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by PancakeSwap), NFTs, and more, on a platform you can trust.',
  image: 'https://goosebumps.finance/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/liquidityRemove')) {
    basePath = '/liquidityRemove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/swap':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/liquidityAdd':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/liquidityRemove':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/liquidityFindToken':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/competition':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/prediction':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/farms':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/pools':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/lottery':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/ifo':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/teams':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/voting':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/info':
      return {
        title: `${t('Goosebumps Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Goosebumps Info & Analytics')}`,
        description: 'View statistics for Goosebumps exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Goosebumps Info & Analytics')}`,
        description: 'View statistics for Goosebumps exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Goosebumps')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Goosebumps')}`,
      }
    default:
      return null
  }
}
