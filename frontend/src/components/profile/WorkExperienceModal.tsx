import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter, Button, ModalCloseButton, Textarea, HStack, Text, FormControl, FormErrorMessage, Input, FormLabel, Select, Spacer, Center, IconButton, Avatar, VStack, Flex, Box } from "@chakra-ui/react";
import axios from "axios";
import { useForm } from 'react-hook-form'
import { API_URL, employmentTypeList } from "@/util/constants";
import { ChangeEvent, useState } from "react";
import _ from "lodash";
import useJobExperienceFactoryContract from "@/hooks/useJobExperienceFactoryContract";
import { ethers } from "ethers";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    Item,
  } from "@choc-ui/chakra-autocomplete";
import { getDetailsFromOrgAddress } from "@/util/user_util";

interface WorkExperienceModalProps {
    isOpen: boolean,
    onClose: () => void,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    updateWorkExperience: () => Promise<void>,
    workExperienceData: WorkExperience | null
}

interface SearchResult {
    company_name: string,
    profile_image_hash: string,
    address: string
}

export default function WorkExperienceModal(props: WorkExperienceModalProps) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<WorkExperienceType>()

    const [companyNameVal, setCompanyNameVal] = useState<string>(props.workExperienceData === null ? "" : props.workExperienceData.company_name)
    const [orgAddress, setOrgAddress] = useState<string>(props.workExperienceData === null ? ethers.ZeroAddress : props.workExperienceData.company_address)
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [searchLoading, setSearchLoading] = useState<boolean>(false)

    const jobExperienceFactoryContract = useJobExperienceFactoryContract()

    const onChangeHandler = async (event: ChangeEvent<HTMLInputElement>) => {
        setCompanyNameVal(event.target.value)
        setOrgAddress(ethers.ZeroAddress)
        if (event.target.value.length === 0) return
        try {
            setSearchLoading(true)
            const res = await axios.get(`${API_URL}/organisation/query/${event.target.value}`)
            if (res.data.success && res.data.orgs.length > 0) {
                let addresses = []
                for (const org of res.data.orgs) {
                    addresses.push(`"${org.wallet_address}"`)
                }
                const orgDetails = await getDetailsFromOrgAddress(addresses)
                
                let searchResults = []
                for (const org of res.data.orgs) {
                    searchResults.push({
                        company_name: org.company_name,
                        address: org.wallet_address,
                        profile_image_hash: orgDetails!.get(org.wallet_address)!.profileImageHash
                    })
                }
                setSearchResults(searchResults)
            } else {
                setSearchResults([])
            }
        } catch (e) {
            console.error(e) 
        } finally {
            setSearchLoading(false)
        }
    }

    const onOptionClickHandler = (value: SearchResult) => {
        setCompanyNameVal(value.company_name)
        setOrgAddress(value.address)
    }

    const submitHandler = async (values: WorkExperienceType) => {
        values.start = values.start.concat("-01")
        if (values.end !== "") {
            values.end = values.end!.concat("-01")
        } else {
            values.end = null
        }
        values.company_name = companyNameVal;
        try {
            if (props.workExperienceData === null) {
                const response = await axios.post(`${API_URL}/experience`, values)
                if (response.data.success) {
                    await jobExperienceFactoryContract!.createJobExperience(response.data.hash, orgAddress)
                    props.updateWorkExperience()
                    props.triggerToast("Success", "This work experience has been added!", "success")
                }
            } else {
                const body = {
                    ...values,
                    hash: props.workExperienceData.content_hash
                }
                const response = await axios.put(`${API_URL}/experience`, body)
                if (response.data.success) {
                    if (orgAddress != props.workExperienceData.company_address) {
                        await jobExperienceFactoryContract?.updateOrgAddress(Number(props.workExperienceData.id), orgAddress)
                    } else {
                        await jobExperienceFactoryContract!.unverifyExperience(Number(props.workExperienceData.id))
                    }
                    props.updateWorkExperience()
                    props.triggerToast("Success", "This work experience has been updated!", "success")
                }
            }
            props.onClose()   
        } catch (e) {
            console.error(e)
            props.triggerToast("Error", "Something went wrong. Please try again later.", "error")
        }
    }

    return(
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent maxW="50%">
                <ModalHeader>Add Work Experience</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
                    <ModalBody>
                        <FormControl isRequired isInvalid={errors.company_name != null} mb={3}>
                            <FormLabel>Company</FormLabel>
                            <AutoComplete 
                            emptyState={false} 
                            onSelectOption={(item: {
                                item: Item;
                                selectMethod: "mouse" | "keyboard" | null;
                                isNewInput?: boolean | undefined; }) => { console.log(item); onOptionClickHandler(item.item.originalValue) }}
                            maxSuggestion={5} 
                            >
                                <AutoCompleteInput 
                                    placeholder='Company Name'
                                    value={companyNameVal}
                                    {...register('company_name', {
                                        required: 'This is required'
                                    })}
                                    onChange={onChangeHandler}
                                />
                                <AutoCompleteList>
                                    {searchResults.map((res, index) => 
                                    <AutoCompleteItem key={index} value={res}>
                                        <Avatar size="sm" src={`http://127.0.0.1:8080/ipfs/${res.profile_image_hash}`} />
                                        <Box ml={4}>
                                            <Text fontSize={15}>{res.company_name}</Text>
                                            <Text fontSize={12}>{res.address}</Text>
                                        </Box>
                                    </AutoCompleteItem>)
                                    }
                                </AutoCompleteList>
                            </AutoComplete>
                            <FormErrorMessage>
                                {errors.company_name && errors.company_name.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired isInvalid={errors.title != null} mb={3}>
                            <FormLabel>Title</FormLabel>
                            <Input 
                            placeholder='Job Title' 
                            defaultValue={props.workExperienceData?.title}
                            {...register('title', {
                                required: 'This is required'
                            })}
                            />
                            <FormErrorMessage>
                                {errors.title && errors.title.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl width="40%" mb={3} isRequired>
                            <FormLabel>Employment Type</FormLabel>
                            <Select 
                            placeholder='Employment Type'
                            defaultValue={props.workExperienceData?.type}
                            {...register('type', {
                                required: 'This is required'
                            })}
                            >
                                {employmentTypeList.map((pronoun: string, index: number) => {
                                    return <option key={index} value={pronoun}>{pronoun}</option>
                                })}
                            </Select>
                        </FormControl>
                        <HStack mb={3}>
                            <FormControl isRequired isInvalid={errors.start != null} width="30%" mr={3}>
                                <FormLabel>Start Date</FormLabel>
                                <Input 
                                    type="month"
                                    defaultValue={props.workExperienceData?.start}
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
                                defaultValue={props.workExperienceData?.end!}
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
                            defaultValue={props.workExperienceData?.about!}
                            height={150}
                            resize="none"
                            {...register('about')}
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