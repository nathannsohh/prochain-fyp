import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useMetamask } from "@/hooks/useMetamask";
import useUserFactoryContract from "@/hooks/useUserFactoryContract";
import { updateSelf } from "@/redux_slices/organisationProfileSlice";
import { API_URL, THE_GRAPH_URL } from "@/util/constants";
import { getArrayOfPostContentHashes } from "@/util/util";
import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import OrganisationProfileHead from "./OrganisationProfileHead";
import ProfilePostCard from "./ProfilePostCard";
import ProfileNewPostModal from "./ProfileNewPostModal";
import EditOrgProfileModal from "./EditOrgProfileModal";

interface OrganisationProfileProps {
    wallet_address: string
}

export default function OrganisationProfile(props: OrganisationProfileProps) {
    const { state: { wallet, status } } = useMetamask();
    const ownProfile: OrganisationProfileState = useAppSelector((state) => state.orgProfile)
    const {posts, followers, ...profile}: OrganisationProfileState = ownProfile
    const isOwnProfile: Boolean = profile.wallet_address !== null && profile.wallet_address === props.wallet_address
    
    const [orgData, setOrgData] = useState<OrganisationType | null>(isOwnProfile ? {
        company_name: profile.company_name!,
        industry: profile.industry!,
        email: profile.email!,
        wallet_address: profile.wallet_address!,
        bio: profile.bio,
        location: profile.location,
        content_hash: profile.content_hash!,
        profile_picture_hash: profile.profile_picture_hash!,
        profile_banner_hash: profile.profile_banner_hash!
    } : null)
    const [orgPosts, setOrgPosts] = useState<Array<PostType> | null>(isOwnProfile ? posts : null)
    const [orgFollowers, setOrgFollowers] = useState<Number | null>(isOwnProfile ? followers : null)
    const [isFollower, setIsFollower] = useState<Boolean | null>(null)
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
            setOrgPosts(consolidatedPosts)
            // dispatch(updatePosts(consolidatedPosts))
        } catch (e) {
            console.error(e)
        }
    }

    const getOrgDetails = async () => {
        try {
            const [orgProfile, numOfFollowers] = await Promise.all([
                userFactoryContract!.getOrganisationProfile(props.wallet_address), 
                userFactoryContract!.getNumberOfFollowers(props.wallet_address)
            ])
            const orgResult = await axios.get(`${API_URL}/organisation/${orgProfile.profileDataHash}`)
            if (orgResult.data.success) {
                const organisation: OrganisationType = orgResult.data.organisation
                const orgDetails = {
                    company_name: organisation.company_name,
                    industry: organisation.industry,
                    email: organisation.email,
                    wallet_address: organisation.wallet_address,
                    bio: organisation.bio,
                    location: organisation.location,
                    content_hash: organisation.content_hash,
                    profile_picture_hash: orgProfile.profileImageHash,
                    profile_banner_hash: orgProfile.profileHeaderHash
                }
                if (!isOwnProfile) {
                    const isConnection = await userFactoryContract?.isFollower(profile.wallet_address!, props.wallet_address)
                    setIsFollower(isConnection)
                }
                setOrgData(orgDetails)
                setOrgFollowers(numOfFollowers)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const getNumberOfFollowers = async () => {
        try {
            while (userFactoryContract === null);
            const numOfConnections = await userFactoryContract!.getNumberOfFollowers(wallet)
            setOrgFollowers(numOfConnections)
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

    const followHandler = async () => {
        try {
            await userFactoryContract?.followOrganisation(props.wallet_address, wallet)
            triggerToast("Organisation Followed!", "You are now following this organisation.", "success")
        } catch (e) {
            console.error(e)
            triggerToast("Error", "Something went wrong.", "error")
        }
    }

    const unfollowHandler = async () => {
        try {
            await userFactoryContract?.unfollowOrganisation(props.wallet_address, wallet)
            triggerToast("Organisation Unfollowed!", "You are no longer following this organisation", "success")
        } catch (e) {
            console.error(e)
            triggerToast("Error", "Something went wrong.", "error")
        }
    }

    const updateOrgData = (orgData: OrganisationType) => {
        dispatch(updateSelf({...orgData, followers: followers!}))
        setOrgData(orgData)
    }

    useEffect(() => {
        if (status === "idle" && wallet !== null) {
            getPostData()
            if (isOwnProfile) {
                setOrgData({
                    company_name: profile.company_name!,
                    industry: profile.industry!,
                    email: profile.email!,
                    wallet_address: profile.wallet_address!,
                    bio: profile.bio,
                    location: profile.location,
                    content_hash: profile.content_hash!,
                    profile_picture_hash: profile.profile_picture_hash!,
                    profile_banner_hash: profile.profile_banner_hash!
                })
                getNumberOfFollowers()
            } else {
                getOrgDetails();
            }
        }
    }, [wallet, status])
    return (
        <>
            <OrganisationProfileHead orgData={orgData} onEditProfile={editProfileModalOnOpen} followers={orgFollowers} ownProfile={isOwnProfile} isFollowed={isFollower} onFollow={followHandler} onUnfollow={unfollowHandler}/>
            <ProfilePostCard posts={orgPosts} profileName={orgData?.company_name!} ownProfile={isOwnProfile} onNewPost={newPostModalOnOpen}/>
            {newPostModalIsOpen && 
                <ProfileNewPostModal 
                    isOpen={newPostModalIsOpen} 
                    onClose={newPostModalOnClose} 
                    profileName={orgData?.company_name!} 
                    profilePictureHash={orgData?.profile_picture_hash!}
                    triggerToast={triggerToast}
                    loadUserPosts={getPostData}/>}
            {editProfileModalIsOpen && 
                <EditOrgProfileModal 
                    isOpen={editProfileModalIsOpen} 
                    onClose={editProfileModalOnClose} 
                    triggerToast={triggerToast} 
                    orgData={orgData!} 
                    updateOrgData={updateOrgData}
                    followers={orgFollowers}/>}
        </>
    )
}