import useJobFactoryContract from "@/hooks/useJobFactoryContract";
import { API_URL, countryList, employmentTypeList, jobLevelList } from "@/util/constants";
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaSave } from "react-icons/fa";

interface EditJobModalProps {
    isOpen: boolean,
    onClose: () => void,
    triggerToast: (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => void,
    updateJob: () => void,
    job: any
}

export default function EditJobModal(props: EditJobModalProps) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
      } = useForm<JobType>()
    
    const onSubmit = async (values: JobType) => {
        let response;
        try {
            response = await axios.put(`${API_URL}/jobs`, {...values, hash: props.job.hash})
            if (response.data.success) {
                props.triggerToast('Job Updated!', "The job listing has been upated!", "success")
                props.updateJob()
                props.onClose()
            } else {
                props.triggerToast('Error', "An error occured. Please try again later.", "error")
            }
        } catch (err) {
            props.triggerToast('Error', "An error occured. Please try again later.", "error")
            console.log(err)
        }
    }
    
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent maxW="40%">
                <ModalHeader>Edit Job Listing</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isRequired isInvalid={errors.job_title != null}>
                            <FormLabel htmlFor='name'>Job Title</FormLabel>
                            <Input
                            id='job_title'
                            placeholder='Job Title'
                            defaultValue={props.job.job_title}
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
                                defaultValue={props.job.location}
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
                                defaultValue={props.job.employment_type}
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
                                defaultValue={props.job.job_level}
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
                            defaultValue={props.job.job_description}
                            {...register('job_description', {
                                required: 'This is required',
                            })}
                            />
                            <FormErrorMessage>
                                {errors.job_description && errors.job_description.message}
                            </FormErrorMessage>
                        </FormControl>
                        <Button leftIcon={<FaSave />} colorScheme="blue" type="submit" isLoading={isSubmitting}>Save</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}