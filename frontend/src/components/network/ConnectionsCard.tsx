import { Card, CardBody, CardHeader, Heading, Input, Text } from "@chakra-ui/react";
import Connection from "./Connection";

interface ConnectionsCardProps {
    connections: Array<UserDetails>,
    removeConnection: (address: string) => Promise<void>
}

export default function ConnectionsCard(props: ConnectionsCardProps) {
    return (
        <Card width="100%" mt={2} borderRadius="20px" p={0} pt={0}>
            <CardHeader>
                <Heading size='md'>Your Connections</Heading>
            </CardHeader>
            <CardBody p={0} pb={3}>
                <Text pl={6}>{props.connections != undefined && `${props.connections.length} ${props.connections.length === 1 ? "Connection" : "Connections"}`}</Text>
                <Input ml={6} w="360px" placeholder="Search" mt={2}/>
                {
                    props.connections !== undefined &&
                    props.connections.map((user) => {
                        return <Connection user={user} removeConnection={props.removeConnection}/>
                    })
                }
            </CardBody>
        </Card>
    )
}