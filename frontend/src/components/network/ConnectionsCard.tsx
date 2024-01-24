import { Card, CardBody, CardHeader, Heading, Input, Text } from "@chakra-ui/react";
import Connection from "./Connection";

export default function ConnectionsCard() {
    return (
        <Card width="100%" mt={2} borderRadius="20px" p={0} pt={0}>
            <CardHeader>
                <Heading size='md'>Your Connections</Heading>
            </CardHeader>
            <CardBody p={0}>
                <Text pl={6}>1 Connection</Text>
                <Input ml={6} w="360px" placeholder="Search" mt={2}/>
                <Connection />
            </CardBody>
        </Card>
    )
}