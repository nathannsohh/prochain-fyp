'use client'
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserFactoryContract";
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Feed = () => {
    const { state: { wallet, status } } = useMetamask();
    const router = useRouter()
    const userFactoryContract: Contract | null = useUserManangerContract();

    useEffect(() => {
        if (status === "idle") {
            if (wallet === null) router.push('/login')
            console.log(userFactoryContract);
            userFactoryContract!.doesUserExist(wallet).then((result) => {
                if (!result) {
                    router.push('/profile/new')
                }
            })
        }
    }, [wallet, status])

    return <>Hello!</>
}

export default Feed;