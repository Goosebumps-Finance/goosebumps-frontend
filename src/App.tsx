import React, { lazy /* , useEffect */ } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@goosebumps/uikit'
// import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import useUserAgent from 'hooks/useUserAgent'
import useScrollOnRouteChange from 'hooks/useScrollOnRouteChange'
import { usePollBlockNumber } from 'state/block/hooks'
import { usePollCoreFarmData } from 'state/farms/hooks'
import { useFetchProfile } from 'state/profile/hooks'
import SubgraphHealthIndicator from 'components/SubgraphHealthIndicator'
import ComingSoon from 'components/Modal/ComingSoon'
// import { getChainId } from 'utils/getChainId'

import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import PageLoader from './components/Loader/PageLoader'
import EasterEgg from './components/EasterEgg'
import GlobalCheckClaimStatus from './components/GlobalCheckClaimStatus'
import history from './routerHistory'
// Views included in the main bundle
import Pools from './views/Pools'
// import Swap from './views/Swap'
import ZxSwap from './views/ZxSwap'
// import {
//   RedirectDuplicateTokenIds,
//   RedirectOldAddLiquidityPathStructure,
//   RedirectToAddLiquidity,
// } from './views/AddLiquidity/redirects'
import {
  ZxRedirectDuplicateTokenIds,
  ZxRedirectOldAddLiquidityPathStructure,
  ZxRedirectToAddLiquidity,
} from './views/ZxAddLiquidity/redirects'
// import RedirectOldRemoveLiquidityPathStructure from './views/RemoveLiquidity/redirects'
import ZxRedirectOldRemoveLiquidityPathStructure from './views/ZxRemoveLiquidity/redirects'
// import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'
import { ZxRedirectPathToSwapOnly, ZxRedirectToSwap } from './views/ZxSwap/redirects'
import { useInactiveListener } from './hooks/useInactiveListener'
import useSentryUser from './hooks/useSentryUser'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import('./views/Home'))
const NotFound = lazy(() => import('./views/NotFound'))
// const AddLiquidity = lazy(() => import('./views/AddLiquidity'))
const ZxAddLiquidity = lazy(() => import('./views/ZxAddLiquidity'))
// const RemoveLiquidity = lazy(() => import('./views/RemoveLiquidity'))
const ZxRemoveLiquidity = lazy(() => import('./views/ZxRemoveLiquidity'))
// const Bridge = lazy(() => import('./views/Bridge'))
const PortfolioTracker = lazy(() => import('./views/PortfolioTracker'))
// const Charts = lazy(() => import('./views/Charts'))
const SimpleCharts = lazy(() => import('./views/SimpleCharts'))
// const Liquidity = lazy(() => import('./views/Pool'))
const ZxLiquidity = lazy(() => import('./views/ZxPool'))
// const PoolFinder = lazy(() => import('./views/PoolFinder'))
const ZxPoolFinder = lazy(() => import('./views/ZxPoolFinder'))

const Farms = lazy(() => import('./views/Farms'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  // const { account } = useWeb3React()

  usePollBlockNumber()
  useEagerConnect()
  useFetchProfile()
  usePollCoreFarmData()
  useScrollOnRouteChange()
  useUserAgent()
  useInactiveListener()
  useSentryUser()

  // useEffect(() => {
  // window.localStorage.removeItem("SELECTED_CHAIN_ID")
  // window.localStorage.setItem("SELECTED_CHAIN_ID", `${getChainId()}`) // TODO prince
  // }, [])

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <GlobalCheckClaimStatus excludeLocations={[]} />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/farms">
              <Farms />
              {/* <ComingSoon /> */}
            </Route>
            <Route path="/stake">
              <Pools />
              {/* <ComingSoon /> */}
            </Route>
            <Route path="/bridge">
              {/* <Bridge /> */}
              <ComingSoon />
            </Route>
            <Route exact path="/portfolio-tracker" render={() => <PortfolioTracker />} />
            {/* <Route path="/portfolio-tracker/:networkName/:addresses"> */}
            <Route exact path="/portfolio-tracker/:networkName/:address" render={() => <PortfolioTracker />} />
            {/* <PortfolioTracker />
            </Route> */}
            {/* <Route exact path="/charts" render={() => <Charts />} />
            <Route exact path="/charts/:networkName/:address" render={() => <Charts />} />
            <Route exact path="/charts/:networkName/:address/:pairAddress" render={() => <Charts />} /> */}

            <Route exact path="/charts" render={() => <SimpleCharts />} />
            <Route exact path="/charts/:networkName/:address" render={() => <SimpleCharts />} />
            {/* <Route exact path="/charts/:networkName/:address/:pairAddress" render={() => <SimpleCharts />} /> */}

            {/* DEX(v1 dex) */}
            {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
            <Route exact strict path="/swap" component={ZxSwap} />
            <Route exact strict path="/swap/:outputCurrency" component={ZxRedirectToSwap} />
            <Route exact strict path="/liquidityFindToken" component={ZxPoolFinder} />
            <Route exact strict path="/liquidity" component={ZxLiquidity} />
            <Route exact path="/liquidityAdd" component={ZxAddLiquidity} />
            <Route exact path="/liquidityAdd/:currencyIdA" component={ZxRedirectOldAddLiquidityPathStructure} />
            <Route exact path="/liquidityAdd/:currencyIdA/:currencyIdB" component={ZxRedirectDuplicateTokenIds} />

            <Route exact strict path="/create" component={ZxRedirectToAddLiquidity} />
            <Route exact strict path="/send" component={ZxRedirectPathToSwapOnly} />
            <Route exact path="/create" component={ZxAddLiquidity} />
            <Route exact path="/create/:currencyIdA" component={ZxRedirectOldAddLiquidityPathStructure} />
            <Route exact path="/create/:currencyIdA/:currencyIdB" component={ZxRedirectDuplicateTokenIds} />
            <Route exact strict path="/liquidityRemove/:tokens" component={ZxRedirectOldRemoveLiquidityPathStructure} />
            <Route exact strict path="/liquidityRemove/:currencyIdA/:currencyIdB" component={ZxRemoveLiquidity} />

            {/* DEX(v2 dex) */}
            {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
            {/* <Route exact strict path="/swap" component={Swap} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/liquidityFindToken" component={PoolFinder} />
            <Route exact strict path="/liquidity" component={Liquidity} />
            <Route exact path="/liquidityAdd" component={AddLiquidity} />
            <Route exact path="/liquidityAdd/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/liquidityAdd/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />

            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
            <Route exact path="/create" component={AddLiquidity} />
            <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/liquidityRemove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
            <Route exact strict path="/liquidityRemove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} /> */}

            {/* Redirect */}
            <Route path="/pool">
              <Redirect to="/liquidity" />
            </Route>
            <Route path="/pools">
              <Redirect to="/stake" />
            </Route>
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <EasterEgg iterations={2} />
      <ToastListener />
      <SubgraphHealthIndicator />
    </Router>
  )
}

export default React.memo(App)
