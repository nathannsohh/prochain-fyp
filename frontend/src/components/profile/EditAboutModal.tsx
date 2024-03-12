import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, ModalCloseButton, Textarea, HStack, Text, FormControl, FormErrorMessage, Input, FormLabel, Select, Spacer, Center, IconButton } from "@chakra-ui/react";
import axios from "axios";
import { API_URL } from "@/util/constants";
import { useState } from "react";
import _ from "lodash";

interface EditAboutModalProps {
    isOpen: boolean,
    onClose: () => void,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    userAddress: string,
    profileType: number,
    updateAbout: () => Promise<void>,
    about: string | null
}

export default function EditAboutModal(props: EditAboutModalProps) {
    const [about, setAbout] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const submitHandler = async () => {
        console.log(props.userAddress)
        try {
            setLoading(true)
            if (props.profileType == 0) {
                const response = await axios.put(`${API_URL}/user/about`, {
                    about: about,
                    wallet_address: props.userAddress
                })
                if (response.data.success) {
                    props.triggerToast("Success", "About section updated!", "success")
                    await props.updateAbout()
                }
            } else {
                const response = await axios.put(`${API_URL}/organisation/about`, {
                    about: about,
                    wallet_address: props.userAddress
                })
                if (response.data.success) {
                    props.triggerToast("Success", "About section updated!", "success")
                    await props.updateAbout()
                }
            }
            props.onClose()
        } catch (e) {
            console.error(e)
            props.triggerToast("Error", "An error occurred. Please try again later.", "error")
        } finally {
            setLoading(false)
        }
    }

    const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAbout(event.target.value)
    }

    return(
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent maxW="50%">
                <ModalHeader>Edit About</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Textarea 
                        placeholder="Introduce yourself!" 
                        height="300px" 
                        resize="none"
                        defaultValue={props.about!}
                        onChange={onChangeHandler}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" type="submit" isLoading={loading} onClick={submitHandler} isDisabled={about.length === 0}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )    
}