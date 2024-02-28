import { Card, CardBody, Grid, Box, HStack, Flex, Input, Button, Divider, InputGroup, InputLeftElement, IconButton } from "@chakra-ui/react";
import Jobs from "./Jobs";
import { useState } from "react";
import JobDescription from "./JobDescription";
import { FiSearch } from "react-icons/fi";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import EditableJobDescription from "./EditableJobDescription";

const JOBLIST = [1,2,3,4,5]

interface OwnJobCardProps {
    isOrganisation: boolean,
    handleShowJob: () => void
}

export default function OwnJobCard(props: OwnJobCardProps) {
    const [selected, setSelected] = useState<number>(0)

    const handleJobClick = (index: number) => {
        setSelected(index)
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
                        <Button colorScheme="blue" borderRadius="18px" onClick={props.handleShowJob} leftIcon={<IoMdAdd />}>New Job</Button>
                    </HStack>
                    <Divider />
                    <Flex>
                        <Box width="42%" height="84vh" display="block" overflowY="scroll">
                            <Jobs jobList={JOBLIST} selected={selected} handleJobClick={handleJobClick}/>
                        </Box>
                        <Box width="58%">
                            <EditableJobDescription />
                        </Box>
                    </Flex>
                </CardBody>
            </Card>
        </Box>
    )
}