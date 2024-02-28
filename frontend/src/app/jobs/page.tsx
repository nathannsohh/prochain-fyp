'use client'
import JobCard from "@/components/jobs/JobCard";
import OwnJobCard from "@/components/jobs/OwnJobCard";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserFactoryContract";
import { Box } from "@chakra-ui/react"
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobPage() {
    const { state: { wallet, status } } = useMetamask();

    const profileType: Number = useAppSelector((state) => state.profileType)
    const [showMyJobs, setShowMyJobs] = useState<boolean>(false)

    const handleShowJob = () => {
        setShowMyJobs(prevState => !prevState)
    }

    return (
        <Box bg="#F6F6F6">
            {!showMyJobs ? <JobCard isOrganisation={profileType == 1} handleShowJob={handleShowJob}/> : <OwnJobCard isOrganisation={profileType == 1} handleShowJob={handleShowJob}/>}
        </Box>
    )
}