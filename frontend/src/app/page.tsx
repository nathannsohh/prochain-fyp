'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { useMetamask } from '../hooks/useMetamask';
import { useListen } from '@/hooks/useListen';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const {
    dispatch,
    state: { status, isMetamaskInstalled, wallet, balance },
  } = useMetamask();
  const listen = useListen();
  const router = useRouter();
  
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



// const showInstallMetamask = status !== "pageNotLoaded" && !isMetamaskInstalled;
// const showConnectButton = status !== "pageNotLoaded" && isMetamaskInstalled && !wallet;

// const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

// const handleConnect = async () => {
//     dispatch({ type: "loading" });
//     const accounts = await window.ethereum.request({
//         method: "eth_requestAccounts",
//     });

//     if (accounts.length > 0) {
//         const balance = await window.ethereum!.request({
//             method: "eth_getBalance",
//             params: [accounts[0], "latest"],
//         });
//         dispatch({ type: "connect", wallet: accounts[0], balance });

//         // we can register an event listener for changes to the users wallet
//         listen();
//     }
// }

const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  return (
    <main className={styles.main}>
    </main>
  )
}
