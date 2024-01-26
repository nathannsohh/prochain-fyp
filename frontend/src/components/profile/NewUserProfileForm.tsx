import { countryList, pronouns } from "@/util/constants"
import { Button, Center, FormControl, FormErrorMessage, FormLabel, HStack, Input, Select, Textarea } from "@chakra-ui/react"
import { useForm } from "react-hook-form"

interface NewUserProfileFormProps {
    onSubmit: (values: UserType) => Promise<void>,
    loading: boolean
}

export default function NewUserProfileForm(props: NewUserProfileFormProps) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<UserType>()
    
    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <HStack width="100%" mb={3}>
                <FormControl isRequired isInvalid={errors.first_name != null}>
                    <FormLabel>First Name</FormLabel>
                    <Input 
                    placeholder='First Name' 
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
            <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea 
                placeholder='Bio' 
                resize="none"
                {...register('bio')}
                />
            </FormControl>
            <Center>
                <Button mt={5} width="40%" type="submit" isLoading={isSubmitting || props.loading} colorScheme='blue'>Done</Button>
            </Center>
        </form>
    )
}