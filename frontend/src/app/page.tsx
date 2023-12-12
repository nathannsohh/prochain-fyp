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
    if (status === "idle") {
      if (wallet == null) {
        router.push('/login')
      } else {
        router.push('/login/new')
      }
    }
  }, [wallet]);



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
