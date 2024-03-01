import useJobFactoryContract from "@/hooks/useJobFactoryContract";
import { API_URL, countryList, employmentTypeList, jobLevelList } from "@/util/constants";
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { IoCreate } from "react-icons/io5";

interface NewJobModalProps {
    isOpen: boolean,
    onClose: () => void,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    onJobCreation: () => void
}

export default function NewJobModal(props: NewJobModalProps) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
      } = useForm<JobType>()

    const jobFactoryContract = useJobFactoryContract()
    
    const onSubmit = async (values: JobType) => {
        let response;
        try {
            response = await axios.post(`${API_URL}/jobs`, values)
            if (response.data.success) {
                await jobFactoryContract!.createJob(response.data.hash)
                props.triggerToast('Job Created!', "The job listing has been created but is not yet shown to the world! You may change this on the \"My Jobs\" page.", "success")
                props.onJobCreation()
                props.onClose()
            } else {
                props.triggerToast('Error', "An error occured. Please try again later.", "error")
            }
        } catch (err) {
            if (response && response.data.success) {
                try {
                    await axios.delete(`${API_URL}/jobs/${response.data.hash}`)
                } catch (e) {
                    console.error(e);
                    props.triggerToast('Error', "An error occured. Please try again later.", "error")
                }
            }
            console.error(err)
            props.triggerToast('Error', "An error occured. Please try again later.", "error")
            console.log(err)
        }
    }
    
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent maxW="40%">
                <ModalHeader>New Job Listing</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isRequired isInvalid={errors.job_title != null}>
                            <FormLabel htmlFor='name'>Job Title</FormLabel>
                            <Input
                            id='job_title'
                            placeholder='Job Title'
                            {...register('job_title', {
                                required: 'This is required',
                            })}
                            />
                            <FormErrorMessage>
                                {errors.job_title && errors.job_title.message}
                            </FormErrorMessage>
                        </FormControl>
                        <HStack mt={3} mb={3}>
                            <FormControl isRequired width="33%">
                                <FormLabel>Location</FormLabel>
                                <Select
                                placeholder='Location'
                                {...register('location')}
                                >
                                    {countryList.map((country: string, index: number) => {
                                        return <option key={index} value={country}>{country}</option>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl isRequired width="33%">
                                <FormLabel>Employment Type</FormLabel>
                                <Select
                                placeholder='Employment Type'
                                {...register('employment_type')}
                                >
                                    {employmentTypeList.map((country: string, index: number) => {
                                        return <option key={index} value={country}>{country}</option>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl isRequired width="33%">
                                <FormLabel>Experience level</FormLabel>
                                <Select
                                placeholder='Experience Level'
                                {...register('job_level')}
                                >
                                    {jobLevelList.map((country: string, index: number) => {
                                        return <option key={index} value={country}>{country}</option>
                                    })}
                                </Select>
                            </FormControl>
                        </HStack>
                        <FormControl isRequired isInvalid={errors.job_title != null} mb={3}>
                            <FormLabel htmlFor='name'>Job Description</FormLabel>
                            <Textarea
                            id='job_description'
                            placeholder='Enter the job description here'
                            height="450px"
                            resize={"none"}
                            {...register('job_description', {
                                required: 'This is required',
                            })}
                            />
                            <FormErrorMessage>
                                {errors.job_description && errors.job_description.message}
                            </FormErrorMessage>
                        </FormControl>
                        <Button leftIcon={<IoCreate />} colorScheme="blue" type="submit" isLoading={isSubmitting}>Create Listing</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}