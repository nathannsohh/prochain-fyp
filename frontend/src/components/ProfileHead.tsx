import { Card, CardBody, CardHeader, Box, VStack } from "@chakra-ui/react"
import Image from "next/image"
import TestImage from "@/images/test.jpg"

export default function ProfileHead() {
    return (
        <Box width="100%" height="480px" bg="#FCFCFC" borderRadius="20px" border="1px" borderColor="#C5C1C1" overflow="hidden" mt={2}>
            <Box height="50%" position="relative">
                <Image src={TestImage} alt="profile banner" layout="fill" objectFit="cover"/>
            </Box>
            <VStack>
                <Box height="50%">
                    Hello!
                </Box>
            </VStack>
        </Box>
    )
}