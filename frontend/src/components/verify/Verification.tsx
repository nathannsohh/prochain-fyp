import { Avatar, Badge, Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface VerificationProps {
    selected: boolean,
    index: number,
    handleJobClick: (index: number) => void,
    verification: Verification,
    isOwnJob: boolean
}


export default function Verification(props: VerificationProps) {
    const [isHovering, setIsHovering] = useState<boolean>(false)

    const onMouseEnterHandler = () => {
        setIsHovering(true)
    }

    const onMouseLeaveHandler = () => {
        setIsHovering(false)
    }

    const formatAddress = (address: string): string => {
        return address.slice(0, -10) + '...';
    }

    return (
        <>
            <Box width="100%" p={4} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler} _hover={{cursor: "pointer"}} bg={props.selected ? "#EDF3F8" : "#FFFFFF"} onClick={() => props.handleJobClick(props.index)}>
                <Flex width="100%">
                    <Avatar size='md' borderRadius={2} mr={4} src={`http://127.0.0.1:8080/ipfs/${props.verification.user_image_hash}`}/>
                    <VStack align="start" spacing={0}>
                        <Text color={"#0074B5"} width="100%" noOfLines={1} fontWeight="semibold" as={isHovering ? "u" : undefined}>{props.verification.user_name}</Text>
                        <Text fontSize="14px" as={isHovering ? "u" : undefined} color="#7D7D7D">{formatAddress(props.verification.user_address)}</Text>
                    </VStack>
                </Flex>
            </Box>
            <Divider />
        </>
    )
}