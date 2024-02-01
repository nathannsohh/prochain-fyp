import { countryList, industries } from "@/util/constants"
import { Button, Center, FormControl, FormErrorMessage, FormLabel, HStack, Input, Select, Textarea } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

interface NewOrganisationProfileFormProps {
    onSubmit: (values: OrganisationType) => Promise<void>,
    loading: boolean
}

export default function NewOrganisationProfileForm(props: NewOrganisationProfileFormProps) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<OrganisationType>()
    
    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <HStack width="100%" mb={3}>
                <FormControl isRequired isInvalid={errors.company_name != null}>
                    <FormLabel>Company Name</FormLabel>
                    <Input 
                    placeholder='Company Name' 
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
            <Center>
                <Button mt={5} width="40%" type="submit" isLoading={isSubmitting || props.loading} colorScheme='blue'>Done</Button>
            </Center>
        </form>
    )
}
