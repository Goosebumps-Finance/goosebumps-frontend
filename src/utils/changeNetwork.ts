export const changeNetwork = async (network: any) => {
    if(!window.ethereum) return;
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: network.chainHexId
            }]
        })
    } catch (err: any) {
        if(err.code === 4902) {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainName: network.Display,
                        chainId: network.chainHexId,
                        nativeCurrency: {
                            name: network.Currency.Name,
                            decimals: network.Currency.Decimals,
                            symbol: network.Currency.Name
                        },
                        rpcUrls: [ network.RPC ]
                    }
                ]
            })
        }
    }
}