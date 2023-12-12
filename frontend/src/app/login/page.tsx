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
import { useListen } from '@/hooks/useListen';

export default function Login() {
    const {
        dispatch,
        state: { status, isMetamaskInstalled, wallet },
    } = useMetamask();

    const router = useRouter()
    const userManagerContract = useUserManangerContract();
    const listen = useListen()

    useEffect(() => {
        if (wallet != null && status === "idle") {
            router.push('/')
        }
      }, [wallet]);
    
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

            listen()
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