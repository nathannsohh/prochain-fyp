'use client'
import JobCard from "@/components/jobs/JobCard";
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserFactoryContract";
import { Box } from "@chakra-ui/react"
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function JobPage() {
    const { state: { wallet, status } } = useMetamask();
    const router = useRouter()
    const userFactoryContract: Contract | null = useUserManangerContract();

    // useEffect(() => {
    //     if (status === "idle") {
    //         if (wallet === null) router.push('/login')
    //         userFactoryContract?.doesUserExist(wallet).then((result) => {
    //             if (!result) {
    //                 router.push('/profile/new')
    //             }
    //         })
    //     }
    // }, [wallet, status])

    return (
        <Box bg="#F6F6F6">
            <JobCard />
        </Box>
    )
}