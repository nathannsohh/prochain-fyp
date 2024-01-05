import usePostFactoryContract from "@/hooks/usePostFactoryContract";
import { Box, Button, Card, CardBody, CardHeader, Center, Divider, Heading, HStack, Spacer, Text } from "@chakra-ui/react";
import ProfilePost from "./ProfilePost";

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
    const hasPosts: Boolean = props.posts.length <= 0 

    return ( 
        <Card pt={2} pb={0} borderRadius="20px" minHeight="230px" maxHeight="450px" mb={3}>
            <CardHeader pb={0} pl={6} pr={6}>
                <HStack>
                    <Heading fontSize="23px" fontWeight="600">Posts</Heading>
                    <Spacer />
                    <Button colorScheme="blue" onClick={props.onNewPost}>+ New Post</Button>
                </HStack>
            </CardHeader>
            <CardBody p={0}>
                {!hasPosts && 
                <Box pl={6} pr={6} mt={8}>
                    <Text fontSize="17px" fontWeight="semibold">You haven't made a post yet 😔</Text>
                    <Text fontSize="15px">Posts you create will be shown here!</Text>
                </Box>
                }
                {hasPosts && 
                <>
                    <ProfilePost />
                    <ProfilePost />
                </>
            }
            {hasPosts && 
                <Center height="45px" width="100%" as="button">
                    <Text color="#4F4F4F" fontWeight="semibold">Show all posts ➞</Text>
                </Center>
            }
            </CardBody>
        </Card>
    )
}