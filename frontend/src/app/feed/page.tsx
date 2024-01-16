'use client'
import NewPostCard from "@/components/feed/NewPostCard";
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserFactoryContract";
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import axios from 'axios'
import { API_URL } from "@/util/constants";
import { updateSelf } from "../profile/profileSlice";
import { useDisclosure, useToast, Divider } from '@chakra-ui/react'
import ProfileNewPostModal from "@/components/profile/ProfileNewPostModal";
import Post from "@/components/feed/Post";

const Feed = () => {
    const { state: { wallet, status } } = useMetamask();
    const router = useRouter()
    const userFactoryContract: Contract | null = useUserManangerContract();

    const ownProfile: ProfileState = useAppSelector((state) => state.ownProfile)
    const {posts, connections, ...profile}: ProfileState = ownProfile

    const dispatch = useAppDispatch()
    const toast = useToast()
    const { isOpen: newPostModalIsOpen, onOpen: newPostModalOnOpen, onClose: newPostModalOnClose } = useDisclosure();

    const [userData, setUserData] = useState<UserType | null>(ownProfile.first_name !== null ? {
        first_name: profile.first_name!,
            last_name: profile.last_name!,
            pronouns: profile.pronouns,
            email: profile.email!,
            wallet_address: profile.wallet_address!,
            bio: profile.bio,
            location: profile.location,
            content_hash: profile.content_hash!,
            profile_picture_hash: profile.profile_picture_hash!,
            profile_banner_hash: profile.profile_banner_hash!
    } : null)

    useEffect(() => {
        if (status === "idle") {
            if (wallet === null) router.push('/login')
            userFactoryContract!.doesUserExist(wallet).then((result) => {
                if (!result) {
                    router.push('/profile/new')
                }
                if (ownProfile.first_name === null) getUserDetails()
            })
        }
    }, [wallet, status])

    const triggerToast = (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => {
        toast({
            title: title,
            description: description,
            status: status,
            duration: 4000,
            variant: 'subtle',
            position: 'bottom-left'
        })
    }

    const getUserDetails = async () => {
        try {
            const [userProfile, numOfConnections] = await Promise.all([
                userFactoryContract?.getUserProfile(wallet), 
                userFactoryContract?.getNumberOfConnections(wallet)
            ])
            
            const userResult = await axios.get(`${API_URL}/user/${userProfile.profileDataHash}`)
            if (userResult.data.success) {
                const user: UserType = userResult.data.user
                const userDetails = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    pronouns: user.pronouns,
                    email: user.email,
                    wallet_address: user.wallet_address,
                    bio: user.bio,
                    location: user.location,
                    content_hash: user.content_hash,
                    profile_picture_hash: userProfile.profileImageHash,
                    profile_banner_hash: userProfile.profileHeaderHash
                }
                setUserData(userDetails)
                dispatch(updateSelf({... userDetails, connections: numOfConnections}))
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <NewPostCard userData={userData} onNewPost={newPostModalOnOpen} />
            {newPostModalIsOpen && 
                <ProfileNewPostModal 
                isOpen={newPostModalIsOpen} 
                onClose={newPostModalOnClose} 
                profileName={userData?.first_name + ' ' + userData?.last_name} 
                profilePictureHash={userData?.profile_picture_hash!}
                triggerToast={triggerToast}
                loadUserPosts={() => {}}/>}
                <Divider mt={3} borderColor="#C8C8C8"/>
            <Post />
        </>
    )
}

export default Feed;