import { Box, Divider, HStack, Text, Button } from "@chakra-ui/react";
import Image from "next/image";
import LikeIcon from "@/images/like-icon.png"
import CommentIcon from "@/images/comment-icon.png"

interface ProfilePostProps {
    post: PostType,
    profileName: string
}

const formatDateString = (dateString: string): string => {
    const dateObject: Date = new Date(dateString);

    const formattedDateString: string = dateObject.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    return formattedDateString
}

export default function ProfilePost(props: ProfilePostProps) {
    return (
        <Box fontSize="14px" mb={0} mt={2}>
            <Box pl={6} pr={6}>
                <Box cursor="pointer">
                    <HStack color="#616161" fontSize="15px" mb={1}>
                        <Text fontWeight="semibold" mr={1}>{props.profileName}</Text>
                        <Text>{formatDateString(props.post.time_posted)}</Text>
                    </HStack>
                    <HStack width="100%">
                    {props.post.postImageHash && 
                    <Box position="relative" width="65px" height="60px" mr={1}>
                        <Image src={`http://127.0.0.1:8080/ipfs/${props.post.postImageHash}`} alt="profile picture" layout="fill" objectFit="cover"/>
                    </Box>
                    }
                    <Box width="full">
                        <Text noOfLines={3}>{props.post.content}</Text>
                    </Box>
                    </HStack>
                </Box>
                <HStack spacing={0} mt={3} fontSize="12px" mb={3}>
                    <Button variant="link">
                        <Image src={LikeIcon} alt="like icon" width={20}/>
                        <Text ml={1} fontSize="12px">{props.post.likedBy.length}</Text>
                    </Button>
                    <Button variant="link" ml={3}>
                        <Image src={CommentIcon} alt="comment icon" width={20}/>
                        <Text ml={1} fontSize="12px">{props.post.comments.length}</Text>
                    </Button>
                </HStack>
            </Box>
            <Divider borderColor="#C8C8C8" width="100%" pb={0}/>
        </Box>
    )
}