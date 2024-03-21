import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, ModalCloseButton, Textarea, HStack, Text, FormControl, FormErrorMessage, Input, FormLabel, Select, Spacer, Center, IconButton } from "@chakra-ui/react";
import axios from "axios";
import { useForm } from 'react-hook-form'
import { API_URL, educationTypes } from "@/util/constants";
import { ChangeEvent, useRef, useState } from "react";
import _ from "lodash";
import { CgAttachment } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";

interface EducationModalProps {
    isOpen: boolean,
    onClose: () => void,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    userAddress: string,
    updateUserEducation: () => Promise<void>,
    educationData: any | null
}

export default function NewEducationModal(props: EducationModalProps) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<EducationType>()

    const attachmentInputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string | null>(null)

    const handleAttachmentClick = () => {
        // Trigger the click event of the hidden file input
        if (attachmentInputRef.current) {
            attachmentInputRef.current.click();
        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Handle the selected file here
        const selectedFile = event.target.files && event.target.files[0];

        if (selectedFile) {
            setFileName(selectedFile.name)
        }
    };
    
    const handleRemoveFile = () => {
        setFileName(null)
    }

    const submitHandler = async (values: EducationType) => {
        values.start = values.start.concat("-01")
        if (values.end !== "") {
            values.end = values.end!.concat("-01")
        } else {
            values.end = null
        }

        try {
            if (props.educationData === null) {
                // handle update of user details
                let body: any = {
                    ...values, 
                    user_address: props.userAddress, 
                    verifiable: fileName !== null
                }
                const response = await axios.post(`${API_URL}/education`, body)
                if (response.data.success) {
                    props.updateUserEducation()
                    props.triggerToast("Success", "This education has been added!", "success")
                }
            } else {
                const body = {
                    ...values,
                    user_address: props.userAddress, 
                    verifiable: props.educationData.verifiable ? true : fileName !== null,
                    id: props.educationData.id
                }
                const response = await axios.put(`${API_URL}/education`, body)
                if (response.data.success) {
                    props.updateUserEducation()
                    props.triggerToast("Success", "This education has been updated!", "success")
                }
            }
            props.onClose()   
        } catch (e) {
            props.triggerToast("Error", "Something went wrong. Please try again later.", "error")
        }
    }

    return(
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent maxW="50%">
                <ModalHeader>{props.educationData !== null ? "Edit Education" : "Add Education"}</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(submitHandler)}>
                    <ModalBody>
                        <FormControl isRequired isInvalid={errors.school_name != null} mb={3}>
                            <FormLabel>School Name</FormLabel>
                            <Input 
                            placeholder='School Name' 
                            defaultValue={props.educationData?.school_name}
                            {...register('school_name', {
                                required: 'This is required'
                            })}
                            />
                            <FormErrorMessage>
                                {errors.school_name && errors.school_name.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl width="40%" mb={3} isRequired>
                            <FormLabel>Education Type</FormLabel>
                            <Select 
                            placeholder='Type'
                            defaultValue={props.educationData?.type}
                            {...register('type', {
                                required: 'This is required'
                            })}
                            >
                                {educationTypes.map((pronoun: string, index: number) => {
                                    return <option key={index} value={pronoun}>{pronoun}</option>
                                })}
                            </Select>
                        </FormControl>
                        <FormControl isInvalid={errors.field != null} mb={3}>
                            <FormLabel>Field of Study</FormLabel>
                            <Input 
                            placeholder='Field of Study' 
                            defaultValue={props.educationData?.field!}
                            {...register('field')}
                            />
                            <FormErrorMessage>
                                {errors.field && errors.field.message}
                            </FormErrorMessage>
                        </FormControl>
                        <HStack mb={3}>
                            <FormControl isRequired isInvalid={errors.start != null} width="30%" mr={3}>
                                <FormLabel>Start Date</FormLabel>
                                <Input 
                                    type="month"
                                    defaultValue={props.educationData?.start}
                                    {...register('start', {
                                        required: 'This is required'
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.start && errors.start.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={errors.end != null} width="30%">
                                <FormLabel>End Date</FormLabel>
                                <Input 
                                type="month"
                                defaultValue={props.educationData?.end!}
                                {...register('end')}
                                />
                                <FormErrorMessage>
                                    {errors.end && errors.end.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <FormControl mb={3}>
                            <FormLabel>About</FormLabel>
                            <Textarea 
                            placeholder='About' 
                            defaultValue={props.educationData?.about!}
                            height={150}
                            resize="none"
                            {...register('about')}
                            />
                        </FormControl>
                        <FormLabel>Certificate</FormLabel>
                        <Button leftIcon={<CgAttachment />} onClick={handleAttachmentClick}>Attach Certificate</Button>
                        <input
                            ref={attachmentInputRef}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {fileName && 
                            <HStack mt={2}>
                                <Text>Attached: {fileName}</Text>
                                <IconButton colorScheme="red" aria-label="Delete" icon={<FaTrash />} onClick={handleRemoveFile}/>
                            </HStack>}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>Save</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )    
}