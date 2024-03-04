import { Avatar, Badge, Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation"

interface ApplicantProps {
    user: UserDetails,
}


export default function Applicant(props: ApplicantProps) {
    const [isHovering, setIsHovering] = useState<boolean>(false)
    const router = useRouter()

    const onMouseEnterHandler = () => {
        setIsHovering(true)
    }

    const onMouseLeaveHandler = () => {
        setIsHovering(false)
    }

    const onClickHandler = () => {
        router.push(`/profile/${props.user.address}`)
    }

    return (
        <>
            <Box width="100%" p={3} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler} _hover={{cursor: "pointer"}} bg={"#FFFFFF"} onClick={onClickHandler}>
                <Flex width="100%">
                    <Avatar size='md' mr={4} src={`http://127.0.0.1:8080/ipfs/${props.user.profileImageHash}`}/>
                    <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold" as={isHovering ? "u" : undefined}>{props.user.name}</Text>
                        <Text fontSize="14px" as={isHovering ? "u" : undefined} color="#7D7D7D">{props.user.bio}</Text>
                    </VStack>
                </Flex>
            </Box>
            <Divider />
        </>
    )
}