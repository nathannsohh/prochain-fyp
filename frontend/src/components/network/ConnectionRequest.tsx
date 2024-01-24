import { Box, Avatar, HStack, VStack, Text, Divider, Spacer, Button } from "@chakra-ui/react";
import { useState } from "react";

interface ConnectionRequestProps {
    user: UserDetails,
    acceptRequest: (address: string) => Promise<void>,
    ignoreRequest: (address: string) => Promise<void>
}

export default function ConnectionRequest(props: ConnectionRequestProps) {
    const [acceptLoading, setAcceptLoading] = useState<boolean>(false)
    const [ignoreLoading, setIgnoreLoading] = useState<boolean>(false)

    const acceptRequest = async () => {
        try {
            setAcceptLoading(true)
            await props.acceptRequest(props.user.address)
        } catch (e) {
            console.error(e)
        } finally {
            setAcceptLoading(false)
        }
    }

    const ignoreRequest = async () => {
        try {
            setIgnoreLoading(true)
            await props.ignoreRequest(props.user.address)
        } catch (e) {
            console.error(e)
        } finally {
            setIgnoreLoading(false)
        }
    }

    return (
        <Box>
            <HStack p={7} pt={3} pb={3}>
                <Avatar mr={2} src={`http://127.0.0.1:8080/ipfs/${props.user.profileImageHash}`}/>
                <VStack alignItems="start" spacing={0}>
                    <Text fontWeight="semibold" fontSize={14} height={5}>{props.user.name}</Text>
                    <Text fontSize={13} color="#7D7D7D" height={5}>{props.user.bio}</Text>
                </VStack>
                <Spacer />
                <Button variant="ghost" borderRadius="20px" onClick={ignoreRequest} isLoading={ignoreLoading}>Ignore</Button>
                <Button colorScheme="blue" borderRadius="20px" onClick={acceptRequest} isLoading={acceptLoading}>Accept</Button>
            </HStack>
            <Divider/>
        </Box>
    )
}