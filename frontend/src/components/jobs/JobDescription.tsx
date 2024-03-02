import { Badge, Box, Button, HStack, Heading, Icon, Text } from "@chakra-ui/react";
import { FaSuitcase } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";
import { COLOR_MAP } from "@/util/constants";
import { useAppSelector } from "@/hooks/reduxHooks";
import { MdPeopleAlt } from "react-icons/md";

interface JobDescriptionProps {
    job: any
}

export default function JobDescription(props: JobDescriptionProps) {
    const profileType: Number = useAppSelector((state) => state.profileType)

    return (
        <Box height="84vh" overflowY="scroll" p={5}>
           <Heading fontSize="23px" mb={1}>{props.job.job_title}</Heading>
           <Box fontSize={14}>
                <Text>{props.job.company_name}</Text>
                <Text>{props.job.location}</Text>
           </Box>
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
           <HStack mt={3}>
            <Icon as={MdPeopleAlt} boxSize={6} color="#666666" mr={1}/>
            <Text fontSize={14} colorScheme="green">{props.job.appliedBy.length} {props.job.appliedBy.length == 1 ? "applicant" : "applicants"}</Text>
           </HStack>
           {profileType == 0 && <Button colorScheme="blue" borderRadius={18} mt={6}>Apply</Button>}

           <Box mt={7}>
            <Text fontSize={20} fontWeight="semibold">Job Description</Text>
            <Text fontSize={15} whiteSpace="pre-wrap">
                {props.job.job_description}
            </Text>
           </Box>
        </Box>
    )
}