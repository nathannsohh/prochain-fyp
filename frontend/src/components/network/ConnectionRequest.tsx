import { Box, Avatar, HStack, VStack, Text, Divider, Spacer, Button } from "@chakra-ui/react";

export default function ConnectionRequest() {
    return (
        <Box>
            <HStack p={7} pt={3} pb={3}>
                <Avatar mr={2}/>
                <VStack alignItems="start" spacing={0}>
                    <Text fontWeight="semibold" fontSize={14} height={5}>Ryan Sim</Text>
                    <Text fontSize={13} color="#7D7D7D" height={5}>Final year student @ NTU EEE</Text>
                </VStack>
                <Spacer />
                <Button variant="ghost" borderRadius="20px">Ignore</Button>
                <Button colorScheme="blue" borderRadius="20px">Accept</Button>
            </HStack>
            <Divider/>
        </Box>
    )
}