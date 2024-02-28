import { Card, CardBody, Grid, Box, HStack, Flex, Input, Button, Divider, InputGroup, InputLeftElement } from "@chakra-ui/react";
import Jobs from "./Jobs";
import { useState } from "react";
import JobDescription from "./JobDescription";
import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";

const JOBLIST = [1,2,3,4,5,6,7,8,9,10,1,1,1,1,1,1,1,1,1,1,1,1]

interface JobCardProps {
    isOrganisation: boolean
}

export default function JobCard(props: JobCardProps) {
    const [selected, setSelected] = useState<number>(0)

    const handleJobClick = (index: number) => {
        setSelected(index)
    }

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
                        {props.isOrganisation && <Button colorScheme="blue" borderRadius="18px" ml={3}>My Jobs</Button>}
                    </HStack>
                    <Divider />
                    <Flex>
                        <Box width="42%" height="84vh" display="block" overflowY="scroll">
                            <Jobs jobList={JOBLIST} selected={selected} handleJobClick={handleJobClick}/>
                        </Box>
                        <Box width="58%">
                            <JobDescription />
                        </Box>
                    </Flex>
                </CardBody>
            </Card>
        </Box>
    )
}