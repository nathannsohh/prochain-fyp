import { Box, Button, Card, CardBody, CardHeader, Center, Divider, Heading, HStack, Spacer, Text } from "@chakra-ui/react";
import ProfilePost from "./ProfilePost";

interface ProfilePostCardProps {
    posts: PostType[] | null,
    ownProfile: Boolean,
    profileName: string,
    onNewPost: () => void
}

export default function ProfilePostCard(props: ProfilePostCardProps) {
    const hasPosts: Boolean = props.posts === null ? false : props.posts.length > 0 

    return ( 
        <Card pt={2} pb={0} borderRadius="20px" border="1px" borderColor="#C5C1C1" minHeight="215px" maxHeight="450px" mb={3} overflow="hidden" bg="#FCFCFC">
            <CardHeader pb={0} pl={6} pr={6}>
                <HStack>
                    <Heading fontSize="23px" fontWeight="600">Posts</Heading>
                    <Spacer />
                    <Button colorScheme="blue" onClick={props.onNewPost}>+ New Post</Button>
                </HStack>
            </CardHeader>
            <CardBody p={0}>
                {!hasPosts && 
                <Box pl={6} pr={6} mt={9}>
                    <Text fontSize="17px" fontWeight="semibold">You haven't made a post yet 😔</Text>
                    <Text fontSize="15px">Posts you create will be shown here!</Text>
                </Box>
                }
                {hasPosts && 
                <>
                    {props.posts?.map((post) => {
                        return <ProfilePost key={post.postContentHash} post={post} profileName={props.profileName}/>
                    })}
                </>
            }
            {hasPosts && 
                <Center height="45px" width="100%" as="button" _hover={{bg: "#FAFAFA"}}>
                    <Text color="#4F4F4F" fontWeight="semibold">Show all posts ➞</Text>
                </Center>
            }
            </CardBody>
        </Card>
    )
}