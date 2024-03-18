import { Button, Card, CardBody, CardHeader, Center, HStack, Heading, Spacer, Text } from "@chakra-ui/react";
import WorkExperience from "./WorkExperience";

interface WorkExperienceCardProps {
    ownProfile: Boolean,
    onNewExperience: () => void,
    experienceData: any[],
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    onExperienceUpdate: () => Promise<void>
}

export default function WorkExperienceCard(props: WorkExperienceCardProps) {
    return (
        <Card pt={1} pb={0} borderRadius="20px" border="1px" borderColor="#C5C1C1" minHeight="215px" mb={4} overflow="hidden" bg="#FCFCFC">
            <CardHeader pb={0} pl={6} pr={6}>
                <HStack>
                    <Heading fontSize="23px" fontWeight="600">Work Experience</Heading>
                    <Spacer />
                    {props.ownProfile && <Button onClick={props.onNewExperience}>+</Button>}
                </HStack>
            </CardHeader>
            <CardBody p={0}>
                {props.experienceData?.map((experience, index) => {
                    return <WorkExperience key={index} experience={experience} ownProfile={props.ownProfile} triggerToast={props.triggerToast} onExperienceUpdate={props.onExperienceUpdate} />
                })}
            </CardBody>
        </Card>
    )
}