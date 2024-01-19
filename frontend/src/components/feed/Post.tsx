import { Card, CardBody, Avatar, HStack, VStack, Box, Text, Divider, Button, Spacer } from '@chakra-ui/react'
import { BiLike } from "react-icons/bi";
import { FaRegCommentAlt } from "react-icons/fa";
import { useRef, useEffect, useState } from 'react'
import usePostFactoryContract from '@/hooks/usePostFactoryContract';
import CommentInput from './CommentInput';
import axios from 'axios'
import { API_URL } from '@/util/constants';
import PostComment from './PostComment';

interface PostProps {
    data: FeedPostType
}

export default function Post(props: PostProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState<Boolean>(false);
    const [isSeeMore, setIsSeeMore] = useState<Boolean>(false)
    const postFactoryContract = usePostFactoryContract()

    const [postLikes, setPostLikes] = useState<number>(props.data.likedBy.length)
    const [liked, setLiked] = useState<Boolean>(props.data.hasLiked)

    const [showComments, setShowComments] = useState<Boolean>(false);

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
        setShowComments(true);
    }

    const handleComment = async (comment: string) => {
        let commentResponse
        try {
            commentResponse = await axios.post(API_URL + '/comment', {
                content: comment
            })
            
            await postFactoryContract?.comment(Number(props.data.id), commentResponse.data.hash)
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
    
    return (
        <Card width="100%" mt={2} borderRadius="20px" pt={0} pb={4}>
            <CardBody pl={0} pr={0} pb={1}>
                <Box pl={7} pr={7} mb={3}>
                    <HStack>
                        <Avatar mr={2} height="55px" width="55px" src={`http://127.0.0.1:8080/ipfs/${props.data.profileImageHash}`}/>
                        <VStack alignItems="start" spacing={0}>
                            <Text fontWeight="semibold" fontSize={14} height={5}>{props.data.name}</Text>
                            <Text fontSize={13} color="#7D7D7D" height={5}>{props.data.bio}</Text>
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
                    <Button leftIcon={<FaRegCommentAlt size={20} />} variant='ghost' onClick={toggleComment}>{props.data.comments.length}</Button>
                    <Spacer />
                </HStack>
                {
                    showComments &&
                    <>
                        <CommentInput profileImageHash={props.data.profileImageHash} onComment={handleComment}/>
                        {props.data.comments.map((comment) => {
                            return <PostComment />
                        })}
                    </>
                }
            </CardBody>
        </Card>
    )
}