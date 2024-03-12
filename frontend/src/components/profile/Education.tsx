import { API_URL, DEFAULT_ORGANISATION_PROFILE_PIC_HASH } from "@/util/constants";
import { Avatar, Badge, Box, Divider, Flex, IconButton, Spacer, Text, VStack, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import EducationModal from "./EducationModal";

interface EducationProps {
    education: any,
    ownProfile: Boolean,
    onEducationUpdate: () => Promise<void>,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void
}

export default function Education(props: EducationProps) {

    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [isUpdating, setIsUpdating] = useState<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure();

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

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            const response = await axios.delete(`${API_URL}/education/${props.education.id}`)
            if (response.data.success) {
                props.triggerToast("Success", "Education deleted!", "success")
                await props.onEducationUpdate()
            }
        } catch (e) {
            console.error(e)
            props.triggerToast("Error", "An error occured and the education was not deleted. Please try again later.", "error")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Box width="100%" p={4}>
                <Flex width="100%">
                    <Avatar size='md' borderRadius={2} mr={4} src={`http://127.0.0.1:8080/ipfs/${DEFAULT_ORGANISATION_PROFILE_PIC_HASH}`}/>
                    <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{props.education.school_name}</Text>
                        <Text fontSize="14px">{`${props.education.type}`} {props.education.field !== "" && ` (${props.education.field})`}</Text>
                        <Text fontSize="14px" color="#7D7D7D">{formatDateString(props.education.start, props.education.end)}</Text>
                        <Badge mt={1} colorScheme={props.education.verifiable ? "green" : "red"}>{props.education.verifiable ? "Verifiable" : "Not Verifiable"}</Badge>
                        {props.education.about !== "" && <Text fontSize="14px" mt={4} whiteSpace="pre-wrap">{props.education.about}</Text>}
                    </VStack>
                    <Spacer />
                    {
                        props.ownProfile &&
                        <>
                            <IconButton variant="ghost" icon={<MdEdit />} aria-label="edit" onClick={onOpen}/>
                            <IconButton variant="ghost" icon={<FaTrash />} aria-label="delete" onClick={handleDelete} isLoading={isDeleting}/>    
                        </>
                    }
                </Flex>
            </Box>
            <Divider />
            {isOpen && 
                <EducationModal 
                    isOpen={isOpen}
                    onClose={onClose}
                    triggerToast={props.triggerToast}
                    userAddress={props.education.user_address}
                    updateUserEducation={props.onEducationUpdate}
                    educationData={props.education}
                />}
        </>
    )
}