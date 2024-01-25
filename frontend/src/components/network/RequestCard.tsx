import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import ConnectionRequest from "./ConnectionRequest";

interface RequestCardProps {
    pendingConnections: Array<UserDetails>,
    acceptRequest: (address: string) => Promise<void>,
    ignoreRequest: (address: string) => Promise<void>
}

export default function RequestCard(props: RequestCardProps) {
    return (
        <Card width="100%" mt={2} borderRadius="20px" p={0} pt={0}>
            <CardHeader>
                <Heading size='md'>Connection Requests</Heading>
            </CardHeader>
            <CardBody p={0}>
                {
                    props.pendingConnections !== undefined &&
                    props.pendingConnections.map((user) => {
                        return <ConnectionRequest user={user} acceptRequest={props.acceptRequest} ignoreRequest={props.ignoreRequest}/>
                    })
                }
            </CardBody>
        </Card>
    )
}