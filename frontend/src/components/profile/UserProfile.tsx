import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import EditProfileModal from "./EditProfileModal";
import ProfileHead from "./ProfileHead";
import ProfileNewPostModal from "./ProfileNewPostModal";
import ProfilePostCard from "./ProfilePostCard";
import { useEffect, useState } from "react";
import useUserFactoryContract from "@/hooks/useUserFactoryContract";
import { Contract, ethers } from "ethers";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { getArrayOfJobExperience, getArrayOfJobOwners, getArrayOfPostContentHashes } from "@/util/util";
import axios from "axios";
import { API_URL, THE_GRAPH_URL } from "@/util/constants";
import { useMetamask } from "@/hooks/useMetamask";
import { updateSelf } from "@/redux_slices/profileSlice";
import AboutCard from "./AboutCard";
import EducationCard from "./EducationCard";
import EducationModal from "./EducationModal";
import EditAboutModal from "./EditAboutModal";
import WorkExperienceCard from "./WorkExperienceCard";
import WorkExperienceModal from "./WorkExperienceModal";
import { getDetailsFromOrgAddress } from "@/util/user_util";

interface UserProfileProps {
    wallet_address: string
}

export default function UserProfile(props: UserProfileProps) {
    const { state: { wallet, status } } = useMetamask();
    const ownProfile: ProfileState = useAppSelector((state) => state.ownProfile)
    const {posts, connections, ...profile}: ProfileState = ownProfile
    const isOwnProfile: Boolean = profile.wallet_address !== null && profile.wallet_address === props.wallet_address
    const profileType: Number = useAppSelector((state) => state.profileType)
    
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
        profile_banner_hash: profile.profile_banner_hash!,
        about: profile.about
    } : null)
    const [userPosts, setUserPosts] = useState<Array<PostType> | null>(isOwnProfile ? posts : null)
    const [userConnections, setUserConnections] = useState<Number | null>(isOwnProfile ? connections : null)
    const [userEducation, setUserEducation] = useState<any[]>([])
    const [userExperience, setUserExperience] = useState<WorkExperience[]>([])
    const [isConnection, setIsConnection] = useState<Boolean | null>(null)
    const userFactoryContract: Contract | null = useUserFactoryContract();
    const toast = useToast()


    const dispatch = useAppDispatch()

    const { isOpen: newPostModalIsOpen, onOpen: newPostModalOnOpen, onClose: newPostModalOnClose } = useDisclosure();
    const { isOpen: editProfileModalIsOpen, onOpen: editProfileModalOnOpen, onClose: editProfileModalOnClose } = useDisclosure();
    const { isOpen: newEducationModalIsOpen, onOpen: newEducationModalOnOpen, onClose: newEducationModalOnClose } = useDisclosure();
    const { isOpen: editAboutModalIsOpen, onOpen: editAboutModalOnOpen, onClose: editAboutModalOnClose } = useDisclosure();
    const { isOpen: newWorkExperienceModalIsOpen, onOpen: newWorkExperienceModalOnOpen, onClose: newWorkExperienceModalOnClose } = useDisclosure();


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
        } catch (e) {
            console.error(e)
        }
    }

    const getJobExperienceData = async () => {
        const graphqlQuery = {
            "operationName": "getJobExperiences",
            "query": `query getJobExperiences {
                         jobExperiences (
                            where: { owner: "${props.wallet_address}" }, 
                        ) { id, orgAddress, status, jobExpHash } }`,
            "variables": {}
        }
        try {
            const jobExp = await axios.post(`${THE_GRAPH_URL}/jobExp`, graphqlQuery)
            const expHashes = getArrayOfJobExperience(jobExp.data.data.jobExperiences)
            let orgHashes = []
            for (const exp of jobExp.data.data.jobExperiences) {
                if (exp.orgAddress !== ethers.ZeroAddress) orgHashes.push(`"${exp.orgAddress}"`)
            }
            const jobExpResult = await axios.get(`${API_URL}/experience/[${expHashes}]`)
            let jobExpDetails: Map<string, any> = new Map<string, any>()
            for (const exp of jobExpResult.data.experiences) {
                jobExpDetails.set(exp.content_hash, exp)
            }
            const orgDetails = await getDetailsFromOrgAddress(orgHashes)

            const consolidatedJobExp: WorkExperience[] = jobExp.data.data.jobExperiences.map((exp: any) => {
                return {
                    id: exp.id,
                    company_address: exp.orgAddress,
                    company_name: jobExpDetails.get(exp.jobExpHash).company_name,
                    start: jobExpDetails.get(exp.jobExpHash).start,
                    end: jobExpDetails.get(exp.jobExpHash).end,
                    title: jobExpDetails.get(exp.jobExpHash).title,
                    about: jobExpDetails.get(exp.jobExpHash).about,
                    type: jobExpDetails.get(exp.jobExpHash).type,
                    company_image_hash: exp.orgAddress === ethers.ZeroAddress ? null : orgDetails!.get(exp.orgAddress)?.profileImageHash,
                    status: exp.status,
                    content_hash: exp.jobExpHash
                }
            })

            consolidatedJobExp.sort((a: any, b: any) => {
                const dateA = new Date(a.start) as any;
                const dateB = new Date(b.start) as any;
            
                return dateB - dateA;
            });

            setUserExperience(consolidatedJobExp)
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
                    profile_banner_hash: userProfile.profileHeaderHash,
                    about: user.about
                }
                if (!isOwnProfile && profileType == 0) {
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

    const getEducationOfUser = async () => {
        try {
            let response = await axios.get(`${API_URL}/education/${props.wallet_address}`)
            response.data.education.sort((a: any, b: any) => {
                const dateA = new Date(a.start) as any;
                const dateB = new Date(b.start) as any;
            
                return dateB - dateA;
            });
            setUserEducation(response.data.education)
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
            getEducationOfUser()
            getJobExperienceData()
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
                    profile_banner_hash: profile.profile_banner_hash!,
                    about: profile.about
                })
                getNumberOfConnections()
            } else {
                getUserDetails();
            }
        }
    }, [wallet, status, ownProfile])

    return (
        <>
            <ProfileHead userData={userData} onEditProfile={editProfileModalOnOpen} connections={userConnections} ownProfile={isOwnProfile} isConnected={isConnection} onConnect={connectHandler}/>
            <AboutCard ownProfile={isOwnProfile} about={userData?.about!} onEdit={editAboutModalOnOpen}/>
            <ProfilePostCard posts={userPosts} profileName={userData?.first_name + ' ' + userData?.last_name} ownProfile={isOwnProfile} onNewPost={newPostModalOnOpen}/>
            <EducationCard ownProfile={isOwnProfile} onNewEducation={newEducationModalOnOpen} educationData={userEducation} triggerToast={triggerToast} onEducationUpdate={getEducationOfUser}/>
            <WorkExperienceCard ownProfile={isOwnProfile} onNewExperience={newWorkExperienceModalOnOpen} experienceData={userExperience} triggerToast={triggerToast} onExperienceUpdate={getJobExperienceData}/>
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
            {newEducationModalIsOpen && 
                <EducationModal 
                    isOpen={newEducationModalIsOpen}
                    onClose={newEducationModalOnClose}
                    triggerToast={triggerToast}
                    userAddress={userData?.wallet_address!}
                    updateUserEducation={getEducationOfUser}
                    educationData={null}
                />}
            {editAboutModalIsOpen && 
                <EditAboutModal
                    isOpen={editAboutModalIsOpen}
                    onClose={editAboutModalOnClose}
                    triggerToast={triggerToast}
                    userAddress={props.wallet_address}
                    updateAbout={getUserDetails} 
                    about={userData?.about!}
                    profileType={0}
                />
            }
            {newWorkExperienceModalIsOpen &&
                <WorkExperienceModal
                    isOpen={newWorkExperienceModalIsOpen}
                    onClose={newWorkExperienceModalOnClose}
                    triggerToast={triggerToast}
                    updateWorkExperience={getJobExperienceData}
                    workExperienceData={null}
                />
            }
        </>
    )
}