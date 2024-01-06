import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, ModalCloseButton, Textarea, Avatar, HStack, Text, FormControl, FormErrorMessage, Input, FormLabel, Select, Spacer } from "@chakra-ui/react";
import { useEffect } from "react";
import axios from "axios";
import { useForm } from 'react-hook-form'
import { countryList, pronouns } from "@/util/constants";


interface EditProfileModalProps {
    isOpen: boolean,
    onClose: () => void,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void
    userData: UserType,
    updateUserData: (userData: UserType) => void
}

export default function EditProfileModal(props: EditProfileModalProps) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<UserType>()
    
    const submitHandler = async (values: UserType) => {
        try {
            const body = {...values, wallet_address: props.userData?.wallet_address!, content_hash: props.userData?.content_hash}
            if (Object.entries(body).toString() === Object.entries(props.userData!).toString()) {
                props.onClose() 
                return;
            }

            const response = await axios.put('http://localhost:8000/user', body)
            if (response.data.success) {
                props.updateUserData(body)
                props.onClose()
                props.triggerToast("Success", "Your profile has been updated.", "success")
            }
        } catch (e) {
            props.triggerToast("Error", "Something went wrong and your profile was not updated.", "error")
        }
    }

    return(
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent maxW="50%">
                <ModalHeader>Edit Profile Card</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(submitHandler)}>
                    <ModalBody>
                        <HStack width="100%" mb={3}>
                            <FormControl isRequired isInvalid={errors.first_name != null}>
                                <FormLabel>First Name</FormLabel>
                                <Input 
                                placeholder='First Name' 
                                defaultValue={props.userData?.first_name}
                                {...register('first_name', {
                                    required: 'This is required'
                                })}
                                />
                                <FormErrorMessage>
                                {errors.first_name && errors.first_name.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isRequired isInvalid={errors.last_name != null}>
                                <FormLabel>Last Name</FormLabel>
                                <Input 
                                placeholder='Last Name'
                                defaultValue={props.userData?.last_name}
                                {...register('last_name', {
                                    required: 'This is required'
                                })}
                                />
                                <FormErrorMessage>
                                {errors.last_name && errors.last_name.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <HStack width="100%" mb={3}>
                            <FormControl width="20%">
                                <FormLabel>Pronouns</FormLabel>
                                <Select 
                                placeholder='Pronouns'
                                defaultValue={props.userData?.pronouns === null ? undefined : props.userData!.pronouns!}
                                {...register('pronouns')}
                                >
                                    {pronouns.map((pronoun: string, index: number) => {
                                        return <option key={index} value={pronoun}>{pronoun}</option>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl width="20%">
                                <FormLabel>Location</FormLabel>
                                <Select
                                placeholder='Location'
                                defaultValue={props.userData?.location === null ? undefined : props.userData!.location!}
                                {...register('location')}
                                >
                                    {countryList.map((country: string, index: number) => {
                                        return <option key={index} value={country}>{country}</option>
                                    })}
                                </Select>
                            </FormControl>
                        </HStack>
                        <FormControl isRequired isInvalid={errors.email != null} width="60%" mb={3}>
                            <FormLabel>Email</FormLabel>
                            <Input 
                            placeholder='Email'
                            defaultValue={props.userData?.email}
                            {...register('email', {
                                required: 'This is required',
                                pattern: {
                                    value: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
                                    message: "Please key in a valid email address!"
                                }
                            })}
                            />
                            <FormErrorMessage>
                            {errors.email && errors.email.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Bio</FormLabel>
                            <Textarea 
                            placeholder='Bio' 
                            defaultValue={props.userData?.bio === null ? undefined : props.userData!.bio!}
                            resize="none"
                            {...register('bio')}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>Save</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )    
}