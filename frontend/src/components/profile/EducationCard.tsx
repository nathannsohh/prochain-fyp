import { Button, Card, CardBody, CardHeader, Center, HStack, Heading, Spacer, Text } from "@chakra-ui/react";
import { Ropa_Sans } from "next/font/google";
import { MdEdit } from "react-icons/md";
import Education from "./Education";

interface EducationCardProps {
    ownProfile: Boolean,
    onNewEducation: () => void,
    educationData: any[],
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    onEducationUpdate: () => Promise<void>
}

export default function EducationCard(props: EducationCardProps) {
    return (
        <Card pt={2} pb={0} borderRadius="20px" border="1px" borderColor="#C5C1C1" minHeight="215px" mb={4} overflow="hidden" bg="#FCFCFC">
            <CardHeader pb={0} pl={6} pr={6}>
                <HStack>
                    <Heading fontSize="23px" fontWeight="600">Education</Heading>
                    <Spacer />
                    {props.ownProfile && <Button onClick={props.onNewEducation}>+</Button>}
                </HStack>
            </CardHeader>
            <CardBody p={0}>
                {props.educationData?.map((education) => {
                    return <Education key={education.id} education={education} ownProfile={props.ownProfile} triggerToast={props.triggerToast} onEducationUpdate={props.onEducationUpdate} />
                })}
            </CardBody>
        </Card>
    )
}