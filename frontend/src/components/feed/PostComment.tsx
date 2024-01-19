import { Avatar, Box, Text, Flex } from "@chakra-ui/react";

export default function PostComment() {
    return (
        <Flex pl={7} pr={7} mt={4} >
            <Avatar size='sm' mr={3} mt={3} />
            <Box bg="#F3F3F3" width="100%" p={3} borderRadius="15px">
                <Box fontSize={13} mb={2}>
                    <Text fontWeight={"semibold"} height={4}>Nathan Soh</Text>
                    <Text height={5} color="#7D7D7D">Final Year Student @ NTU CS</Text>
                </Box>
                <Text>Hello there!</Text>
            </Box>
        </Flex>
    )
}