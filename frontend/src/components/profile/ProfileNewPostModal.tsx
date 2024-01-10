import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, ModalCloseButton, Textarea, Avatar, HStack, Text, IconButton, Menu, MenuButton, MenuList, MenuItem, Spacer } from "@chakra-ui/react";
import DefaultProfileImage from "@/images/DefaultProfilePicture.jpeg"
import { useState } from "react";
import usePostFactoryContract from "@/hooks/usePostFactoryContract";
import { Contract } from "ethers";
import axios from "axios";
import { API_URL } from "@/util/constants";
import Picker from 'emoji-picker-react'
import { CgAttachment } from "react-icons/cg";
import { BsEmojiGrin } from "react-icons/bs";


interface ProfileNewPostModalProps {
    isOpen: boolean,
    onClose: () => void,
    profileName: string,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    loadUserPosts: () => void
}

export default function ProfileNewPostModal(props: ProfileNewPostModalProps) {
    const [postContent, setPostContent] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const postFactoryContract: Contract | null  = usePostFactoryContract();
    
    function handlePostChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setPostContent(event.target.value);
    }

    const submitHandler = async () => {
        let response;
        try {
            setLoading(true)
            response = await axios.post(`${API_URL}/post`, {
                content: postContent
            })
            if (response.data.success) {
                await postFactoryContract?.createPost("", response.data.hash)
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
                        <Avatar src={DefaultProfileImage.src} mr={1}/>
                        <Text fontWeight="500">{props.profileName}</Text>
                    </HStack>
                    <Textarea 
                    placeholder="What would you like to say?" 
                    height="300px" 
                    resize="none"
                    value={postContent}
                    onChange={handlePostChange}/>
                </ModalBody>
                <ModalFooter>
                <HStack>
                        <IconButton aria-label={"attachment"} icon={<CgAttachment size={20}/>} variant="link"/>
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