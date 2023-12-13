'use client'

import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";
import { ethers } from "ethers";
import { useEffect } from "react";
import MainHeader from "@/components/MainHeader";
import { Box } from "@chakra-ui/react";

const MetamaskLayout = ({ children }: { children: React.ReactNode }) => {
    const { dispatch, state: { wallet, status } } = useMetamask();
    const listen = useListen();

    useEffect(() => {
        if (typeof window !== undefined) {
            // start by checking if window.ethereum is present, indicating a wallet extension
            const ethereumProviderInjected = typeof window.ethereum !== "undefined";
            // this could be other wallets so we can verify if we are dealing with metamask
            // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
            const isMetamaskInstalled = ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
      
            const local = window.localStorage.getItem("metamaskState");
            // user was previously connected, start listening to MM
            if (local) {
              listen();
            }
            
            // local could be null if not present in LocalStorage
            if (local) {
                const { wallet, balance } = JSON.parse(local);
                const provider = new ethers.BrowserProvider(window.ethereum);
                provider.getSigner().then((signer) => {
                    dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance, provider, signer });
                })
            } else {
                const { wallet, balance, provider, signer } = { wallet: null, balance: null, provider: null, signer: null}
                dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance, provider, signer });
            }
          }
    }, [wallet, status])

    return (
        <>
            { wallet !== null && status === "idle" && <MainHeader /> }
            <Box bg={ wallet !== null && status === "idle" ? "#F6F6F6" : "#FFFFFF" } minHeight='100vh' pt={16} pl="25%" pr="25%">
            {children}
            </Box>
        </>
    )
}

export default MetamaskLayout;