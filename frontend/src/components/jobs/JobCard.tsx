import { Card, CardBody, Grid, Box, HStack, Flex } from "@chakra-ui/react";
import Jobs from "./Jobs";
import { useState } from "react";
import JobDescription from "./JobDescription";

export default function JobCard() {
    const [selected, setSelected] = useState<number>(0)

    return (
        <Box flex={1} height="91vh">
            <Card height="100%">
                <CardBody p={0} height="100%">
                    <Flex>
                        <Box width="42%" height="91vh" display="block" overflowY="scroll">
                            <Jobs />
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