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
import { useListen } from '@/hooks/useListen';
import { useMetamask } from '@/hooks/useMetamask';
import { useRouter } from 'next/navigation';
import useUserManangerContract from '@/hooks/useUserManagerContract';

type Inputs = {
    firstName: string,
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
    } = useForm<Inputs>()

    const listen = useListen()
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

    function onSubmit(values: Inputs) {
        console.log(values);
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
                                <HStack width="100%">
                                    <FormControl isRequired isInvalid={errors.firstName != null}>
                                        <FormLabel>First Name</FormLabel>
                                        <Input 
                                        placeholder='First Name' 
                                        {...register('firstName', {
                                            required: 'This is required'
                                        })}
                                        />
                                        <FormErrorMessage>
                                        {errors.firstName && errors.firstName.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                    <FormControl isRequired isInvalid={errors.lastName != null}>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input 
                                        placeholder='Last Name'
                                        {...register('lastName', {
                                            required: 'This is required'
                                        })}
                                        />
                                        <FormErrorMessage>
                                        {errors.lastName && errors.lastName.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </HStack>
                                <HStack width="100%">
                                    <FormControl width="20%">
                                        <FormLabel>Pronouns</FormLabel>
                                        <Select 
                                        placeholder='Pronouns'
                                        {...register('pronouns')}
                                        >
                                            <option value='He/Him'>He/Him</option>
                                            <option value='He/Him'>She/Her</option>
                                            <option value='He/Him'>They/Them</option>
                                            <option value='NA'>Not Applicable</option>
                                        </Select>
                                    </FormControl>
                                    <FormControl isRequired isInvalid={errors.email != null}>
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
                                </HStack>
                                <FormControl>
                                    <FormLabel>Bio</FormLabel>
                                    <Textarea 
                                    placeholder='Bio' 
                                    resize="none"
                                    {...register('bio')}
                                    />
                                </FormControl>
                                <Center>
                                    <Button mt={5} width="40%" type="submit" isLoading={isSubmitting}>Done</Button>
                                </Center>
                            </form>
                        </CardBody>
                    </Card>
                </VStack>
            </Center>
        </Box>
    )
}