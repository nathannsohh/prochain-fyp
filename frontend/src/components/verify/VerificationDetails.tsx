import { Avatar, Box, Button, Flex, HStack, Heading, Spacer, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

import useJobExperienceFactoryContract from "@/hooks/useJobExperienceFactoryContract";

interface VerificationDetailsProps {
    verification: Verification,
    onRejectOrUpdate: () => void
}

export default function VerificationDetails(props: VerificationDetailsProps) {

    const [verifyLoading, setVerifyLoading] = useState<boolean>()
    const [rejectLoading, setRejectLoading] = useState<boolean>()
    const toast = useToast()
    const jobExperienceFactoryContract = useJobExperienceFactoryContract()

    const triggerToast = (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => {
        toast({
            title: title,
            description: description,
            status: status,
            duration: 4000,
            variant: 'subtle',
            position: 'bottom-left'
        })
    }

    const handleVerify = async () => {
        try {
            setVerifyLoading(true)
            await jobExperienceFactoryContract?.verifyExperience(Number(props.verification.id))
            await props.onRejectOrUpdate()
            triggerToast("Success", "Job Experience successfully verified!", "success")
        } catch (e) {
            console.error(e)
            triggerToast("Error", "An error occured. Please try again later.", "error")
        } finally {
            setVerifyLoading(false)
        }
    }

    const handleReject = async () => {
        try {
            setRejectLoading(true)
            await jobExperienceFactoryContract?.rejectExperience(Number(props.verification.id))
            await props.onRejectOrUpdate()
            triggerToast("Success", "Job Experience successfully rejected!", "success")
        } catch (e) {
            console.error(e)
            triggerToast("Error", "An error occured. Please try again later.", "error")
        } finally {
            setRejectLoading(false)
        }
    }

    const formatDateString = (startString: string, endString: string | null): string => {
        const start = convertDateString(startString)
        let end;
        if (endString === null) {
            end = "present"
        } else {
            end = convertDateString(endString)
        }

        return `${start} - ${end}`
    }

    function convertDateString(inputDateString: string) {
        const [year, month] = inputDateString.split('-');
        
        // Create a Date object with the provided year and month
        const dateObject = new Date(`${year}-${month}-01`);
    
        // Format the date using the toLocaleString method
        const formattedDate = dateObject.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    
        return formattedDate;
    }

    return (
        <Box height="84vh" overflowY="scroll" p={5}>
            <Flex mb={5}>
                <Avatar size='lg' borderRadius={2} mr={4} src={`http://127.0.0.1:8080/ipfs/${props.verification.user_image_hash}`}/>
                <Box ml={2}>
                    <Heading fontSize="23px" mb={1}>{props.verification.user_name}</Heading>
                    <Text fontSize={14}>{props.verification.user_address}</Text>
                </Box>
            </Flex>
            <Heading fontSize="23px">{props.verification.title}</Heading>
            <Text fontSize={14} mb={3}>{`${formatDateString(props.verification.start, props.verification.end)}`}</Text>
            <Heading fontSize="21px">Description</Heading>
            <Text whiteSpace="pre-wrap">{props.verification.about}</Text>
            <HStack width="100%" mt={7}>
                <Spacer />
                <Button mr={4} colorScheme="green" onClick={handleVerify} isLoading={verifyLoading}>Verify</Button>
                <Button ml={4} colorScheme="red" onClick={handleReject} isLoading={rejectLoading}>Reject</Button>
                <Spacer />
            </HStack>
        </Box>
    )
}