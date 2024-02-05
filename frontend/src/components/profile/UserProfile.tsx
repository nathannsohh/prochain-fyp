import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import EditProfileModal from "./EditProfileModal";
import ProfileHead from "./ProfileHead";
import ProfileNewPostModal from "./ProfileNewPostModal";
import ProfilePostCard from "./ProfilePostCard";
import { useEffect, useState } from "react";
import useUserFactoryContract from "@/hooks/useUserFactoryContract";
import { Contract } from "ethers";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { getArrayOfPostContentHashes } from "@/util/util";
import axios from "axios";
import { API_URL, THE_GRAPH_URL } from "@/util/constants";
import { useMetamask } from "@/hooks/useMetamask";
import { updateSelf } from "@/redux_slices/profileSlice";

interface UserProfileProps {
    wallet_address: string
}

export default function UserProfile(props: UserProfileProps) {
    const { state: { wallet, status } } = useMetamask();
    const ownProfile: ProfileState = useAppSelector((state) => state.ownProfile)
    const {posts, connections, ...profile}: ProfileState = ownProfile
    const isOwnProfile: Boolean = profile.wallet_address !== null && profile.wallet_address === props.wallet_address
    
    const [userData, setUserData] = useState<UserType | null>(isOwnProfile ? {
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
    const [userPosts, setUserPosts] = useState<Array<PostType> | null>(isOwnProfile ? posts : null)
    const [userConnections, setUserConnections] = useState<Number | null>(isOwnProfile ? connections : null)
    const [isConnection, setIsConnection] = useState<Boolean | null>(null)
    const userFactoryContract: Contract | null = useUserFactoryContract();
    const toast = useToast()


    const dispatch = useAppDispatch()

    const { isOpen: newPostModalIsOpen, onOpen: newPostModalOnOpen, onClose: newPostModalOnClose } = useDisclosure();
    const { isOpen: editProfileModalIsOpen, onOpen:editProfileModalOnOpen, onClose: editProfileModalOnClose } = useDisclosure();

    const getPostData = async () => {
        const graphqlQuery = {
            "operationName": "getPosts",
            "query": `query getPosts {
                         posts (
                            where: { owner: "${props.wallet_address}", postContentHash_not: ""}, 
                            orderBy: postId,
                            orderDirection: desc,
                            first: 2
                        ) { postContentHash postImageHash id likedBy comments { commentContentHash } } }`,
            "variables": {}
        }
        try {
            const posts = await axios.post(`${THE_GRAPH_URL}/posts`, graphqlQuery)
            const allPosts = posts.data.data.posts.reverse()
            const postHashes = getArrayOfPostContentHashes(allPosts)
            const postResult = await axios.get(`${API_URL}/post/[${postHashes}]`)

            const consolidatedPosts = allPosts.map((post: any, index: number) => {
                return {...post, content: postResult.data.posts[index].content, time_posted: postResult.data.posts[index].time_posted}
            })
            setUserPosts(consolidatedPosts)
            // dispatch(updatePosts(consolidatedPosts))
        } catch (e) {
            console.error(e)
        }
    }

    const getUserDetails = async () => {
        try {
            const [userProfile, numOfConnections] = await Promise.all([
                userFactoryContract!.getUserProfile(props.wallet_address), 
                userFactoryContract!.getNumberOfConnections(props.wallet_address)
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
                if (!isOwnProfile) {
                    const isConnection = await userFactoryContract?.isConnection(profile.wallet_address!, props.wallet_address)
                    setIsConnection(isConnection)
                }
                setUserData(userDetails)
                setUserConnections(numOfConnections)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const getNumberOfConnections = async () => {
        try {
            while (userFactoryContract === null);
            const numOfConnections = await userFactoryContract!.getNumberOfConnections(wallet)
            setUserConnections(numOfConnections)
        } catch (e) {
            console.error(e)
        }
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

    const connectHandler = async () => {
        try {
            await userFactoryContract?.addConnectionRequest(props.wallet_address, wallet)
            triggerToast("Request Sent!", "Your connection request has been sent to this user.", "success")
        } catch (e) {
            console.error(e)
            triggerToast("Error", "Something went wrong.", "error")
        }
    }

    const updateUserData = (userData: UserType) => {
        dispatch(updateSelf({...userData, connections: connections!}))
        setUserData(userData)
    }

    useEffect(() => {
        if (status === "idle" && wallet !== null) {
            getPostData()
            if (isOwnProfile) {
                setUserData({
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
                })
                getNumberOfConnections()
            } else {
                getUserDetails();
            }
        }
    }, [wallet, status])

    return (
        <>
            <ProfileHead userData={userData} onEditProfile={editProfileModalOnOpen} connections={userConnections} ownProfile={isOwnProfile} isConnected={isConnection} onConnect={connectHandler}/>
            <ProfilePostCard posts={userPosts} profileName={userData?.first_name + ' ' + userData?.last_name} ownProfile={isOwnProfile} onNewPost={newPostModalOnOpen}/>
            {newPostModalIsOpen && 
                <ProfileNewPostModal 
                    isOpen={newPostModalIsOpen} 
                    onClose={newPostModalOnClose} 
                    profileName={userData?.first_name + ' ' + userData?.last_name} 
                    profilePictureHash={userData?.profile_picture_hash!}
                    triggerToast={triggerToast}
                    loadUserPosts={getPostData}/>}

            {editProfileModalIsOpen && 
                <EditProfileModal 
                    isOpen={editProfileModalIsOpen} 
                    onClose={editProfileModalOnClose} 
                    triggerToast={triggerToast} 
                    userData={userData!} 
                    updateUserData={updateUserData}
                    connections={userConnections}/>}
        </>
    )
}