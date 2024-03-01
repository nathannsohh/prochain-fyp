import { Badge, Box, Button, HStack, Heading, Icon, Text, useDisclosure } from "@chakra-ui/react";
import { FaSuitcase } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";
import { COLOR_MAP } from "@/util/constants";
import { GrStatusGood } from "react-icons/gr";
import { RxCrossCircled } from "react-icons/rx";
import useJobFactoryContract from "@/hooks/useJobFactoryContract";
import { useState } from "react";
import EditJobModal from "./EditJobModal";

interface EditableJobDescriptionProps {
    job: any,
    onStatusUpdate: () => void,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    updateJob: () => void
}

export default function EditableJobDescription(props: EditableJobDescriptionProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const jobFactoryContract = useJobFactoryContract()

    const handleJobStatusChange = async () => {
        try {
            setLoading(true)
            props.job.status == 0 ?
                await jobFactoryContract?.closeJobApplication(props.job.id) :
                await jobFactoryContract?.openJobApplication(props.job.id)
            props.onStatusUpdate()
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box height="84vh" overflowY="scroll" p={5}>
           <Heading fontSize="23px" mb={1}>{props.job.job_title}</Heading>
           <Box fontSize={14}>
                <Text>{props.job.company_name}</Text>
                <Text>{props.job.location}</Text>
           </Box>
           <HStack mt={3}>
            <Icon as={props.job.status == 0 ? GrStatusGood : RxCrossCircled} boxSize={6} color="#666666" mr={1}/>
            <Badge colorScheme={props.job.status == 0 ? "green" : "red"}>{props.job.status == 0 ? "Open" : "Closed"}</Badge>
           </HStack>
           <HStack mt={3}>
            <Icon as={FaSuitcase} boxSize={6} color="#666666" mr={1}/>
            <Badge colorScheme={COLOR_MAP.get(props.job.employment_type)}>{props.job.employment_type}</Badge>
           </HStack>
           <HStack mt={2}>
            <Icon as={FaBuilding} boxSize={6} color="#666666" mr={1}/>
            <Text fontSize={14} colorScheme="green">{props.job.industry}</Text>
           </HStack>
           <HStack mt={3}>
            <Icon as={SiLevelsdotfyi} boxSize={6} color="#666666" mr={1}/>
            <Text fontSize={14} colorScheme="green">{props.job.job_level}</Text>
           </HStack>

           <HStack>
            <Button onClick={handleJobStatusChange} isLoading={loading} colorScheme={props.job.status == 0 ? "red" : "green"} borderRadius={18} mt={6} leftIcon={props.job.status == 1 ? <GrStatusGood /> : <RxCrossCircled />}>{props.job.status == 0 ? "Close Listing" : "Open Listing"}</Button>
            <Button colorScheme="blue" borderRadius={18} mt={6} ml={2} onClick={onOpen}>Edit</Button>
           </HStack>

           <Box mt={7}>
            <Text fontSize={20} fontWeight="semibold">Job Description</Text>
            <Text fontSize={15} whiteSpace="pre-wrap">
                {props.job.job_description}
            </Text>
           </Box>

           {isOpen && <EditJobModal isOpen={isOpen} onClose={onClose} triggerToast={props.triggerToast} updateJob={props.updateJob} job={props.job}/>}
        </Box>
    )
}