'use client'
import NewPostCard from "@/components/feed/NewPostCard";
import { useMetamask } from "@/hooks/useMetamask";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import axios from 'axios'
import { API_URL, THE_GRAPH_URL } from "@/util/constants";
import { useDisclosure, useToast, Divider } from '@chakra-ui/react'
import ProfileNewPostModal from "@/components/profile/ProfileNewPostModal";
import Post from "@/components/feed/Post";
import { getDetailsFromUserAddress } from "@/util/user_util";

const Feed = () => {
    const { state: { wallet, status } } = useMetamask();

    const profileType: Number = useAppSelector((state) => state.profileType)
 
    const ownProfile: ProfileState = useAppSelector((state) => state.ownProfile)
    const ownOrgProfile: OrganisationProfileState = useAppSelector((state) => state.orgProfile)

    const {posts, connections, ...profile}: ProfileState = ownProfile

    const [loadedPage, setLoadedPage] = useState<number | null>(null)

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
            profile_banner_hash: profile.profile_banner_hash!,
            about: profile.about
    } : null)
    const [shownPosts, setShownPosts] = useState<Array<FeedPostType>>([])

    useEffect(() => {
        if (status === "idle" && wallet != null) {
            getPosts(wallet!, 0)
        }
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
            profile_banner_hash: profile.profile_banner_hash!,
            about: profile.about
        })
    }, [wallet, status, ownProfile])

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

    const getPosts = async (user_wallet: String, page: number) => {
        if (loadedPage === page) return;
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
            let postMap = new Map<String, any>()
            for (const post of postResult.data.posts) {
                postMap.set(post.content_hash, post)
            }

            const consolidatedPosts = allPosts.map((post: any) => {
                return {
                    ...post, 
                    content: postMap.get(post.postContentHash).content, 
                    time_posted: postMap.get(post.postContentHash).time_posted, 
                    name: userDetails?.get(post.owner)?.name, 
                    bio: userDetails?.get(post.owner)?.bio, 
                    profileImageHash: userDetails?.get(post.owner)?.profileImageHash,
                    hasLiked: post.likedBy.includes(wallet!)
                }
            })
            setLoadedPage(page)
            setShownPosts(consolidatedPosts)
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <>
            <NewPostCard 
                name={profileType == 1 ? ownOrgProfile!.company_name! : ownProfile!.first_name! + ' ' + ownProfile!.last_name!}  
                bio={profileType == 1 ? ownOrgProfile!.industry! : ownProfile!.bio!}
                profilePictureHash={profileType == 1 ? ownOrgProfile!.profile_picture_hash! : ownProfile!.profile_picture_hash!}
                onNewPost={newPostModalOnOpen} />
            {newPostModalIsOpen && 
                <ProfileNewPostModal 
                isOpen={newPostModalIsOpen} 
                onClose={newPostModalOnClose} 
                profileName={profileType == 1 ? ownOrgProfile!.company_name! : ownProfile!.first_name! + ' ' + ownProfile!.last_name!} 
                profilePictureHash={profileType == 1 ? ownOrgProfile!.profile_picture_hash! : ownProfile!.profile_picture_hash!}
                triggerToast={triggerToast}
                loadUserPosts={() => {}}/>}
                <Divider mt={3} borderColor="#C8C8C8"/>
            {shownPosts.map((post) => {
                return <Post key={post.id} data={post} ownProfileImageHash={profileType == 1 ? ownOrgProfile!.profile_picture_hash! : ownProfile!.profile_picture_hash!}/>
            })}
        </>
    )
}

export default Feed;