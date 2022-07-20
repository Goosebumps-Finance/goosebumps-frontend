async function changeNetwork (network: any, setStatus?: any) {
    if(!window.ethereum){
        return;
    }
    try {
        const requestSwitch = async() => {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{
                    chainId: network.chainHexId
                }]
            })
        }
        await requestSwitch()
        if(setStatus)
            setStatus(1)
    } catch (err: any) {
        if(err.code === 4902) {
            const requestAdd = async() => {
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
            await requestAdd()
            if(setStatus)
                setStatus(1)
        }
    }
}

export default changeNetwork