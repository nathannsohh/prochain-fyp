import { Box, VStack, HStack, Text, IconButton, Button, Spacer, Center } from "@chakra-ui/react"
import Image from "next/image"
import TestImage from "@/images/test.jpg"
import DefaultProfileImage from "@/images/DefaultProfilePicture.jpeg"
import { MdEdit } from "react-icons/md";

interface ProfileHeadProps {
    userData: ProfileType
}

type ProfileType = {
    first_name: String,
    last_name: String,
    pronouns?: String,
    email: String,
    wallet_address: String,
    bio?: String,
    location?: String
}

const formatAddress = (address: String): String => {
    return address.slice(0, 5) + "..." + address.slice(-4)
}

export default function ProfileHead(props: ProfileHeadProps) {
    return (
        <Box 
        width="100%" 
        height="480px" 
        bg="#FCFCFC" 
        borderRadius="20px" 
        border="1px" 
        borderColor="#C5C1C1" 
        overflow="hidden" 
        mt={2} 
        position="relative">
            <Center>
                <Box 
                width="160px" 
                height="160px" 
                position="absolute" 
                borderRadius="10px" 
                overflow="hidden" 
                border="4px"
                borderColor="#FFFFFF" 
                zIndex="1"
                mt="350px">
                    <Image src={DefaultProfileImage} alt="profile banner" layout="fill" objectFit="contain"/>
                </Box>
            </Center>
            <Box height="50%" position="relative">
                <Image src={TestImage} alt="profile banner" layout="fill" objectFit="cover"/>
            </Box>
            <VStack p={5} mt={2} width="100%">
                <Text fontSize="30px" fontWeight="Bold" position="absolute">{`${props.userData.first_name} ${props.userData.last_name}`}</Text>
                <HStack width="100%" mb={2} alignItems="center">
                <Box bg="#EEEEEE" p={1} borderRadius="10px" pl="20px" pr="20px">
                    <Text fontSize="16px" color="#555353"><b>504</b> Connections</Text>
                </Box>
                    <Spacer />
                    <IconButton onClick={() => { } } icon={<MdEdit />} aria-label=""/>
                </HStack>
                <Box bg="#C6EAFF" p={1} borderRadius="20px" pl="20px" pr="20px">
                    <Text fontSize="13px" fontWeight="bold" color="#818181">{formatAddress(props.userData.wallet_address)}</Text>
                </Box>
                <Text>{props.userData.bio}</Text>
                <Button mt={9} variant="link">More Info +</Button>
            </VStack>
        </Box>
    )
}