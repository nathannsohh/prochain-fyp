import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, ModalCloseButton, Textarea, HStack, Text, FormControl, FormErrorMessage, Input, FormLabel, Select, Spacer, Center } from "@chakra-ui/react";
import axios from "axios";
import { useForm } from 'react-hook-form'
import { countryList, API_URL, IPFS_URL, industries } from "@/util/constants";
import ProfileHeadPreview from "./ProfileHeadPreview";
import { useEffect, useState } from "react";
import useUserFactoryContract from "@/hooks/useUserFactoryContract";
import { Contract } from "ethers";
import _ from "lodash";
import OrgProfileHeadPreview from "./OrgProfileHeadPreview";


interface EditOrgProfileModalProps {
    isOpen: boolean,
    onClose: () => void,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void
    orgData: OrganisationType,
    updateOrgData: (orgData: OrganisationType) => void,
    followers: Number | null
}

export default function EditOrgProfileModal(props: EditOrgProfileModalProps) {
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<OrganisationType>()
    const userFactoryContract: Contract | null = useUserFactoryContract()

    const [displayedOrgData, setDisplayedOrgData] = useState<OrganisationType>(props.orgData)
    const [newProfileImage, setNewProfileImage] = useState<File | null>(null)
    const [newProfileBanner, setNewProfileBanner] = useState<File | null>(null)

    useEffect(() => {
        const subscription = watch((value: any) =>
            setDisplayedOrgData({
                ...value,
                wallet_address: props.orgData?.wallet_address!, 
                content_hash: props.orgData?.content_hash,
                profile_banner_hash: props.orgData?.profile_banner_hash,
                profile_picture_hash: props.orgData?.profile_picture_hash
            }))
            return () => subscription.unsubscribe()
        }, [watch])

    const updateNewProfileImage = (image: File | null) => {
        setNewProfileImage(image)
    }

    const updateNewProfileBanner = (image: File | null) => {
        setNewProfileBanner(image)
    }

    const submitHandler = async (values: OrganisationType) => {
        let showToast = false
        try {
            // handle update of user details
            let body: OrganisationType = {
                ...values, 
                wallet_address: props.orgData?.wallet_address!, 
                content_hash: props.orgData?.content_hash,
                profile_picture_hash: props.orgData?.profile_picture_hash,
                profile_banner_hash: props.orgData?.profile_banner_hash,
            }
            
            if (!_.isEqual(body, props.orgData)) {
                const response = await axios.put(`${API_URL}/organisation`, body)
                if (response.data.success) {
                    showToast = true
                    props.updateOrgData(body)
                }
            }

            // handle update of profile picture
            if (newProfileImage) {
                const formData = new FormData();
                formData.append('file', newProfileImage);

                const response = await axios.post(`${IPFS_URL}/add`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (response.data.Hash) {
                    await userFactoryContract?.setOrgProfileImageHash(props.orgData.wallet_address, response.data.Hash)
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
                    await userFactoryContract?.setOrgProfileHeaderHash(props.orgData.wallet_address, response.data.Hash)
                    showToast = true
                    body = {...body, profile_banner_hash: response.data.Hash}
                }
            }
            props.updateOrgData(body)

            if (showToast) {
                props.triggerToast("Success", "Your profile has been updated.", "success")
            }
            props.onClose()
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
                        <Center>
                            <Text fontWeight="semibold">Preview</Text>
                        </Center>
                        <Center mb={2}>
                            <OrgProfileHeadPreview 
                                orgData={displayedOrgData} 
                                followers={props.followers}
                                updateProfileImage={updateNewProfileImage}
                                updateProfileBanner={updateNewProfileBanner} 
                            />
                        </Center>
                        <HStack width="100%" mb={3}>
                            <FormControl isRequired isInvalid={errors.company_name != null}>
                                <FormLabel>Company Name</FormLabel>
                                <Input 
                                placeholder='Company Name' 
                                defaultValue={props.orgData.company_name}
                                {...register('company_name', {
                                    required: 'This is required'
                                })}
                                />
                                <FormErrorMessage>
                                {errors.company_name && errors.company_name.message}
                                </FormErrorMessage>
                            </FormControl>
                        </HStack>
                        <HStack width="100%" mb={3}>
                            <FormControl isRequired isInvalid={errors.industry != null} width="40%">
                                <FormLabel>Industry</FormLabel>
                                <Select 
                                placeholder='Industry'
                                defaultValue={props.orgData.industry}
                                {...register('industry')}
                                >
                                    {industries.map((pronoun: string, index: number) => {
                                        return <option key={index} value={pronoun}>{pronoun}</option>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl width="30%">
                                <FormLabel>Location</FormLabel>
                                <Select
                                placeholder='Location'
                                defaultValue={props.orgData.location!}
                                {...register('location')}
                                >
                                    {countryList.map((country: string, index: number) => {
                                        return <option key={index} value={country}>{country}</option>
                                    })}
                                </Select>
                            </FormControl>
                        </HStack>
                        <FormControl isRequired isInvalid={errors.email != null} mb={3}>
                            <FormLabel>Email</FormLabel>
                            <Input 
                            placeholder='Email'
                            defaultValue={props.orgData.email}
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
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>Save</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )    
}