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
    Center,
    Button
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useMetamask } from '@/hooks/useMetamask';
import { useRouter } from 'next/navigation';
import useUserFactoryContract from '@/hooks/useUserFactoryContract';
import axios from 'axios';
import { API_URL, DEFAULT_PROFILE_PIC_HASH, DEFAULT_PROFILE_BANNER_HASH, DEFAULT_ORGANISATION_PROFILE_PIC_HASH } from '@/util/constants';
import NewUserProfileForm from '@/components/profile/NewUserProfileForm';
import NewOrganisationProfileForm from '@/components/profile/NewOrganisationProfileForm';

export default function NewUser() {

    const { state: { wallet, status } } = useMetamask()
    const router = useRouter()
    const userFactoryContract = useUserFactoryContract()

    const [isUser, setIsUser] = useState<boolean>(true)
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
                router.push(`/profile/${wallet}`)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const onSubmit = async (values: UserType) => {
        let response;
        try {
            const body = {...values, walletAddress: wallet}
            response = await axios.post(`${API_URL}/user`, body)
            if (response.data.success) {
                setLoading(true)
                await userFactoryContract!.registerUser(response.data.hash, DEFAULT_PROFILE_PIC_HASH, DEFAULT_PROFILE_BANNER_HASH)
                let userExists = await userFactoryContract!.doesWalletExist(wallet)
                while (!userExists) {
                    userExists = await userFactoryContract!.doesWalletExist(wallet)
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

    const onOrganisationSubmit = async (values: OrganisationType) => {
        let response;
        try {
            const body = {...values, wallet_address: wallet, bio: ""}
            response = await axios.post(`${API_URL}/organisation`, body)
            if (response.data.success) {
                setLoading(true)
                await userFactoryContract!.registerOrganisation(response.data.hash, DEFAULT_ORGANISATION_PROFILE_PIC_HASH, DEFAULT_PROFILE_BANNER_HASH)
                let orgExists = await userFactoryContract!.doesWalletExist(wallet)
                while (!orgExists) {
                    orgExists = await userFactoryContract!.doesWalletExist(wallet)
                };
                router.push(`/profile/${wallet}`)
            }
        } catch (err) {
            if (response && response.data.success) {
                try {
                    await axios.delete(`${API_URL}/organisation/${response.data.hash}`)
                } catch (e) {
                    console.error(err);
                }
            }
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const toggleForm = () => {
        setIsUser(prevState => !prevState)
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
                            {isUser ? <NewUserProfileForm onSubmit={onSubmit} loading={loading}/> : <NewOrganisationProfileForm onSubmit={onOrganisationSubmit} loading={loading}/>}
                        </CardBody>
                    </Card>
                    <Button variant='link' colorScheme='gray' mt={3} fontSize={15} onClick={toggleForm}>{isUser ? "Register as ProChain Business account" : "Register as ProChain User account"}</Button>
                </VStack>
            </Center>
        </Box>
    )
}