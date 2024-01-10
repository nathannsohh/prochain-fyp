import { Box, Center, VStack, Text, HStack, Spacer } from "@chakra-ui/react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";

interface ProfileHeadPreviewProps {
    userData: UserType | null,
    connections: Number | null,
    updateProfileImage: (image: File | null) => void,
    updateProfileBanner: (image: File | null) => void
}

export default function ProfileHeadPreview(props: ProfileHeadPreviewProps) {
    const [profileImageChanged, setProfileImageChanged] = useState<boolean>(false)
    const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null)
    const [profileBannerChanged, setProfileBannerChanged] = useState<boolean>(false)
    const [profileBannerSrc, setProfileBannerSrc] = useState<string | null>(null)
    const [profilePicHover, setProfilePicHover] = useState<boolean>(false)
    const [profileBannerHover, setProfileBannerHover] = useState<boolean>(false)

    const profilePictureInputRef = useRef<HTMLInputElement | null>(null);
    const handleProfilePictureClick = () => {
        // Trigger the click event of the hidden file input
        if (profilePictureInputRef.current) {
            profilePictureInputRef.current.click();
        }
    };

    const handleProfilePictureFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Handle the selected file here
        const selectedFile = event.target.files && event.target.files[0];

        if (selectedFile) {
            props.updateProfileImage(selectedFile)
            // Read the contents of the selected file
            const reader = new FileReader();
            reader.onload = (e) => {
                // Set the image source with the read data URL
                setProfileImageSrc(e.target?.result as string);
                setProfileImageChanged(true)
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleRemoveProfileImage = () => {
        setProfileImageChanged(false)
        props.updateProfileImage(null)
    }

    const profileBannerInputRef = useRef<HTMLInputElement | null>(null);
    const handleProfileBannerClick = () => {
        // Trigger the click event of the hidden file input
        if (profileBannerInputRef.current) {
            profileBannerInputRef.current.click();
        }
    };

    const handleProfileBannerFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Handle the selected file here
        const selectedFile = event.target.files && event.target.files[0];

        if (selectedFile) {
            props.updateProfileBanner(selectedFile)
            // Read the contents of the selected file
            const reader = new FileReader();
            reader.onload = (e) => {
                // Set the image source with the read data URL
                setProfileBannerSrc(e.target?.result as string);
                setProfileBannerChanged(true)
            };
            reader.readAsDataURL(selectedFile);
        }
    }

    const handleRemoveProfileBanner = () => {
        setProfileBannerChanged(false)
        props.updateProfileBanner(null)
    }

    const formatAddress = (address: String | undefined): String | null => {
        if (address === undefined) return null
    
        return address!.slice(0, 5) + "..." + address!.slice(-4)
    }

    return (
        <Box 
        width="80%" 
        height="384px" 
        bg="#FCFCFC" 
        borderRadius="20px" 
        border="1px" 
        borderColor="#C5C1C1" 
        overflow="hidden" 
        mt={2} 
        mb={4}
        position="relative">
            <Center cursor="pointer" onMouseEnter={() => setProfilePicHover(true)} onMouseLeave={() => setProfilePicHover(false)}>
                <Center h="128px" w="128px" position="absolute" zIndex="3" mt="300px" borderRadius="8px" _hover={{bg: "rgba(0,0,0,0.60)"}} p={3} onClick={profileImageChanged ? handleRemoveProfileImage : handleProfilePictureClick}>
                    {profilePicHover && <Text fontSize="12px" fontWeight="medium" color="white" textAlign="center">{profileImageChanged ? "Remove Image" : "Change Profile Picture"}</Text>}
                </Center>
                <input
                    ref={profilePictureInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleProfilePictureFileChange}
                />
                <Box
                width="128px" 
                height="128px" 
                position="absolute" 
                borderRadius="8px" 
                overflow="hidden" 
                border="4px"
                borderColor="#FFFFFF" 
                zIndex="2"
                mt="300px">
                    <Image src={profileImageChanged && profileImageSrc ? profileImageSrc! : `http://127.0.0.1:8080/ipfs/${props.userData?.profile_picture_hash}`} alt="profile picture" layout="fill" objectFit="cover"/>
                </Box>
            </Center>

            <Box height="50%" position="relative">
                <Center 
                h="100%" 
                w="100%" 
                position="absolute" 
                zIndex="1" 
                cursor="pointer" 
                onMouseEnter={() => setProfileBannerHover(true)} 
                onMouseLeave={() => setProfileBannerHover(false)} 
                _hover={{bg: "rgba(0,0,0,0.60)"}}
                pb="100px"
                onClick={profileBannerChanged ? handleRemoveProfileBanner : handleProfileBannerClick}
                >
                    {profileBannerHover && <Text fontSize="12px" fontWeight="medium" color="white" textAlign="center">{profileBannerChanged ? "Remove Image" : "Change Profile Banner"}</Text>}               
                </Center>
                <input
                    ref={profileBannerInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleProfileBannerFileChange}
                />
                <Image src={profileBannerChanged && profileBannerSrc ? profileBannerSrc! : `http://127.0.0.1:8080/ipfs/${props.userData?.profile_banner_hash}`} alt="profile banner" layout="fill" objectFit="cover"/>
            </Box>
            <VStack p={5} mt={2} width="100%" height="50%">
                <Text fontSize="23px" fontWeight="semibold" position="absolute">{`${props.userData?.first_name} ${props.userData?.last_name}`}</Text>
                <HStack width="100%" mb={1} alignItems="center">
                <Box bg="#EEEEEE" p={1} borderRadius="10px" pl="16px" pr="16px">
                    <Text fontSize="13px" color="#555353"><b>{props.connections?.toString()}</b> Connections</Text>
                </Box>
                <Spacer />
                </HStack>
                <Box bg="#C6EAFF" p={1} borderRadius="20px" pl="16px" pr="16px">
                    <Text fontSize="11px" fontWeight="bold" color="#818181">{formatAddress(props.userData?.wallet_address)}</Text>
                </Box>
                <Text fontSize="13px">{props.userData?.bio}</Text>
                <Text fontWeight="700" color="#5F5F5F" fontSize="12px">{props.userData?.location}</Text>
                <Spacer />
            </VStack>
        </Box>
    )
}