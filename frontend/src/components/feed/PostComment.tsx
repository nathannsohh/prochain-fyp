import { Avatar, Box, Text, Flex, Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface PostCommentProps {
    data: FeedCommentType
}
export default function PostComment(props: PostCommentProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState<Boolean>(false);
    const [isSeeMore, setIsSeeMore] = useState<Boolean>(false)

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

    return (
        <Flex pl={7} pr={7} mt={4} >
            <Avatar size='sm' mr={3} mt={3} src={`http://127.0.0.1:8080/ipfs/${props.data.profileImageHash}`}/>
            <Box bg="#F3F3F3" width="100%" p={3} borderRadius="15px">
                <Box fontSize={13} mb={2}>
                    <Text fontWeight={"semibold"} height={4}>{props.data.name}</Text>
                    <Text height={5} color="#7D7D7D">{props.data.bio}</Text>
                </Box>
                <Text noOfLines={isSeeMore ? undefined: 4} ref={containerRef}>{props.data.content}</Text>
                {!isSeeMore && isTruncated && <Button variant='link' onClick={seeMoreHandler}>See more</Button>}
                {isSeeMore && isTruncated && <Button variant='link' onClick={seeMoreHandler}>See less</Button>}
            </Box>
        </Flex>
    )
}