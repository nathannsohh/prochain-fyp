import { Card, CardBody, Grid, Box, HStack, Flex, Input, Button, Divider, InputGroup, InputLeftElement } from "@chakra-ui/react";
import Jobs from "./Jobs";
import { useEffect, useState } from "react";
import JobDescription from "./JobDescription";
import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { getDetailsFromOrgAddress } from "@/util/user_util";
import axios from "axios";
import { API_URL, THE_GRAPH_URL } from "@/util/constants";
import { convertToJobMap, getArrayOfJobHashes, getArrayOfJobOwners } from "@/util/util";

interface JobCardProps {
    isOrganisation: boolean,
    handleShowJob: () => void
}

export default function JobCard(props: JobCardProps) {
    const [selected, setSelected] = useState<number>(0)
    const [jobs, setJobs] = useState<any[]>([])

    const handleJobClick = (index: number) => {
        setSelected(index)
    }

    const getJobs = async () => {
        const graphqlQuery = {
            "operationName": "getJobs",
            "query": `query getJobs {
                         jobs (
                            where: { status: 0}, 
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
            const jobMap = convertToJobMap(jobResult.data.jobs)
            const jobOwnerDetails = await getDetailsFromOrgAddress(jobOwners)

            const consolidatedJobs = allJobs.map((job: any, index: number) => {
                return {
                    ...job, 
                    job_title: jobMap.get(job.jobHash).job_title,
                    job_description: jobMap.get(job.jobHash).job_description,
                    job_level: jobMap.get(job.jobHash).job_level,
                    employment_type: jobMap.get(job.jobHash).employment_type,
                    location: jobMap.get(job.jobHash).location,
                    time_posted: jobMap.get(job.jobHash).time_posted, 
                    hash: jobMap.get(job.jobHash).content_hash,
                    profileImageHash: jobOwnerDetails?.get(job.owner)?.profileImageHash, 
                    company_name: jobOwnerDetails?.get(job.owner)?.company_name, 
                    industry: jobOwnerDetails?.get(job.owner)?.industry
                }
            })
            setJobs(consolidatedJobs)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getJobs();
    }, [])

    return (
        <Box flex={1} height="91vh">
            <Card height="100%">
                <CardBody p={0} height="100%">
                    <HStack p={2}>
                        <InputGroup width={"40%"}>
                            <InputLeftElement>
                                <FiSearch />
                            </InputLeftElement>
                            <Input placeholder="Search by title or company" variant="filled"/>
                        </InputGroup>
                        <InputGroup width={"30%"}>
                            <InputLeftElement>
                                <FaLocationDot />
                            </InputLeftElement>
                            <Input placeholder="Location" variant="filled"/>
                        </InputGroup>
                        <Button colorScheme="blue" borderRadius="18px" variant="outline">Search</Button>
                        {props.isOrganisation && <Button colorScheme="blue" borderRadius="18px" ml={3} onClick={props.handleShowJob}>My Jobs</Button>}
                    </HStack>
                    <Divider />
                    <Flex>
                        <Box width="42%" height="84vh" display="block" overflowY="scroll">
                            <Jobs jobList={jobs} selected={selected} handleJobClick={handleJobClick}/>
                        </Box>
                        <Box width="58%">
                            {jobs.length > 0 && <JobDescription job={jobs[selected]}/>}
                        </Box>
                    </Flex>
                </CardBody>
            </Card>
        </Box>
    )
}