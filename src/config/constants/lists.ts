const GOOSEBUMPS_EXTENDED = 'https://goosebumps.finance/token-lists/goosebumps-extended.json'
const GOOSEBUMPS_TOP100 = 'https://goosebumps.finance/token-lists/goosebumps-top-100.json'

export const UNSUPPORTED_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  GOOSEBUMPS_TOP100,
  GOOSEBUMPS_EXTENDED,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []
