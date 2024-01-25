import { Box, Avatar, HStack, VStack, Text, Divider, Spacer, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ConnectionRequestProps {
    user: UserDetails,
    acceptRequest: (address: string) => Promise<void>,
    ignoreRequest: (address: string) => Promise<void>
}

export default function ConnectionRequest(props: ConnectionRequestProps) {
    const [acceptLoading, setAcceptLoading] = useState<boolean>(false)
    const [ignoreLoading, setIgnoreLoading] = useState<boolean>(false)
    const [isHovering, setIsHovering] = useState<boolean>(false)

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

    const router = useRouter()

    const onMouseEnterHandler = () => {
        setIsHovering(true)
    }

    const onMouseLeaveHandler = () => {
        setIsHovering(false)
    }

    const nameOnClickHandler = () => {
        router.push(`/profile/${props.user.address}`)
    }

    return (
        <Box>
            <HStack p={7} pt={3} pb={3}>
                <HStack onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler} onClick={nameOnClickHandler} _hover={{cursor: "pointer"}}>
                    <Avatar mr={2} src={`http://127.0.0.1:8080/ipfs/${props.user.profileImageHash}`}/>
                    <VStack alignItems="start" spacing={0}>
                        <Text fontWeight="semibold" fontSize={14} height={5} as={isHovering ? "u" : undefined}>{props.user.name}</Text>
                        <Text fontSize={13} color="#7D7D7D" height={5} as={isHovering ? "u" : undefined}>{props.user.bio}</Text>
                    </VStack>
                </HStack>
                <Spacer />
                <Button variant="ghost" borderRadius="20px" onClick={ignoreRequest} isLoading={ignoreLoading}>Ignore</Button>
                <Button colorScheme="blue" borderRadius="20px" onClick={acceptRequest} isLoading={acceptLoading}>Accept</Button>
            </HStack>
            <Divider/>
        </Box>
    )
}