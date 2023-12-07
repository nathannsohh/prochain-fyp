'use client'

import LoginHeader from '@/components/LoginHeader';
import { HStack, Text, Box, VStack, Button, Center } from '@chakra-ui/react'
import WorkingWoman from '../../images/WorkingWoman.png'
import Image from 'next/image';
import { useMetamask } from '@/hooks/useMetamask';
import { useListen } from '@/hooks/useListen';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const {
        dispatch,
        state: { status, isMetamaskInstalled, wallet, balance },
    } = useMetamask();
    const listen = useListen();
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== undefined) {
          // start by checking if window.ethereum is present, indicating a wallet extension
          const ethereumProviderInjected = typeof window.ethereum !== "undefined";
          // this could be other wallets so we can verify if we are dealing with metamask
          // using the boolean constructor to be explecit and not let this be used as a falsy value (optional)
          const isMetamaskInstalled =
            ethereumProviderInjected && Boolean(window.ethereum.isMetaMask);
    
          const local = window.localStorage.getItem("metamaskState");
    
          // user was previously connected, start listening to MM
          if (local) {
            listen();
          }
    
          // local could be null if not present in LocalStorage
          const { wallet, balance } = local
            ? JSON.parse(local)
            : // backup if local storage is empty
              { wallet: null, balance: null };
    
          dispatch({ type: "pageLoaded", isMetamaskInstalled, wallet, balance });
    
          if (!wallet) {
            router.push('/login');
          } else {
            router.push('/feed')
          }
        }
      }, []);
    
    
    
    const showInstallMetamask = status !== "pageNotLoaded" && !isMetamaskInstalled;
    const showConnectButton = status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

    return(
        <>
            <LoginHeader metamaskIsInstalled={showInstallMetamask}/>
            <HStack height="full">
                <VStack width="50%" pl="8%" pr="8%">
                    <Text fontSize='4xl' as='b'>Welcome to your gateway to Decentralised Professional Networking</Text>
                    <Button width="100%" mt="70px">Log in with Metamask</Button>
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