import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, ModalCloseButton, Textarea, HStack, Text, FormControl, FormErrorMessage, Input, FormLabel, Select, Spacer, Center } from "@chakra-ui/react";
import axios from "axios";
import { useForm } from 'react-hook-form'
import { countryList, pronouns, API_URL, IPFS_URL } from "@/util/constants";
import ProfileHeadPreview from "./ProfileHeadPreview";
import { useEffect, useState } from "react";
import useUserFactoryContract from "@/hooks/useUserFactoryContract";
import { Contract } from "ethers";
import _ from "lodash";


interface EditProfileModalProps {
    isOpen: boolean,
    onClose: () => void,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void
    userData: UserType,
    updateUserData: (userData: UserType) => void,
    connections: Number | null
}

export default function EditProfileModal(props: EditProfileModalProps) {
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UserType>()
    const userFactoryContract: Contract | null = useUserFactoryContract()

    const [displayedUserData, setDisplayedUserData] = useState<UserType>(props.userData)
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
    const [newProfileBanner, setNewProfileBanner] = useState<File | null>(null)

    useEffect(() => {
        const subscription = watch((value: any) =>
            setDisplayedUserData({
                ...value,
                wallet_address: props.userData?.wallet_address!, 
                content_hash: props.userData?.content_hash,
                profile_banner_hash: props.userData?.profile_banner_hash,
                profile_picture_hash: props.userData?.profile_picture_hash
            }))
            return () => subscription.unsubscribe()
        }, [watch])

    const updateNewProfileImage = (image: File | null) => {
        setNewProfileImage(image)
    }

    const updateNewProfileBanner = (image: File | null) => {
        setNewProfileBanner(image)
    }

    const submitHandler = async (values: UserType) => {
        let showToast = false
        try {
            // handle update of user details
            let body: UserType = {
                ...values, 
                wallet_address: props.userData?.wallet_address!, 
                content_hash: props.userData?.content_hash,
                profile_picture_hash: props.userData?.profile_picture_hash,
                profile_banner_hash: props.userData?.profile_banner_hash,
            }
            
            if (!_.isEqual(body, props.userData)) {
                const response = await axios.put(`${API_URL}/user`, body)
                if (response.data.success) {
                    showToast = true
                    props.updateUserData(body)
                }
            }

            // handle update of profile picture
            if (newProfileImage && newProfileBanner) {
                let formData = new FormData();
                formData.append('file', newProfileImage);

                let response = await axios.post(`${IPFS_URL}/add`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                const profileImageHash = response.data.Hash;
                formData = new FormData();
                formData.append('file', newProfileBanner);
                
                response = await axios.post(`${IPFS_URL}/add`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                const profileHeaderHash = response.data.Hash;

                await userFactoryContract?.setProfileHeaderAndImageHash(props.userData.wallet_address, profileImageHash, profileHeaderHash);
                showToast = true
                body = {
                    ...body,
                    profile_banner_hash: profileHeaderHash,
                    profile_picture_hash: profileImageHash
                }
            } else {
                if (newProfileImage) {
                    const formData = new FormData();
                    formData.append('file', newProfileImage);
    
                    const response = await axios.post(`${IPFS_URL}/add`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    if (response.data.Hash) {
                        await userFactoryContract?.setProfileImageHash(props.userData.wallet_address, response.data.Hash)
                        showToast = true
                        body = {...body, profile_picture_hash: response.data.Hash}
                    }
                }
                // handle update of profile banner
                if (newProfileBanner) {
                    const formData = new FormData();
                    formData.append('file', newProfileBanner);
    
                    const response = await axios.post(`${IPFS_URL}/add`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    if (response.data.Hash) {
                        await userFactoryContract?.setProfileHeaderHash(props.userData.wallet_address, response.data.Hash)
                        showToast = true
                        body = {...body, profile_banner_hash: response.data.Hash}
                    }
                }
            }
            
            
            props.updateUserData(body)

            if (showToast) {
                props.triggerToast("Success", "Your profile has been updated.", "success")
            }
            props.onClose()
        } catch (e) {
            console.error(e)
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
                        <Center>
                            <Text fontWeight="semibold">Preview</Text>
                        </Center>
                        <Center mb={2}>
                            <ProfileHeadPreview 
                                userData={displayedUserData} 
                                connections={props.connections}
                                updateProfileImage={updateNewProfileImage}
                                updateProfileBanner={updateNewProfileBanner} 
                            />
                        </Center>
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