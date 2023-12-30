import usePostFactoryContract from "@/hooks/usePostFactoryContract";
import { Button, Card, CardBody, CardHeader, Center, Heading, HStack, Spacer, Text } from "@chakra-ui/react";
import { Contract } from "ethers";

interface ProfilePostCardProps {
    posts: Posts[],
    ownProfile: Boolean,
    onNewPost: () => void
}

type Posts = {
    id: Number,
    content: String
}

export default function ProfilePostCard(props: ProfilePostCardProps) {
    const hasPosts: Boolean = props.posts.length > 0

    return ( 
        <Card p={2} borderRadius="20px">
            <CardHeader>
                <HStack>
                    <Heading fontSize="23px" fontWeight="600">Posts</Heading>
                    <Spacer />
                    <Button colorScheme="blue" onClick={props.onNewPost}>+ New Post</Button>
                </HStack>
            </CardHeader>
            <CardBody>
                {!hasPosts && 
                <Center>
                    <Text>You do not have any posts!</Text>    
                </Center>}
                {hasPosts && <></>}
            </CardBody>
        </Card>
    )
}