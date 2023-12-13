'use client'
import MainHeader from "@/components/MainHeader"
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserManagerContract";
import { Box } from "@chakra-ui/react"
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const { state: { wallet, status } } = useMetamask();
    const router = useRouter()
    const userManagerContract: Contract | null = useUserManangerContract();

    useEffect(() => {
        if (status === "idle") {
            if (wallet === null) router.push('/login')
            console.log(userManagerContract);
            userManagerContract?.doesUserExist().then((result) => {
                if (!result) {
                    router.push('/profile/new')
                }
            })
        }
    }, [wallet, status])

    return (
        <Box bg="#F6F6F6">
            <div>Profile!</div>
        </Box>
    )
}