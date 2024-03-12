import { IconButton, Card, CardHeader, HStack, Heading, Spacer } from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";

interface AboutCardProps {
    ownProfile: Boolean
}

export default function AboutCard(props: AboutCardProps) {
    return (
        <Card pt={2} pb={0} borderRadius="20px" border="1px" borderColor="#C5C1C1" minHeight="215px" maxHeight="450px" mb={4} overflow="hidden" bg="#FCFCFC">
            <CardHeader pb={0} pl={6} pr={6}>
                <HStack>
                    <Heading fontSize="23px" fontWeight="600">About</Heading>
                    <Spacer />
                    {props.ownProfile && <IconButton icon={<MdEdit />} aria-label=""/>}
                </HStack>
            </CardHeader>
        </Card>
    )
}