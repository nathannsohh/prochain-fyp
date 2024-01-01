'use client'

import ProChainWithWords from '@/images/ProChainWithWords.png'
import Image from 'next/image';
import { 
    Box, 
    VStack, 
    HStack, 
    Text, 
    Card, 
    CardHeader, 
    CardBody, 
    Heading, 
    Divider, 
    FormControl, 
    FormErrorMessage, 
    FormLabel, 
    Input, 
    Textarea, 
    Select, 
    Button, 
    Center 
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react';
import { useMetamask } from '@/hooks/useMetamask';
import { useRouter } from 'next/navigation';
import useUserManangerContract from '@/hooks/useUserManagerContract';
import axios from 'axios';
import { countryList, pronouns } from '@/util/constants';

type Inputs = {
    first_name: string,
    lastName: string,
    pronouns: string, 
    email: string,
    bio: string
}

export default function NewUser() {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<UserType>()

    const { state: { wallet, status } } = useMetamask()
    const router = useRouter()
    const userManagerContract = useUserManangerContract()

    useEffect(() => {
        if (status === "idle" && wallet === null) {
            router.push('/login')
        }
        handleUserExistence()
    }, [wallet, status])

    const handleUserExistence = async () => {
        try {
            const response: boolean = await userManagerContract!!.doesUserExist()
            if (response) {
                router.push('/profile')
            }
        } catch (e) {

        }
    }

    const onSubmit = async (values: UserType) => {
        let response;
        try {
            const body = {...values, walletAddress: wallet}
            response = await axios.post('http://localhost:8000/user', body)
            if (response.data.success) {
                await userManagerContract!.registerUser(response.data.hash.toString())
                setTimeout(() => {
                    router.push('/profile')
                }, 4000)
            }
        } catch (err) {
            if (response && response.data.success) {
                try {
                    await axios.delete(`http://localhost:8000/user/${response.data.hash}`)
                } catch (e) {
                    console.error(err);
                }
            }
            console.error(err)
        }
    }

    return (
        <Box bg="#F6F6F6" height="100vh">
            <Box pl="8%" pt={3}>
                <Image src={ProChainWithWords} alt="ProChain Logo" width={170}/>
            </Box>
            <Center>
                <VStack width="55%">
                    <Text fontSize='3xl' fontWeight="600" mt={5} mb={8}>🎉 Look's like you're new here! <br/> First, let's set up your profile.</Text>
                    <Card width="100%" p={2}>
                        <CardHeader>
                            <Heading fontSize="24px">New Profile</Heading>
                        </CardHeader>
                        <Divider />
                        <CardBody width="100%">
                            <form onSubmit={handleSubmit(onSubmit)}>
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
                                    <Button mt={5} width="40%" type="submit" isLoading={isSubmitting} colorScheme='blue'>Done</Button>
                                </Center>
                            </form>
                        </CardBody>
                    </Card>
                </VStack>
            </Center>
        </Box>
    )
}