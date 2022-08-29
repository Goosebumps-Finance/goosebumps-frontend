import { ChainId } from '@goosebumps/sdk'
import { MAINNET_RPC, TESTNET_RPC, ETHEREUM_RPC, POLYGON_RPC, BASE_BSC_SCAN_URLS } from 'config'
import { OptionProps } from 'config/constants/types'

export const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: MAINNET_RPC,
  [ChainId.TESTNET]: TESTNET_RPC,
  [ChainId.ETHEREUM]: ETHEREUM_RPC,
  [ChainId.POLYGON]: POLYGON_RPC,
}

export const chainList: OptionProps[] = [
  {
    label: "BSC",
    value: "bsc"
  },
  {
    label: "BSC Testnet",
    value: "bsc_testnet"
  }
  // {
  //   label: "Ethereum",
  //   value: "ethereum"
  // },
  // {
  //   label: "Polygon",
  //   value: "matic"
  // },
]

export const networks = [
  {
    "Display": "Ethereum",
    "Name": "ethereum",
    "NickName": "ethereum",
    "chainId": ChainId.ETHEREUM,
    "chainHexId": "0x1",
    "RPC": NETWORK_URLS[ChainId.ETHEREUM],
    "Explorer": BASE_BSC_SCAN_URLS[ChainId.ETHEREUM],
    "MulticallAddress": "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
    "SwapApi": "https://api.0x.org/",
    "DEX": {
      "Factory": "",
      "Router": ""
    },
    "Bridge": {
      "Bridge": "0xcc6001bda09619d89caf99d52ed1e70225028703",
      "Token": "0x5c668e913d5b9395a43c075bf87534460cee15f9"
    },
    "Currency": {
      "Name": "ETH",
      "WrappedName": "WETH",
      "Address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "Decimals": 18
    },
    "USD": {
      "Address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "Pair": "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
      "Decimals": 6
    },
    "USDs": [
      "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      "0x4fabb145d64652a948d72533023f6e7a623c7c53",
      "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
      "0x6b175474e89094c44da98b954eedeac495271d0f",
      "0x0000000000085d4780b73119b644ae5ecd22b376",
      "0x8e870d67f660d95d5be530380d0ec0bd388289e1"
    ]
  },
  {
    "Display": "Ropsten",
    "Name": "ropsten",
    "NickName": "ropsten",
    "chainId": 3,
    "chainHexId": "0x3",
    "RPC": "https://ropsten.infura.io/v3/687f55defdfe416faa0b388c1332727c",
    "Explorer": "https://ropsten.etherscan.io/",
    "MulticallAddress": "0x53c43764255c17bd724f74c4ef150724ac50a3ed",
    "SwapApi": "https://ropsten.api.0x.org/",
    "DEX": {
      "Factory": "0x354924E426FA21EbEc142BE760753D4407b8a59E",
      "Router": "0x48D874a757a05eAc5F353BA570266D39698F69F6",
      "DEXManage": "0xa9B6a314abF836A1f05ce40Bd857fd89356083b5"
    },
    "Currency": {
      "Name": "ETH",
      "WrappedName": "WETH",
      "Address": "0xc778417E063141139Fce010982780140Aa0cD5Ab",
      "Decimals": 18
    },
    "USD": {
      "Address": "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83",
      "Pair": "0xE5133CA897f1c5cdd273775EEFB950f3055F125D",
      "Decimals": 6
    },
    "USDs": [
      "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83",
      "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"
    ]
  },
  {
    "Display": "BSC",
    "Name": "bsc",
    "NickName": "bsc",
    "chainId": ChainId.MAINNET,
    "chainHexId": "0x38",
    "RPC": NETWORK_URLS[ChainId.MAINNET],
    "Explorer": BASE_BSC_SCAN_URLS[ChainId.MAINNET],
    "MulticallAddress": "0x41263cba59eb80dc200f3e2544eda4ed6a90e76c",
    "SwapApi": "https://bsc.api.0x.org/",
    "DEX": {
      "Factory": "0x045e2e2a533db4559533a71631962836c7802834",
      "Router": "0x5f227dce0baafecf49ac4987fb5c07a993d36291",
      "DEXManage": "0x4d9ce73103c4fa07c4a6fee7749ce37ec2804722"
    },
    "Bridge": {
      "Bridge": "0xcc6001bda09619d89caf99d52ed1e70225028703",
      "Token": "0x5c668e913d5b9395a43c075bf87534460cee15f9"
    },
    "Currency": {
      "Name": "BNB",
      "WrappedName": "WBNB",
      "Address": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
      "Decimals": 18
    },
    "USD": {
      "Address": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      "Pair": "0x58f876857a02d6762e0101bb5c46a8c1ed44dc16",
      "Decimals": 18
    },
    "USDs": [
      "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      "0x55d398326f99059ff775485246999027b3197955",
      "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      "0x23396cf899ca06c4472205fc903bdb4de249d6fc",
      "0x334b3ecb4dca3593bccc3c7ebd1a1c1d1780fbf1",
      "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
      "0x14016e85a25aeb13065688cafb43044c2ef86784",
      "0xb7f8cd00c5a06c0537e2abff0b58033d02e5e094"
    ]
  },
  {
    "Display": "BSC Testnet",
    "Name": "bsc_testnet",
    "NickName": "bsc_testnet",
    "chainId": ChainId.TESTNET,
    "chainHexId": "0x61",
    "RPC": NETWORK_URLS[ChainId.TESTNET],
    "Explorer": BASE_BSC_SCAN_URLS[ChainId.TESTNET],
    "MulticallAddress": "0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576",
    "SwapApi": "",
    "DEX": {
      "Factory": "0x75C821CCD003CC9E9Ea06008fAf9Ab8189B1EC56",
      "Router": "0x31cB34991756FD1564b0DEBF2BFF3E522085EC02",
      "DEXManage": "0xFD30B07eE421B307bdaCaf8ffE7329bF684227B2"
    },
    "Currency": {
      "Name": "BNB",
      "WrappedName": "WBNB",
      "Address": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      "Decimals": 18
    },
    "USD": {
      "Address": "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7",
      "Pair": "0x2fa498d3bd0c08ecac72e921ffe09f6f7471485c",
      "Decimals": 18
    },
    "USDs": [
      "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7",
      "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684"
    ]
  },
  {
    "Display": "Polygon",
    "Name": "matic",
    "NickName": "polygon",
    "chainId": ChainId.POLYGON,
    "chainHexId": "0x89",
    "RPC": NETWORK_URLS[ChainId.POLYGON],
    "Explorer": BASE_BSC_SCAN_URLS[ChainId.POLYGON],
    "MulticallAddress": "0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507",
    "SwapApi": "https://polygon.api.0x.org/",
    "DEX": {
      "Factory": "0xa2a6a700452e4590c175c69c84c09655abbc942f",
      "Router": "0x8e49f3b03d2f482af5c564d933f44de7fdd9c746",
      "DEXManage": "0x34692a435f7b54706a50332af61f5be83d5b1a47"
    },
    "Currency": {
      "Name": "MATIC",
      "WrappedName": "WMATIC",
      "Address": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      "Decimals": 18
    },
    "USD": {
      "Address": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      "Pair": "0x5e58e0ced3a272caeb8ba00f4a4c2805df6be495",
      "Decimals": 6
    },
    "USDs": [
      "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063"
    ]
  }
]

export default networks
