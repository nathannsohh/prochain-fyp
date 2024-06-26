import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, ModalCloseButton, Textarea, Avatar, HStack, Text, IconButton, Menu, MenuButton, MenuList, MenuItem, Spacer, Box } from "@chakra-ui/react";
import DefaultProfileImage from "@/images/DefaultProfilePicture.jpeg"
import { useState, useRef, ChangeEvent } from "react";
import usePostFactoryContract from "@/hooks/usePostFactoryContract";
import { Contract } from "ethers";
import axios from "axios";
import { API_URL, IPFS_URL } from "@/util/constants";
import Picker from 'emoji-picker-react'
import { CgAttachment } from "react-icons/cg";
import { BsEmojiGrin } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import Image from 'next/image'


interface ProfileNewPostModalProps {
    isOpen: boolean,
    onClose: () => void,
    profileName: string,
    profilePictureHash: string,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    loadUserPosts: () => void
}

export default function ProfileNewPostModal(props: ProfileNewPostModalProps) {
    const [postContent, setPostContent] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const postFactoryContract: Contract | null  = usePostFactoryContract();
    const attachmentInputRef = useRef<HTMLInputElement | null>(null);

    const handleAttachmentClick = () => {
        // Trigger the click event of the hidden file input
        if (attachmentInputRef.current) {
            attachmentInputRef.current.click();
        }
    }
    const handlePictureFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Handle the selected file here
        const selectedFile = event.target.files && event.target.files[0];

        if (selectedFile) {
            setImageFile(selectedFile)
            // Read the contents of the selected file
            const reader = new FileReader();
            reader.onload = (e) => {
                // Set the image source with the read data URL
                setImageSrc(e.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    
    const handleRemoveImage = () => {
        setImageSrc(null)
    }

    function handlePostChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setPostContent(event.target.value);
    }


    const submitHandler = async () => {
        let response;
        let imageHash = ""
        try {
            setLoading(true)
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);

                const ipfsResponse = await axios.post(`${IPFS_URL}/add`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (ipfsResponse.data.Hash) imageHash = ipfsResponse.data.Hash
            }

            response = await axios.post(`${API_URL}/post`, {
                content: postContent
            })
            if (response.data.success) {
                await postFactoryContract?.createPost(imageHash, response.data.hash)
            }
            setLoading(false)
            props.onClose()
            props.triggerToast("Post Created", "Your new post is now viewable by everyone!", "success")
            setTimeout(
                props.loadUserPosts,
                2000
            )
        } catch (e) {
            if (response && response.data.success) {
                try {
                    await axios.delete(`${API_URL}/post/${response.data.hash}`)
                } catch (err) {
                    console.error(err)
                }
            }
            console.error(e)
            setLoading(false)
            props.triggerToast("Error", "Something went wrong and your post was not posted.", "error")
        }
    }

    const handleEmojiClick = (emojiObject: any, _: Event) => {
        setPostContent(prevContent => prevContent + emojiObject.emoji)
    }

    return(
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent maxW="40%">
                <ModalHeader>New Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <HStack mb={4}>
                        <Avatar src={`http://127.0.0.1:8080/ipfs/${props.profilePictureHash}`} mr={1}/>
                        <Text fontWeight="500">{props.profileName}</Text>
                    </HStack>
                    <Textarea 
                    placeholder="What would you like to say?" 
                    height="300px" 
                    resize="none"
                    value={postContent}
                    onChange={handlePostChange}/>
                    {imageSrc && 
                    <Box 
                        position="relative"
                        mt={4}
                        style={{ width: '350px', aspectRatio: '4/3' }}
                    >
                        <IconButton aria-label={""} icon={<RxCross2 />} position="absolute" isRound={true} width="5px" right={0} onClick={handleRemoveImage} zIndex={2}/>
                        <Image src={imageSrc} alt="profile picture" layout='fill' objectFit='contain'/>
                    </Box>
                    }
                </ModalBody>
                <ModalFooter>
                <HStack>
                        <IconButton aria-label={"attachment"} icon={<CgAttachment size={20}/>} variant="link" onClick={handleAttachmentClick}/>
                        <input
                            ref={attachmentInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handlePictureFileChange}
                        />
                        <Menu closeOnSelect={false}>
                        {({ isOpen }) => (
                            <>
                                <MenuButton as={IconButton} aria-label={"emojis"} icon={<BsEmojiGrin size={20}/>} variant="link" isActive={isOpen}/>
                                <MenuList p={0}>
                                    <MenuItem p={0}>
                                        <Picker 
                                            width="100%" 
                                            height={275} 
                                            previewConfig={{ showPreview: false }} 
                                            searchDisabled={true} 
                                            onEmojiClick={handleEmojiClick}
                                        />
                                    </MenuItem>
                                </MenuList>
                            </>
                        )}
                            
                        </Menu>
                        <Spacer />
                    <Button colorScheme="blue" isDisabled={postContent === ""} onClick={submitHandler} isLoading={loading}>Post</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )    
}