'use client'
import ProfileHead from "@/components/ProfileHead";
import ProfileNewPostModal from "@/components/ProfileNewPostModal";
import ProfilePostCard from "@/components/ProfilePostCard";
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserManagerContract";
import { Box, useDisclosure, useToast } from "@chakra-ui/react"
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DUMMY_DATA = {
    first_name: "John",
    last_name: "Doe",
    pronouns: "He/Him",
    email: "johndoe@gmail.com",
    wallet_address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    bio: "Final Year Computer Science Student studying at Nanyang Technological University.",
    location: "Singapore"
}

export default function ProfilePage() {
    const { state: { wallet, status } } = useMetamask();
    const router = useRouter()
    const userManagerContract: Contract | null = useUserManangerContract();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast()

    useEffect(() => {
        if (status === "idle") {
            if (wallet === null) router.push('/login')
            console.log(userManagerContract);
            userManagerContract?.doesUserExist().then((result) => {
                if (!result) {
                    router.push('/profile/new')
                }
            })
        }
    }, [wallet, status])

    const triggerToast = (title: string, description: string, status: "loading" | "info" | "warning" | "success" | "error" | undefined) => {
        toast({
            title: title,
            description: description,
            status: status,
            duration: 4000,
        })
    }

    return (
        <Box bg="#F6F6F6">
            <ProfileHead userData={DUMMY_DATA}/>
            <ProfilePostCard posts={[]} ownProfile={true} onNewPost={onOpen}/>
            <ProfileNewPostModal isOpen={isOpen} onClose={onClose} profileName={DUMMY_DATA.first_name + ' ' + DUMMY_DATA.last_name} triggerToast={triggerToast}/>
        </Box>
    )
}