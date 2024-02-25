import { Card, CardBody, Avatar, HStack, VStack, Box, Text, Divider, Button, Spacer, Center } from '@chakra-ui/react'
import { BiLike } from "react-icons/bi";
import { FaRegCommentAlt } from "react-icons/fa";
import { useRef, useEffect, useState } from 'react'
import usePostFactoryContract from '@/hooks/usePostFactoryContract';
import CommentInput from './CommentInput';
import axios from 'axios'
import { API_URL } from '@/util/constants';
import PostComment from './PostComment';
import { getDetailsFromUserAddress } from '@/util/user_util';
import { useRouter } from "next/navigation";
import { useAppSelector } from '@/hooks/reduxHooks';

interface PostProps {
    data: FeedPostType,
    ownProfileImageHash: string
}

export default function Post(props: PostProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState<Boolean>(false);
    const [isSeeMore, setIsSeeMore] = useState<Boolean>(false)
    const postFactoryContract = usePostFactoryContract()

    const [postLikes, setPostLikes] = useState<number>(props.data.likedBy.length)
    const [liked, setLiked] = useState<Boolean>(props.data.hasLiked)

    const [showComments, setShowComments] = useState<Boolean>(false)
    const [loadedComments, setLoadedComments] = useState<Array<FeedCommentType>>([])
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [numberOfComments, setNumberOfComments] = useState<number>(props.data.comments.length)

    const [mouseHover, setMouseHover] = useState<Boolean>(false)

    const ownProfile: ProfileState = useAppSelector((state) => state.ownProfile)


    const router = useRouter()

    useEffect(() => {
        const container = containerRef.current;
    
        if (container) {
            const isOverflowing = container.scrollHeight > container.clientHeight;
            setIsTruncated(isOverflowing);
        }
    }, []);

    const seeMoreHandler = () => {
        setIsSeeMore(prevState => !prevState)
    }

    const getTimeDifference = (dateString: string): string => {
        const currentDate = new Date()
        const targetDate = new Date(dateString)

        const timeDifference = currentDate.getTime() - targetDate.getTime()
        const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (dayDifference === 0) {
            return "Today"
        } else if (dayDifference < 30) {
            return `${dayDifference}d ago`
        } else if (dayDifference < 365){
            const monthDifference = Math.floor(dayDifference / 30)
            return `${monthDifference}m ago`
        } else {
            const yearDifference = Math.floor(dayDifference / 365)
            return `${yearDifference}y ago`
        }
    }

    const handleLikePost = async () => {
        try {
            if (liked) {
                await postFactoryContract?.unlikePost(Number(props.data.id))
                setPostLikes(prevLikes => prevLikes - 1);
                setLiked(false)
            } else {
                await postFactoryContract?.likePost(Number(props.data.id))
                setPostLikes(prevLikes => prevLikes + 1);
                setLiked(true)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const toggleComment = () => {
        if (!showComments) {
            loadComments(0)
        }
        setShowComments(true);
    }

    const handleComment = async (comment: string) => {
        let commentResponse
        try {
            commentResponse = await axios.post(API_URL + '/comment', {
                content: comment
            })
            
            await postFactoryContract?.comment(Number(props.data.id), commentResponse.data.hash)
            const newComment: FeedCommentType = {
                name: ownProfile.first_name + ' ' + ownProfile.last_name,
                bio: ownProfile.bio!,
                time_posted: '',
                content: comment,
                profileImageHash: ownProfile.profile_picture_hash,
                id: '',
                commentContentHash: commentResponse.data.hash,
                owner: ownProfile.wallet_address!
            }
            setNumberOfComments(prevNumber => prevNumber + 1)
            setLoadedComments(prevComments => {
                prevComments.push(newComment)
                return prevComments
            })

        } catch (e) {
            if (commentResponse && commentResponse.data.success) {
                try {
                    await axios.delete(API_URL + `/comment/${commentResponse.data.hash}`)
                } catch (e) {
                    console.error(e)
                }
            }
            console.error(e)
        }
    }

    const loadComments = async (page: number) => {
        try {
            // Only going to load 3 comments at a time
            let comments;
            if ((page + 1) * 3 > props.data.comments.length) {
                comments = props.data.comments.slice(page*3, props.data.comments.length)
            } else {
                comments = props.data.comments.slice(page*3, page*3 + 3)
            }
            
            let owners = new Set<string>()
            let commentHashes = []
            for (const comment of comments) {
                owners.add(`"${comment.owner}"`)
                commentHashes.push(`"${comment.commentContentHash}"`)
            }
        
            const ownerMap = await getDetailsFromUserAddress(Array.from(owners))
            let commentContent = await axios.get(API_URL + `/comment/[${commentHashes}]`)
            let contentMap = new Map<string, any>()
            for (const content of commentContent.data.posts) {
                contentMap.set(content.content_hash, {
                    content: content.content,
                    edited: content.edited,
                    time_posted: content.time_posted
                })
            }
        
            const consolidatedComments = comments.map((comment) => {
                return {
                    ...comment,
                    ...contentMap.get(comment.commentContentHash),
                    name: ownerMap!.get(comment.owner)!.name,
                    bio: ownerMap!.get(comment.owner)!.bio,
                    profileImageHash: ownerMap!.get(comment.owner)!.profileImageHash
                }
            })
            setLoadedComments(prevComments => prevComments.concat(consolidatedComments))
            setCurrentPage(page)
        } catch (e) {
            console.error(e)
        }
    }

    const handleLoadMoreComments = async () => {
        await loadComments(currentPage + 1)
    }

    const mouseEnterHandler = () => {
        setMouseHover(true)
    }
    const mouseLeaveHandler = () => {
        setMouseHover(false)
    }

    const profileOnClickHandler = () => {
        router.push(`/profile/${props.data.owner}`)
    }
    
    return (
        <Card width="100%" mt={2} borderRadius="20px" pt={0} pb={1} mb={2}>
            <CardBody pl={0} pr={0} pb={1}>
                <Box pl={7} pr={7} mb={3}>
                    <HStack onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler} _hover={{cursor: "pointer"}} onClick={profileOnClickHandler}>
                        <Avatar mr={2} height="55px" width="55px" src={`http://127.0.0.1:8080/ipfs/${props.data.profileImageHash}`}/>
                        <VStack alignItems="start" spacing={0}>
                            <Text as={mouseHover ? 'u' : undefined} fontWeight="semibold" fontSize={14} height={5}>{props.data.name}</Text>
                            <Text as={mouseHover ? 'u' : undefined} fontSize={13} color="#7D7D7D" height={5}>{props.data.bio}</Text>
                            <Text fontSize={13} color="#7D7D7D" height={5}>{getTimeDifference(props.data.time_posted)}</Text>
                        </VStack>
                    </HStack>
                    <Text mt={3} noOfLines={isSeeMore ? undefined : 3} ref={containerRef}>
                        {props.data.content}
                    </Text>
                    {isTruncated && !isSeeMore && <Button variant="link" onClick={seeMoreHandler}>See more...</Button>}
                    {isTruncated && isSeeMore && <Button variant="link" onClick={seeMoreHandler}>See less...</Button>}
                </Box>
                <Divider width="100%"/>
                <HStack pl={7} pr={7} mt={3}>
                    <Button leftIcon={<BiLike size={20} />} variant="ghost" colorScheme={liked ? "blue" : undefined} onClick={handleLikePost}> {postLikes}</Button>
                    <Button leftIcon={<FaRegCommentAlt size={20} />} variant='ghost' onClick={toggleComment}>{numberOfComments}</Button>
                    <Spacer />
                </HStack>
                {
                    showComments &&
                    <>
                        <CommentInput profileImageHash={props.ownProfileImageHash} onComment={handleComment}/>
                        {loadedComments.map((comment) => {
                            return <PostComment data={comment} />
                        })}
                        {loadedComments.length < props.data.comments.length && 
                            <Center m={1} mt={3}>
                                <Button variant='link' onClick={handleLoadMoreComments}>Load more comments</Button>
                            </Center>
                        }
                    </>
                }
            </CardBody>
        </Card>
    )
}