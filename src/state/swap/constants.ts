import { ChainId } from "@goosebumps/zx-sdk"

// BNB
export const DEFAULT_INPUT_CURRENCY = {
    [ChainId.MAINNET]: 'BNB',
    [ChainId.TESTNET]: 'BNB',
    [ChainId.ETHEREUM]: 'ETH', // TODO prince
    [ChainId.POLYGON]: 'MATIC', // TODO prince
}
// EMPIRE
// export const DEFAULT_OUTPUT_CURRENCY = '0x987ab2e9B0fd41eBB9fb162EAA55c36746811b55' // Mainnet
export const DEFAULT_OUTPUT_CURRENCY = {
    [ChainId.MAINNET]: '0x293C3Ee9ABaCb08BB8ceD107987F00EfD1539288', // Mainnet
    [ChainId.TESTNET]: '0xE7C6D00B5314EE2651Df6E18e84d6d6dF0EA96a6', // Testnet
    [ChainId.ETHEREUM]: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // ETHEREUM // TODO prince
    [ChainId.POLYGON]: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // POLYGON // TODO prince
}
