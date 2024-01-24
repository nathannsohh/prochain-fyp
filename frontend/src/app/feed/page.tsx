'use client'
import NewPostCard from "@/components/feed/NewPostCard";
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserFactoryContract";
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import axios from 'axios'
import { API_URL, THE_GRAPH_URL } from "@/util/constants";
import { updateSelf } from "../profile/profileSlice";
import { useDisclosure, useToast, Divider } from '@chakra-ui/react'
import ProfileNewPostModal from "@/components/profile/ProfileNewPostModal";
import Post from "@/components/feed/Post";
import { getDetailsFromUserAddress } from "@/util/user_util";

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
    const [shownPosts, setShownPosts] = useState<Array<FeedPostType>>([])

    useEffect(() => {
        if (status === "idle") {
            if (wallet === null) {
                router.push('/login')
                return
            }
            
            userFactoryContract!.doesUserExist(wallet).then((result) => {
                if (!result) {
                    router.push('/profile/new')
                } else {
                    if (ownProfile.first_name === null) getUserDetails()
                    getPosts(wallet!, 0)
                }
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

    const getArrayOfPostContentHashes = (postData: any): Array<string>  => {
        let postHashArray = []
        for (const post of postData) {
            postHashArray.push(`"${post.postContentHash}"`)
        }
        return postHashArray
    }

    const getArrayOfPostOwner = (postData: any): Array<string> => {
        let postOwnerSet = new Set<string>()
        for (const post of postData) {
            postOwnerSet.add(`"${post.owner}"`)
        }
        return Array.from(postOwnerSet)
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

    const getPosts = async (user_wallet: String, page: number) => {
        const graphqlQuery = {
            "operationName": "getPosts",
            "query": `query getPosts {
                         posts (
                            where: { postContentHash_not: ""}, 
                            orderBy: postId,
                            orderDirection: desc,
                            first: 15,
                            skip: ${15 * page}
                        ) { owner postContentHash postImageHash id likedBy comments { owner commentContentHash } } }`,
            "variables": {}
        }
        try {
            const posts = await axios.post(`${THE_GRAPH_URL}/posts`, graphqlQuery)
            const allPosts = posts.data.data.posts
            const postHashes = getArrayOfPostContentHashes(allPosts)
            const postOwners = getArrayOfPostOwner(allPosts)
            const userDetails = await getDetailsFromUserAddress(postOwners)
            const postResult = await axios.get(`${API_URL}/post/[${postHashes}]`)
            const consolidatedPosts = allPosts.map((post: any, index: number) => {
                return {
                    ...post, 
                    content: postResult.data.posts[index].content, 
                    time_posted: postResult.data.posts[index].time_posted, 
                    name: userDetails?.get(post.owner)?.name, 
                    bio: userDetails?.get(post.owner)?.bio, 
                    profileImageHash: userDetails?.get(post.owner)?.profileImageHash,
                    hasLiked: post.likedBy.includes(wallet!)
                }
            })
            console.log(consolidatedPosts)
            setShownPosts(prevState => prevState.concat(consolidatedPosts))
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
            {shownPosts.map((post) => {
                return <Post key={post.id} data={post}/>
            })}
        </>
    )
}

export default Feed;