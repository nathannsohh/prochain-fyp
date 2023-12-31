'use client'
import ProfileHead from "@/components/profile/ProfileHead";
import ProfileNewPostModal from "@/components/profile/ProfileNewPostModal";
import ProfilePostCard from "@/components/profile/ProfilePostCard";
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserManagerContract";
import { Box, useDisclosure, useToast } from "@chakra-ui/react"
import axios from "axios";
import { Contract, ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ABI from "@/../../artifacts/contracts/UserProfile.sol/UserProfile.json";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { UserType } from "@/util/types";


export default function ProfilePage() {
    const { state: { wallet, status, provider, signer } } = useMetamask();
    const router = useRouter()
    const userManagerContract: Contract | null = useUserManangerContract();
    const toast = useToast()
    const [userData, setUserData] = useState<UserType | null>(null)
    
    const { isOpen: newPostModalIsOpen, onOpen: newPostModalOnOpen, onClose: newPostModalOnClose } = useDisclosure();
    const { isOpen: editProfileModalIsOpen, onOpen:editProfileModalOnOpen, onClose: editProfileModalOnClose } = useDisclosure();

    useEffect(() => {
        if (status === "idle") {
            if (wallet === null) router.push('/login')
            console.log(userManagerContract);
            userManagerContract?.doesUserExist().then((result) => {
                if (!result) {
                    router.push('/profile/new')
                } else {
                    getUserDetails(wallet)
                }
            })
        }
    }, [wallet, status])

    const getUserDetails = async (wallet_address: string | null) => {
        try {
            const userAddress: string = await userManagerContract?.getUserProfile();
            const userProfileContract = new ethers.Contract(userAddress, ABI.abi, signer)
            const profileDataHash = await userProfileContract.profileDataHash();
            const result = await axios.get(`http://localhost:8000/user/${profileDataHash}`)
            if (result.data.success) {
                const user: UserType = result.data.user
                setUserData({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    pronouns: user.pronouns,
                    email: user.email,
                    wallet_address: user.wallet_address,
                    bio: user.bio,
                    location: user.location
                })
            }
        } catch (e) {
            console.error(e)
        }
    }

    const updateUserData = (userData: UserType) => {
        setUserData(userData)
    }

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

    return (
        <Box bg="#F6F6F6">
            <ProfileHead userData={userData} onEditProfile={editProfileModalOnOpen}/>
            <ProfilePostCard posts={[]} ownProfile={true} onNewPost={newPostModalOnOpen}/>
            {newPostModalIsOpen && <ProfileNewPostModal isOpen={newPostModalIsOpen} onClose={newPostModalOnClose} profileName={userData?.first_name + ' ' + userData?.last_name} triggerToast={triggerToast}/>}
            {editProfileModalIsOpen && <EditProfileModal isOpen={editProfileModalIsOpen} onClose={editProfileModalOnClose} triggerToast={triggerToast} userData={userData} updateUserData={updateUserData}/>}
        </Box>
    )
}