'use client'

import LoginHeader from '@/components/LoginHeader';
import { HStack, Text, Box, VStack, Button, Center } from '@chakra-ui/react'
import WorkingWoman from '../../images/WorkingWoman.png'
import Image from 'next/image';
import Link from 'next/link';
import { useMetamask } from '@/hooks/useMetamask';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from "ethers";
import useUserManangerContract from '@/hooks/useUserManagerContract';

export default function Login() {
    const {
        dispatch,
        state: { status, isMetamaskInstalled },
    } = useMetamask();

    const router = useRouter()
    const userManagerContract = useUserManangerContract();

    useEffect(() => {
        if (typeof window !== undefined) {
          // start by checking if window.ethereum is present, indicating a wallet extension
          const ethereumProviderInjected = typeof window.ethereum !== "undefined";
          // this could be other wallets so we can verify if we are dealing with metamask
          // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
          const isMetamaskInstalled =
            ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
    
          const local = window.localStorage.getItem("metamaskState");
    
          // local could be null if not present in LocalStorage
          const { wallet, balance } = local
            ? JSON.parse(local)
            : // backup if local storage is empty
              { wallet: null, balance: null };
            
          dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
          if (userManagerContract != null && wallet != null) {
              checkUserExistence();
          }
        }
      }, [userManagerContract]);
    
    const showInstallMetamask = status !== "pageNotLoaded" && !isMetamaskInstalled;

    const checkUserExistence = async () => {
        try {
            const response = await userManagerContract!!.doesUserExist();
            if (response === true) {
                router.push('/');
            } else {
                router.push('/login/new');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleConnect = async () => {
        dispatch({ type: "loading" });
        const { ethereum } = window;
        const provider = new ethers.BrowserProvider(ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const balance = await provider.send("eth_getBalance", [accounts[0], "latest"])
            dispatch({ type: "connect", wallet: accounts[0], balance, provider, signer });
        }
    }

    return(
        <>
            <LoginHeader metamaskIsInstalled={isMetamaskInstalled} handleConnect={handleConnect}/>
            <HStack height="full">
                <VStack width="50%" pl="8%" pr="8%">
                    <Text fontSize='4xl' as='b'>Welcome to your gateway to Decentralised Professional Networking</Text>
                    {
                        showInstallMetamask ? 
                        <>  
                            <Box>
                                <Link href="https://metamask.io/download/">
                                    <Button width="100%" mt="70px">Install Metamask</Button> 
                                </Link>
                                <Text>Please install the Metamask extension in order to use ProChain.</Text>
                            </Box>
                        </> :
                        <Button width="100%" mt="70px" onClick={handleConnect} isLoading={status === "loading"}>Log in with Metamask</Button>
                    }
                </VStack>
                <Box width="50%">
                    <Center mt="5%">
                        <Image src={WorkingWoman} alt="Working Woman" />
                    </Center>
                </Box>
            </HStack>
        </>

    ) 
}