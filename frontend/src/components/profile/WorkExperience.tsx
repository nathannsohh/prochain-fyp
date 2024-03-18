import { API_URL, DEFAULT_ORGANISATION_PROFILE_PIC_HASH } from "@/util/constants";
import { Avatar, Badge, Box, Divider, Flex, IconButton, Spacer, Text, VStack, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import WorkExperienceModal from "./WorkExperienceModal";
import useJobExperienceFactoryContract from "@/hooks/useJobExperienceFactoryContract";

interface WorkExperienceProps {
    experience: WorkExperience,
    ownProfile: Boolean,
    onExperienceUpdate: () => Promise<void>,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void
}

const badgeMap = {
    "0": "Unverified",
    "1": "Verified",
    "2": "Rejected"
}

export default function WorkExperience(props: WorkExperienceProps) {

    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [isUpdating, setIsUpdating] = useState<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure();

    const jobExperienceFactoryContract = useJobExperienceFactoryContract()

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
            await jobExperienceFactoryContract!.deleteExperience(Number(props.experience.id))
            const response = await axios.delete(`${API_URL}/experience/${props.experience.content_hash}`)
            if (response.data.success) {
                props.triggerToast("Success", "Experience deleted!", "success")
                await props.onExperienceUpdate()
            }
        } catch (e) {
            console.error(e)
            props.triggerToast("Error", "An error occured and the experience was not deleted. Please try again later.", "error")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Box width="100%" p={4}>
                <Flex width="100%">
                    <Avatar size='md' borderRadius={2} mr={4} src={`http://127.0.0.1:8080/ipfs/${props.experience.company_image_hash === null ? DEFAULT_ORGANISATION_PROFILE_PIC_HASH : props.experience.company_image_hash}`}/>
                    <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">{props.experience.title}</Text>
                        <Text fontSize="14px">{`${props.experience.company_name} · ${props.experience.type}`}</Text>
                        <Text fontSize="14px" color="#7D7D7D">{formatDateString(props.experience.start, props.experience.end)}</Text>
                        <Badge mt={1} colorScheme={props.experience.status === "0" || props.experience.status === "2" ? "red" : "green"}>{badgeMap[props.experience.status]}</Badge>
                        {props.experience.about !== "" && <Text fontSize="14px" mt={4} whiteSpace="pre-wrap">{props.experience.about}</Text>}
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
                <WorkExperienceModal 
                    isOpen={isOpen}
                    onClose={onClose}
                    triggerToast={props.triggerToast}
                    updateWorkExperience={props.onExperienceUpdate}
                    workExperienceData={props.experience}
                />}
        </>
    )
}