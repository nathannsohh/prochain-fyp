'use client'

import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const MetamaskLayout = ({ children }: { children: React.ReactNode }) => {
    const { dispatch } = useMetamask();
    const listen = useListen();
    const router = useRouter();

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
    }, [])

    return (
        <>
            {children}
        </>
    )
}

export default MetamaskLayout;