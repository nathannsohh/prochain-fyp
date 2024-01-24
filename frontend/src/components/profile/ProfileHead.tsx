import { Box, VStack, HStack, Text, IconButton, Button, Spacer, Center } from "@chakra-ui/react"
import Image from "next/image"
import { MdEdit } from "react-icons/md";

interface ProfileHeadProps {
    userData: UserType | null,
    onEditProfile: () => void,
    connections: Number | null,
    ownProfile: Boolean,
    isConnected: Boolean | null
}

const formatAddress = (address: String | undefined): String | null => {
    if (address === undefined) return null

    return address!.slice(0, 5) + "..." + address!.slice(-4)
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
        mb={4}
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
                    <Image src={`http://127.0.0.1:8080/ipfs/${props.userData?.profile_picture_hash}`} alt="profile picture" layout="fill" objectFit="cover"/>
                </Box>
            </Center>
            <Box height="50%" position="relative">
                <Image src={`http://127.0.0.1:8080/ipfs/${props.userData?.profile_banner_hash}`} alt="profile banner" layout="fill" objectFit="cover"/>
            </Box>
            <VStack p={5} mt={2} width="100%" height="50%">
                <Text fontSize="28px" fontWeight="Bold" position="absolute">{`${props.userData?.first_name} ${props.userData?.last_name}`}</Text>
                <HStack width="100%" mb={2} alignItems="center">
                <Box bg="#EEEEEE" p={1} borderRadius="10px" pl="20px" pr="20px">
                    <Text fontSize="16px" color="#555353"><b>{props.connections?.toString()}</b> Connections</Text>
                </Box>
                    <Spacer />
                    {props.ownProfile ? <IconButton onClick={ props.onEditProfile } icon={<MdEdit />} aria-label=""/> : 
                    !props.isConnected ? <Button colorScheme="blue" variant="ghost">Connect +</Button> : 
                    <Box bg="#EEEEEE" p={1} borderRadius="10px" pl="20px" pr="20px">
                        <Text fontSize="16px" color="#555353">Connected</Text>
                    </Box>}
                </HStack>
                <Box bg="#C6EAFF" p={1} borderRadius="20px" pl="20px" pr="20px">
                    <Text fontSize="13px" fontWeight="bold" color="#818181">{formatAddress(props.userData?.wallet_address)}</Text>
                </Box>
                <Text>{props.userData?.bio}</Text>
                <Text fontWeight="700" color="#5F5F5F" fontSize="15px">{props.userData?.location}</Text>
                <Spacer />
                <Button variant="link">More Info +</Button>
            </VStack>
        </Box>
    )
}