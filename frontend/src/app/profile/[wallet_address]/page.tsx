'use client'
import { useMetamask } from "@/hooks/useMetamask";
import { Box } from "@chakra-ui/react"
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/reduxHooks";
import UserProfile from "@/components/profile/UserProfile";
import OrganisationProfile from "@/components/profile/OrganisationProfile";

export default function ProfilePage({ params }: { params: { wallet_address: string } }) {
    const { state: { wallet, status } } = useMetamask();
    const profileType: Number = useAppSelector((state) => state.profileType)

    useEffect(() => {
        if (status === "idle" && wallet !== null) {
            // getPostData()
            // if (isOwnProfile) {
            //     setUserData({
            //         first_name: profile.first_name!,
            //         last_name: profile.last_name!,
            //         pronouns: profile.pronouns,
            //         email: profile.email!,
            //         wallet_address: profile.wallet_address!,
            //         bio: profile.bio,
            //         location: profile.location,
            //         content_hash: profile.content_hash!,
            //         profile_picture_hash: profile.profile_picture_hash!,
            //         profile_banner_hash: profile.profile_banner_hash!
            //     })
            //     getNumberOfConnections()
            // } else {
            //     getUserDetails();
            // }
        }
    }, [wallet, status, profileType])

    return (
        <Box bg="#F6F6F6">
            {profileType === 0 && <UserProfile wallet_address={params.wallet_address}/>}
            {profileType === 1 && <OrganisationProfile wallet_address={params.wallet_address}/>}
        </Box>
    )
}