import { Avatar, Badge, Box, Divider, Flex, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface JobProps {
    selected: boolean,
    index: number,
    handleJobClick: (index: number) => void,
    job: any,
    isOwnJob: boolean
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
                    <Avatar size='md' borderRadius={2} mr={4} src={`http://127.0.0.1:8080/ipfs/${props.job.profileImageHash}`}/>
                    <VStack align="start" spacing={0}>
                        <Text color={"#0074B5"} fontWeight="semibold" as={isHovering ? "u" : undefined}>{props.job.job_title} {props.isOwnJob && <Badge colorScheme={props.job.status == 0 ? "green" : "red"}>{props.job.status == 0 ? "Open" : "Closed"}</Badge>}</Text>
                        <Text fontSize="14px" as={isHovering ? "u" : undefined}>{props.job.company_name}</Text>
                        <Text fontSize="14px" as={isHovering ? "u" : undefined} color="#7D7D7D">{props.job.location}</Text>
                    </VStack>
                </Flex>
            </Box>
            <Divider />
        </>
    )
}