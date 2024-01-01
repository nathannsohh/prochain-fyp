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
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { updateSelf } from "../profileSlice";


export default function ProfilePage({ params }: { params: { wallet_address: string } }) {
    const { state: { wallet, status, signer } } = useMetamask();
    const ownProfile = useAppSelector((state) => state.ownProfile.value)
    const router = useRouter()
    const userManagerContract: Contract | null = useUserManangerContract();
    const toast = useToast()
    const [userData, setUserData] = useState<UserType | null>(params.wallet_address === wallet ? ownProfile : null)
    const [connections, setConnections] = useState<Number | null>(params.wallet_address === wallet ? ownProfile?.connections! : null)

    const dispatch = useAppDispatch()
    
    const { isOpen: newPostModalIsOpen, onOpen: newPostModalOnOpen, onClose: newPostModalOnClose } = useDisclosure();
    const { isOpen: editProfileModalIsOpen, onOpen:editProfileModalOnOpen, onClose: editProfileModalOnClose } = useDisclosure();

    useEffect(() => {
        console.log(params)
        if (status === "idle") {
            if (wallet === null) router.push('/login')
            console.log(userManagerContract);
            userManagerContract?.doesUserExist().then((result) => {
                if (!result) {
                    router.push('/profile/new')
                } else {
                    if (params.wallet_address === wallet) {
                        if (ownProfile === null) getUserDetails(wallet)
                    }
                }
            })
        }
    }, [wallet, status])

    const getUserDetails = async (wallet_address: string | null) => {
        try {
            const userAddress: string = await userManagerContract?.getUserProfile(wallet_address)
            const userProfileContract = new ethers.Contract(userAddress, ABI.abi, signer)
            const [profileDataHash, numOfConnections]  = await Promise.all([userProfileContract.profileDataHash(), userProfileContract.getNumberOfConnections()])
            const result = await axios.get(`http://localhost:8000/user/${profileDataHash}`)
            if (result.data.success) {
                const user: UserType = result.data.user
                const userDetails = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    pronouns: user.pronouns,
                    email: user.email,
                    wallet_address: user.wallet_address,
                    bio: user.bio,
                    location: user.location
                }
                setUserData(userDetails)
                setConnections(numOfConnections)
                dispatch(updateSelf({... userDetails, connections: numOfConnections}))
            }
        } catch (e) {
            console.error(e)
        }
    }

    const updateUserData = (userData: UserType) => {
        dispatch(updateSelf({...userData, connections: connections!}))
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
            <ProfileHead userData={userData} onEditProfile={editProfileModalOnOpen} connections={connections}/>
            <ProfilePostCard posts={[]} ownProfile={true} onNewPost={newPostModalOnOpen}/>
            {newPostModalIsOpen && <ProfileNewPostModal isOpen={newPostModalIsOpen} onClose={newPostModalOnClose} profileName={userData?.first_name + ' ' + userData?.last_name} triggerToast={triggerToast}/>}
            {editProfileModalIsOpen && <EditProfileModal isOpen={editProfileModalIsOpen} onClose={editProfileModalOnClose} triggerToast={triggerToast} userData={userData} updateUserData={updateUserData}/>}
        </Box>
    )
}