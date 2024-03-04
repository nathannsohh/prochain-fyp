'use client'
import { useMetamask } from "@/hooks/useMetamask";
import { Box } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/reduxHooks";
import UserProfile from "@/components/profile/UserProfile";
import OrganisationProfile from "@/components/profile/OrganisationProfile";
import useUserFactoryContract from "@/hooks/useUserFactoryContract";

export default function ProfilePage({ params }: { params: { wallet_address: string } }) {
    const { state: { wallet, status } } = useMetamask();
    const profileType: Number = useAppSelector((state) => state.profileType)
    const [type, setType] = useState<Number>(-1)

    const userFactoryContract = useUserFactoryContract()

    useEffect(() => {
        if (params.wallet_address === wallet) {
            setType(profileType)
        } else {
            userFactoryContract?.getProfileType(params.wallet_address).then((val) => {
                return setType(Number(val))
            })
        }
    }, [wallet, status, profileType])

    return (
        <Box bg="#F6F6F6">
            {type === 0 && <UserProfile wallet_address={params.wallet_address}/>}
            {type === 1 && <OrganisationProfile wallet_address={params.wallet_address}/>}
        </Box>
    )
}