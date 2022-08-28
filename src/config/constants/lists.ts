import { BASE_URL } from "config"

const CMC = `${BASE_URL}/token-lists/cmc.json`
const COINGECKO = `${BASE_URL}/token-lists/coingecko.json`
const GOOSEBUMPS_DEFAULT = `${BASE_URL}/token-lists/goosebumps-default.json`
const GOOSEBUMPS_EXTENDED = `${BASE_URL}/token-lists/goosebumps-extended.json`
const GOOSEBUMPS_MINI_EXTENDED = `${BASE_URL}/token-lists/goosebumps-mini-extended.json`
const GOOSEBUMPS_MINI = `${BASE_URL}/token-lists/goosebumps-mini.json`
const GOOSEBUMPS_TOP15 = `${BASE_URL}/token-lists/goosebumps-top-15.json`
const GOOSEBUMPS_TOP100 = `${BASE_URL}/token-lists/goosebumps-top-100.json`

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  CMC,
  COINGECKO,
  GOOSEBUMPS_DEFAULT,
  GOOSEBUMPS_EXTENDED,
  GOOSEBUMPS_MINI_EXTENDED,
  GOOSEBUMPS_MINI,
  GOOSEBUMPS_TOP15,
  GOOSEBUMPS_TOP100,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
