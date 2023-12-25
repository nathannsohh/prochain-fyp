'use client'

import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import MainHeader from "@/components/MainHeader";
import { Box } from "@chakra-ui/react";
import useUserManangerContract from "@/hooks/useUserManagerContract";

const MetamaskLayout = ({ children }: { children: React.ReactNode }) => {
    const { dispatch, state: { wallet, status } } = useMetamask();
    const listen = useListen();
    const userManagerContract = useUserManangerContract();
    const [isNewUser, setIsNewUser] = useState<Boolean | null>(null)

    const handleUserExistence = async () => {
        try {
            const response: Boolean | null = await userManagerContract?.doesUserExist()
            console.log(response);
            setIsNewUser(!response)
            // if (response) {
            //     router.push('/profile')
            // }
        } catch (e) {

        }
    }

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
            handleUserExistence()
          }
    }, [wallet, status])

    const loggedIn: Boolean = wallet !== null && status === "idle" && !isNewUser

    return (
        <>
            {loggedIn && <MainHeader /> }
            <Box 
            bg={ loggedIn ? "#F6F6F6" : "#FFFFFF" } 
            minHeight='100vh' 
            pt={loggedIn ? 16 : 0} 
            pl={loggedIn ? "25%" : ""}
            pr={loggedIn ? "25%" : ""}>
            {children}
            </Box>
        </>
    )
}

export default MetamaskLayout;