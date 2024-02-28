'use client'
import JobCard from "@/components/jobs/JobCard";
import { useAppSelector } from "@/hooks/reduxHooks";
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
    const profileType: Number = useAppSelector((state) => state.profileType)

    return (
        <Box bg="#F6F6F6">
            <JobCard isOrganisation={profileType == 1}/>
        </Box>
    )
}