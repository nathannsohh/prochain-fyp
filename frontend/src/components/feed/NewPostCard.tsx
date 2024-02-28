import { Card, CardBody, HStack, Avatar, VStack, Text, Box } from '@chakra-ui/react'

interface NewPostCardProps {
    onNewPost: () => void,
    name: string,
    bio: string,
    profilePictureHash: string
}

export default function NewPostCard(props: NewPostCardProps) {
    return (
        <Card width="100%" mt={2} borderRadius="20px" p={2} pt={0}>
            <CardBody>
                <HStack>
                    <Avatar mr={2} height="55px" width="55px" src={`http://127.0.0.1:8080/ipfs/${props.profilePictureHash}`}/>
                    <VStack alignItems="start" spacing={0}>
                        <Text fontWeight="semibold" fontSize={15}>{props.name}</Text>
                        <Text fontSize={15} color="#7D7D7D">{props.bio}</Text>
                    </VStack>
                </HStack>
                <Box width="100%" bg="#F3F3F3" mt={4} p={3} borderRadius="20px" borderWidth="1px" borderColor="#C5C1C1" cursor="pointer" _hover={{"bg": "#E9E9E9"}} onClick={props.onNewPost}>
                    <Text ml={4} color="#4F4F4F" fontWeight="semibold">Make a new post +</Text>
                </Box>
            </CardBody>
        </Card>
    )
}