'use client'

import Image from 'next/image'
import styles from './page.module.css'
import { useMetamask } from '../hooks/useMetamask';
import { useListen } from '@/hooks/useListen';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { state: { status, wallet } } = useMetamask();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "idle" && wallet != null) {
        router.push('/feed')  
    }
  }, [wallet, status]);

  return (
    <main className={styles.main} />
  )
}
