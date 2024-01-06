import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, ModalCloseButton, Textarea, Avatar, HStack, Text } from "@chakra-ui/react";
import DefaultProfileImage from "@/images/DefaultProfilePicture.jpeg"
import { useState } from "react";
import usePostFactoryContract from "@/hooks/usePostFactoryContract";
import { Contract } from "ethers";
import axios from "axios";
import { API_URL } from "@/util/constants";

interface ProfileNewPostModalProps {
    isOpen: boolean,
    onClose: () => void,
    profileName: string,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    loadUserPosts: () => void
}

export default function ProfileNewPostModal(props: ProfileNewPostModalProps) {
    const [postContent, setPostContent] = useState<String>("")
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
                    onChange={handlePostChange}/>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" isDisabled={postContent === ""} onClick={submitHandler} isLoading={loading}>Post</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )    
}