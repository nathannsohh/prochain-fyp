import { Card, CardBody, Grid, Box, HStack, Flex } from "@chakra-ui/react";
import Jobs from "./Jobs";

export default function JobCard() {
    return (
        <Box flex={1} height="91vh">
            <Card height="100%">
                <CardBody p={0} height="100%">
                    <Flex>
                        <Box width="42%" height="91vh" display="block" overflowY="scroll">
                            <Jobs />
                        </Box>
                        <Box width="58%">
                            Hello2
                        </Box>
                    </Flex>
                </CardBody>
            </Card>
        </Box>
    )
}