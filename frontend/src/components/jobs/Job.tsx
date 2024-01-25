import { Avatar, Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface JobProps {
    selected: boolean,
    index: number,
    handleJobClick: (index: number) => void
}


export default function Job(props: JobProps) {
    const [isHovering, setIsHovering] = useState<boolean>(false)

    const onMouseEnterHandler = () => {
        setIsHovering(true)
    }

    const onMouseLeaveHandler = () => {
        setIsHovering(false)
    }

    return (
        <>
            <Box width="100%" p={4} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler} _hover={{cursor: "pointer"}} bg={props.selected ? "#EDF3F8" : "#FFFFFF"} onClick={() => props.handleJobClick(props.index)}>
                <Flex width="100%">
                    <Avatar size='md' borderRadius={2} mr={4}/>
                    <VStack align="start" spacing={0}>
                        <Text color={"#0074B5"} fontWeight="semibold" as={isHovering ? "u" : undefined}>Frontend Engineer, Global CRM Engineering - 2024 Start</Text>
                        <Text fontSize="14px" as={isHovering ? "u" : undefined}>TikTok</Text>
                        <Text fontSize="14px" as={isHovering ? "u" : undefined} color="#7D7D7D">Singapore</Text>
                    </VStack>
                </Flex>
            </Box>
            <Divider />
        </>
    )
}