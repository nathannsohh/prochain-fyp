import { Card, CardBody, Box, HStack, Flex, Input, Button, Divider, InputGroup, InputLeftElement, IconButton, useDisclosure, useToast } from "@chakra-ui/react";
import Jobs from "./Jobs";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import EditableJobDescription from "./EditableJobDescription";
import useJobFactoryContract from "@/hooks/useJobFactoryContract";
import NewJobModal from "./NewJobModal";
import { useAppSelector } from "@/hooks/reduxHooks";
import axios from "axios";
import { API_URL, THE_GRAPH_URL } from "@/util/constants";
import { getArrayOfJobHashes, getArrayOfJobOwners } from "@/util/util";
import { getDetailsFromOrgAddress } from "@/util/user_util";

const JOBLIST = [1,2,3,4,5]

interface OwnJobCardProps {
    handleShowJob: () => void
}

export default function OwnJobCard(props: OwnJobCardProps) {
    const [selected, setSelected] = useState<number>(0)
    const [ownJobs, setOwnJobs] = useState<any[]>([])

    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const orgProfile: OrganisationProfileState = useAppSelector((state) => state.orgProfile)

    const handleJobClick = (index: number) => {
        setSelected(index)
    }

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

    const getOwnJobs = async () => {
        const graphqlQuery = {
            "operationName": "getJobs",
            "query": `query getJobs {
                         jobs (
                            where: { owner: "${orgProfile.wallet_address}"}, 
                            orderBy: id,
                            orderDirection: desc
                        ) { id jobHash appliedBy owner status } }`,
            "variables": {}
        }
        try {
            const jobs = await axios.post(`${THE_GRAPH_URL}/jobs`, graphqlQuery)
            const allJobs = jobs.data.data.jobs
            const jobHashes = getArrayOfJobHashes(allJobs)
            const jobOwners = getArrayOfJobOwners(allJobs)

            const jobResult = await axios.get(`${API_URL}/jobs/[${jobHashes}]`)
            const jobOwnerDetails = await getDetailsFromOrgAddress(jobOwners)

            const consolidatedJobs = allJobs.map((job: any, index: number) => {
                return {
                    ...job, 
                    job_title: jobResult.data.jobs[index].job_title,
                    job_description: jobResult.data.jobs[index].job_description,
                    job_level: jobResult.data.jobs[index].job_level,
                    employment_type: jobResult.data.jobs[index].employment_type,
                    location: jobResult.data.jobs[index].location,
                    time_posted: jobResult.data.jobs[index].time_posted, 
                    profileImageHash: jobOwnerDetails?.get(job.owner)?.profileImageHash, 
                    company_name: jobOwnerDetails?.get(job.owner)?.company_name, 
                    industry: jobOwnerDetails?.get(job.owner)?.industry
                }
            })
            setOwnJobs(consolidatedJobs)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getOwnJobs();
    }, [])

    const handleJobCreation = async () => {
        let currentNumOfJobs = ownJobs.length
        let target = currentNumOfJobs + 1

        while (currentNumOfJobs !== target) {
            const graphqlQuery = {
                "operationName": "getJobs",
                "query": `query getJobs {
                             jobs (
                                where: { owner: "${orgProfile.wallet_address}"},
                            ) { id } }`,
                "variables": {}
            }
            const jobs = await axios.post(`${THE_GRAPH_URL}/jobs`, graphqlQuery)
            currentNumOfJobs = jobs.data.data.jobs.length
        }
        
        await getOwnJobs()
    }

    return (
        <Box flex={1} height="91vh">
            <Card height="100%">
                <CardBody p={0} height="100%">
                    <HStack p={2}>
                        <IconButton aria-label={"Back"} icon={<IoMdArrowBack />} onClick={props.handleShowJob}/>
                        <InputGroup width={"40%"}>
                            <InputLeftElement>
                                <FiSearch />
                            </InputLeftElement>
                            <Input placeholder="Search by title" variant="filled"/>
                        </InputGroup>
                        <InputGroup width={"30%"}>
                            <InputLeftElement>
                                <FaLocationDot />
                            </InputLeftElement>
                            <Input placeholder="Location" variant="filled"/>
                        </InputGroup>
                        <Button colorScheme="blue" borderRadius="18px" variant="outline">Search</Button>
                        <Button colorScheme="blue" borderRadius="18px" onClick={onOpen} leftIcon={<IoMdAdd />}>New Job</Button>
                    </HStack>
                    <Divider />
                    <Flex>
                        <Box width="42%" height="84vh" display="block" overflowY="scroll">
                            <Jobs jobList={ownJobs} selected={selected} handleJobClick={handleJobClick}/>
                        </Box>
                        <Box width="58%">
                            {ownJobs.length > 0 && <EditableJobDescription job={ownJobs[selected]} />}
                        </Box>
                    </Flex>
                </CardBody>
            </Card>

            {isOpen && <NewJobModal isOpen={isOpen} onClose={onClose} triggerToast={triggerToast} onJobCreation={handleJobCreation}/>}
        </Box>
    )
}