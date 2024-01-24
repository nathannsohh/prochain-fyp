import { Card, CardBody, HStack, CardHeader, Heading } from "@chakra-ui/react";
import ConnectionRequest from "./ConnectionRequest";

export default function RequestCard() {
    return (
        <Card width="100%" mt={2} borderRadius="20px" p={0} pt={0}>
            <CardHeader>
                <Heading size='md'>Connection Requests</Heading>
            </CardHeader>
            <CardBody p={0}>
                <ConnectionRequest />
                <ConnectionRequest />
                <ConnectionRequest />
            </CardBody>
        </Card>
    )
}