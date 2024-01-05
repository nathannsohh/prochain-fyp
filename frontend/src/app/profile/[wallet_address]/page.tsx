'use client'
import ProfileHead from "@/components/profile/ProfileHead";
import ProfileNewPostModal from "@/components/profile/ProfileNewPostModal";
import ProfilePostCard from "@/components/profile/ProfilePostCard";
import { useMetamask } from "@/hooks/useMetamask";
import useUserFactoryContract from "@/hooks/useUserFactoryContract";
import { Box, useDisclosure, useToast } from "@chakra-ui/react"
import axios from "axios";
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditProfileModal from "@/components/profile/EditProfileModal";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { updateSelf } from "../profileSlice";
import { API_URL, THE_GRAPH_URL } from "@/util/constants";

interface PostType {
    id: string,
    postContentHash: string,
    postImageHash: string
}

export default function ProfilePage({ params }: { params: { wallet_address: string } }) {
    const { state: { wallet, status } } = useMetamask();
    const ownProfile = useAppSelector((state) => state.ownProfile.value)
    const router = useRouter()
    const userFactoryContract: Contract | null = useUserFactoryContract();
    const toast = useToast()
    const [userData, setUserData] = useState<UserType | null>(params.wallet_address === wallet ? ownProfile : null)
    const [connections, setConnections] = useState<Number | null>(params.wallet_address === wallet ? ownProfile?.connections! : null)

    const dispatch = useAppDispatch()
    
    const { isOpen: newPostModalIsOpen, onOpen: newPostModalOnOpen, onClose: newPostModalOnClose } = useDisclosure();
    const { isOpen: editProfileModalIsOpen, onOpen:editProfileModalOnOpen, onClose: editProfileModalOnClose } = useDisclosure();

    useEffect(() => {
        if (status === "idle") {
            if (wallet === null) router.push('/login')
            
            userFactoryContract?.doesUserExist(wallet).then((result) => {
                if (!result) {
                    router.push('/profile/new')
                } else {
                    if (params.wallet_address === wallet) {
                        if (ownProfile === null) getUserDetails()
                    }
                }
            })
        }
    }, [wallet, status])

    const getArrayOfPostContentHashes = (postData: Array<PostType>): Array<Number>  => {
        let postHashArray = []
        for (const post of postData) {
            postHashArray.push(Number(post.postContentHash))
        }
        return postHashArray
    }

    const getUserDetails = async () => {
        const graphqlQuery = {
            "operationName": "getPosts",
            "query": `query getPosts { posts (where: { owner: "${params.wallet_address}", postContentHash_not: ""}) { postContentHash postImageHash id } }`,
            "variables": {}
        }

        try {
            const [user, numOfConnections, posts] = await Promise.all([
                userFactoryContract?.getUserProfile(params.wallet_address), 
                userFactoryContract?.getNumberOfConnections(params.wallet_address),
                axios.post(`${THE_GRAPH_URL}/posts`, graphqlQuery)
            ])

            const allPosts = posts.data.data.posts
            const postHashes = getArrayOfPostContentHashes(allPosts)

            const [userResult, postResult] = await Promise.all([
                axios.get(`${API_URL}/user/${user.profileDataHash}`),
                axios.get(`${API_URL}/post/[${postHashes}]`)
            ])

            if (userResult.data.success) {
                const user: UserType = userResult.data.user
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
            {newPostModalIsOpen && 
                <ProfileNewPostModal 
                    isOpen={newPostModalIsOpen} 
                    onClose={newPostModalOnClose} 
                    profileName={userData?.first_name + ' ' + userData?.last_name} 
                    triggerToast={triggerToast}/>}

            {editProfileModalIsOpen && 
                <EditProfileModal 
                    isOpen={editProfileModalIsOpen} 
                    onClose={editProfileModalOnClose} 
                    triggerToast={triggerToast} 
                    userData={userData} 
                    updateUserData={updateUserData}/>}
        </Box>
    )
}