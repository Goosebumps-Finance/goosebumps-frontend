import { Button, Flex } from '@goosebumps/uikit'
import React from 'react'
import styled from 'styled-components'
import HomePageText from '../home.json'

const ChartSection = () => {
  return (
    <div className="wrap-bg">
      <div className="manage-area pt-100">
        <div className="container">
          <div className="section-title">
            <h2>A single dashboard for your portfolio</h2>
            <p>
              If you&apos;re tired of using five different platforms to track your crypto invetments, then it&apos;s
              time to meet Goosebumps.
            </p>
          </div>

          <div className="row align-items-center">
            <div className="col-lg-4">
              <div className="manage-content">
                <ul>
                  <li>
                    <h3>
                      <img src="/images/goosebumps/dashboard-icon.png" alt="goosebumps" />
                      One dashboard for all your portfolio needs.
                    </h3>
                    <p>
                      We give you the power to invest in cryptocurrencies with no risk, no hassle, and minimal technical
                      knowledge needed.
                    </p>
                  </li>
                  <li>
                    <h3>
                      <img src="/images/goosebumps/portfolio-icon.png" alt="goosebumps" />A sense of security that comes
                      easy
                    </h3>
                    <p>
                      We keep your data safe and never let you worry about data breaches or hacks. The best part? You
                      can use the app with peace of mind - it&apos;s completely free!
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="manage-img ml-15">
                <img src="/images/goosebumps/3manage-img.png" alt="goosebumps" style={{ marginBottom: '40px' }} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="manage-content">
                <ul>
                  <li>
                    <h3>
                      <img src="/images/goosebumps/portfolio-icon.png" alt="goosebumps" />A platform that&apos;s built
                      just for you
                    </h3>
                    <p>
                      Whether you&apos;re a beginner trader or a pro, Goosebumps has tools that are tailored for your
                      needs. Stay on top of all your trades with features like portfolio management, news feed, alerts &
                      more!
                    </p>
                  </li>
                  <li>
                    <h3 className="quick">
                      <img src="/images/goosebumps/usd-icon.png" alt="goosebumps" />
                      &nbsp;&nbsp;&nbsp;An app that looks great on any screen size
                    </h3>
                    <p>
                      Goosebumps has been designed to take advantage of our modern-day screens - big or small - so you
                      can trade without missing out on any important market updates with our app’s responsiveness.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="dex" className="dex-area pt-100">
        <div className="container">
          <div className="section-title">
            <h2>Dex</h2>
            <p>Goosebumps supports over 1000 cryptocurrencies across different chains!</p>
          </div>

          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="single-dex">
                <img src="/images/goosebumps/bit-icon.png" alt="goosebumps" />
                <h3>Swap and Add Liquidity</h3>
                <p>
                  With the features Goosebumps provides you such as advanced charting and portfolio tracking, DeFi will
                  gain a completely new perspective for you. Watch your assets easily, buy on the bid and sell on the
                  ask.{' '}
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="single-dex">
                <img src="/images/goosebumps/rate-icon.png" alt="goosebumps" />
                <h3>Cross-chain Swap</h3>
                <p>
                  It is a smart contract technology that allows your tokens to be exchanged between two distinct
                  blockchain ecosystems. It enables you to exchange tokens directly on another blockchain without the
                  need for an intermediary or central authority.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="single-dex">
                <img src="/images/goosebumps/lock-icon.png" alt="goosebumps" />
                <h3>Staking pools </h3>
                <p>
                  A staking pool allows you to pool your computational resources in order to increase chances of
                  winning. Staking Pools offers its staking power in the process of verifying and validating new blocks,
                  increasing the community&apos;s chances of earning block rewards.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="single-dex">
                <img src="/images/goosebumps/chart-icon.png" alt="goosebumps" />
                <h3>Farming pools</h3>
                <p>
                  Farming pools are the driving force behind a marketplace where anyone can lend or borrow tokens. It
                  helps you to maximize returns through the use of DeFi. Users are charged fees for using, which are
                  used to compensate liquidity providers for staking their own tokens in the pool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="portfolio-tracker" className="portfolio-tracker-area pt-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="portfolio-tracker-img">
                <img src="images/goosebumps/3portfolio-tracker-img.png" alt="goosebumps" />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="chart-content">
                <h2>Get a bird&apos;s eye view of your investments</h2>
                <h4>
                  Using Goosebumps is an easy way to track your assets across different wallets. Watch the prices change
                  in real-time, and get alerts when they change color!
                </h4>
                <ul>
                  <li className="d-flex align-items-start">
                    <img src="/images/goosebumps/check-icon.png" alt="goosebumps" />
                    <h6>Stay on top of your portfolio</h6>
                  </li>
                  <p style={{ fontSize: '14px' }}>
                    Our goal is to give you a single view of your portfolios across multiple, different wallets. Watch
                    the prices change in real time with alerts on when they change color.
                  </p>
                  <li className="d-flex align-items-start">
                    <img src="/images/goosebumps/check-icon.png" alt="goosebumps" />
                    <h6>Track all your coins at once</h6>
                  </li>
                  <p style={{ fontSize: '14px' }}>
                    Track coins across different wallets that are on different chains. Track the price history of each
                    coin all in one monitor for easy viewing.
                  </p>
                  <li className="d-flex align-items-start">
                    <img src="/images/goosebumps/check-icon.png" alt="goosebumps" />
                    <h6>No more headaches, no more stress!</h6>
                  </li>
                  <p style={{ fontSize: '14px' }}>
                    Goosebumps Charts takes away the headache of checking multiple wallets for new transactions. Track
                    all of your wallets in one place for less headache and stress!
                  </p>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="charts" className="chart-area ptb-100">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="portfolio-tracker-content ml-15">
                <h2>{HomePageText.section6.title}</h2>
                <p>{HomePageText.section6.abstract}</p>

                <ul>
                  <li className="d-flex align-items-start align-items-center">
                    <img src="/images/goosebumps/noti-icon.png" alt="goosebumps" />
                    <div>
                      <h4>{HomePageText.section6.subtitle1}</h4>
                      <p>{HomePageText.section6.description1}</p>
                    </div>
                  </li>
                  {/* <li className="d-flex align-items-start align-items-center">
                      <img src="/images/goosebumps/src-icon.png" alt="goosebumps" />
                      <p>Each chart will have a trade history just like Poocoin and Bogged charts</p>
                    </li> */}
                  <li className="d-flex align-items-start align-items-center">
                    <img src="/images/goosebumps/pai-icon.png" alt="goosebumps" />
                    <div>
                      <h4>Indicators for user activity</h4>
                      <p>Don’t get lost and keep track of your trading activity, anytime, anywhere.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="chart-img ml-15">
                <img src="/images/goosebumps/3chart-img.png" alt="goosebumps" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="partner-area-chim pb-70">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-4.png" alt="goosebumps" />
              </div>
            </div>
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-5.png" alt="goosebumps" />
              </div>
            </div>
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-3.png" alt="goosebumps" />
              </div>
            </div>
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-1.png" alt="goosebumps" />
              </div>
            </div>
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-7.png" alt="goosebumps" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-10.png" alt="goosebumps" />
              </div>
            </div>
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-2.png" alt="goosebumps" />
              </div>
            </div>
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-6.png" alt="goosebumps" />
              </div>
            </div>
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-9.png" alt="goosebumps" />
              </div>
            </div>
            <div className="col">
              <div className="partner-item">
                <img src="/images/goosebumps/partner/partner-8.png" alt="goosebumps" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartSection
