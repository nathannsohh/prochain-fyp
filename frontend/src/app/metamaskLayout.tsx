'use client'

import { useListen } from "@/hooks/useListen";
import { useMetamask } from "@/hooks/useMetamask";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import MainHeader from "@/components/MainHeader";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import useUserFactoryContract from "@/hooks/useUserFactoryContract";
import LoginHeader from "@/components/LoginHeader";
import axios from "axios";
import { API_URL } from "@/util/constants";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { updateSelf } from "../redux_slices/profileSlice";
import { useRouter, usePathname } from "next/navigation";

const MetamaskLayout = ({ children }: { children: React.ReactNode }) => {
    const { dispatch, state: { wallet, status, isMetamaskInstalled } } = useMetamask();
    const listen = useListen();
    const userFactoryContract = useUserFactoryContract();
    const [isNewUser, setIsNewUser] = useState<Boolean | null>(null)
    const [isOrganisation, setIsOrganisation] = useState<Boolean | null>(null)
    const [currentWallet, setCurrentWallet] = useState<string | null>(null)
    const router = useRouter()
    const reduxDispatch = useAppDispatch()
    const pathname = usePathname()

    const handleUserExistence = async () => {
        try {
            while(userFactoryContract === null);
            const userExists: Boolean | null = await userFactoryContract?.doesWalletExist(wallet)
            if (userExists !== undefined && userExists !== null) {
                setIsNewUser(!userExists)
                if (!userExists) {
                    router.push('/profile/new')
                } else {
                    const type = await userFactoryContract?.getProfileType(wallet)
                    setIsOrganisation(type == 1)
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    const getUserDetails = async () => {
        try {
            while(userFactoryContract === null){}

            const [userProfile, numOfConnections] = await Promise.all([
                userFactoryContract?.getUserProfile(wallet), 
                userFactoryContract?.getNumberOfConnections(wallet)
            ])
            const userResult = await axios.get(`${API_URL}/user/${userProfile.profileDataHash}`)
            if (userResult.data.success) {
                const user: UserType = userResult.data.user
                const userDetails = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    pronouns: user.pronouns,
                    email: user.email,
                    wallet_address: user.wallet_address,
                    bio: user.bio,
                    location: user.location,
                    content_hash: user.content_hash,
                    profile_picture_hash: userProfile.profileImageHash,
                    profile_banner_hash: userProfile.profileHeaderHash
                }
                console.log("Updating from metamask layout")
                reduxDispatch(updateSelf({... userDetails, connections: numOfConnections}))
                setCurrentWallet(user.wallet_address)
            }
        } catch (e) {
            console.error(e)
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

            if (status === "idle") {
                if (wallet === null) {
                    console.log("metamask disconnect")
                    if (pathname !== '/login') router.push('/login')
                } else {
                    console.log("useEffect in metamask layout")
                    handleUserExistence()

                    if (wallet != currentWallet) {
                        getUserDetails()
                    }
                }
            } 
          }
    }, [wallet, status, pathname])

    const handleConnect = async () => {
        dispatch({ type: "loading" });
        const { ethereum } = window;
        const provider = new ethers.BrowserProvider(ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const balance = await provider.send("eth_getBalance", [accounts[0], "latest"])
            dispatch({ type: "connect", wallet: accounts[0], balance, provider, signer });

            listen()
        }
    }

    const loggedIn: Boolean = wallet !== null && status === "idle" && isNewUser === false
    return (
        <>
            {loggedIn ? <MainHeader wallet={wallet!} isOrganisation={isOrganisation}/> : wallet === null && <LoginHeader metamaskIsInstalled={isMetamaskInstalled} handleConnect={handleConnect}/>}
            <Box 
                bg={ wallet !== null ? "#F6F6F6" : "#FFFFFF" } 
                minHeight='100vh'
                pt={loggedIn ? 16 : 0}
            >
                <Flex width="100%">
                    <Spacer/>
                    <Box width={loggedIn ? "950px" : "1500px"}>
                        {children}
                    </Box>
                    <Spacer />
                </Flex>
            </Box>
        </>
    )
}

export default MetamaskLayout;