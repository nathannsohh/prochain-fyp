import { IconButton, Card, CardHeader, HStack, Heading, Spacer, CardBody, Text } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";

interface AboutCardProps {
    ownProfile: Boolean,
    about: string | null,
    onEdit: () => void
}

export default function AboutCard(props: AboutCardProps) {
    return (
        <Card borderRadius="20px" border="1px" borderColor="#C5C1C1" mb={4} overflow="hidden" bg="#FCFCFC">
            <CardHeader pb={0}>
                <HStack>
                    <Heading fontSize="23px" fontWeight="600">About</Heading>
                    <Spacer />
                    {props.ownProfile && <IconButton icon={<MdEdit />} aria-label="" onClick={props.onEdit}/>}
                </HStack>
            </CardHeader>
            <CardBody pt={1}>
                <Text whiteSpace="pre-wrap">{props.about}</Text>
            </CardBody>
        </Card>
    )
}