'use client'

import ProChainWithWords from '@/images/ProChainWithWords.png'
import Image from 'next/image';
import { 
    Box, 
    VStack,
    Text, 
    Card, 
    CardHeader, 
    CardBody, 
    Heading, 
    Divider,
    Center 
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useMetamask } from '@/hooks/useMetamask';
import { useRouter } from 'next/navigation';
import useUserFactoryContract from '@/hooks/useUserFactoryContract';
import axios from 'axios';
import { API_URL, DEFAULT_PROFILE_PIC_HASH, DEFAULT_PROFILE_BANNER_HASH } from '@/util/constants';
import NewUserProfileForm from '@/components/profile/NewUserProfileForm';

export default function NewUser() {

    const { state: { wallet, status } } = useMetamask()
    const router = useRouter()
    const userFactoryContract = useUserFactoryContract()

    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (status === "idle" && wallet === null) {
            router.push('/login')
        }
        handleUserExistence()
    }, [wallet, status])

    const handleUserExistence = async () => {
        try {
            const response: boolean = await userFactoryContract!!.doesUserExist(wallet)
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
            response = await axios.post(`${API_URL}/user`, body)
            if (response.data.success) {
                console.log(response.data.hash)
                setLoading(true)
                await userFactoryContract!.registerUser(response.data.hash, DEFAULT_PROFILE_PIC_HASH, DEFAULT_PROFILE_BANNER_HASH)
                
                while (await !userFactoryContract!.doesUserExist(wallet)) {
                    console.log("TEST")
                };
                router.push(`/profile/${wallet}`)
            }
        } catch (err) {
            if (response && response.data.success) {
                try {
                    await axios.delete(`${API_URL}/user/${response.data.hash}`)
                } catch (e) {
                    console.error(err);
                }
            }
            console.error(err)
        } finally {
            setLoading(false)
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
                            <NewUserProfileForm onSubmit={onSubmit} loading={loading}/>
                        </CardBody>
                    </Card>
                </VStack>
            </Center>
        </Box>
    )
}