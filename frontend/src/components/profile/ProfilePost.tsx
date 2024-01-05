import { Box, Divider, HStack, Text, Button } from "@chakra-ui/react";
import Image from "next/image";
import LikeIcon from "@/images/like-icon.png"
import CommentIcon from "@/images/comment-icon.png"

interface ProfilePostProps {
    post: PostType,
    profileName: string
}

export default function ProfilePost(props: ProfilePostProps) {
    return (
        <Box fontSize="14px" mb={0} mt={2}>
            <Box pl={6} pr={6}>
                <Box cursor="pointer">
                    <HStack color="#616161" fontSize="15px" mb={1}>
                        <Text fontWeight="semibold" mr={1}>{props.profileName}</Text>
                        <Text>5 Jan 2024</Text>
                    </HStack>
                    <Text noOfLines={3}>{props.post.content}</Text>
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