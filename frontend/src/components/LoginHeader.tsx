'use client'
import { Box, HStack, Spacer, Button } from "@chakra-ui/react"
import ProChainLogo from "../images/ProChainWithWords.png"
import Image from 'next/image'
import Link from "next/link";

interface LoginHeaderProps {
    metamaskIsInstalled: boolean,
    handleConnect: () => void
}

export default function LoginHeader(props: LoginHeaderProps) {
    return(
         <Box 
            bg="#F6F6F6"
            paddingTop={3}
            paddingBottom={3}
            paddingLeft="8%"
            paddingRight="8%"
            position="absolute"
            width="100%"
        >
            <HStack>
                <Image src={ProChainLogo} alt="ProChain logo" width={170}/>
                <Spacer />
                {
                    props.metamaskIsInstalled ? 
                    <Button variant='outline' onClick={props.handleConnect}>Connect Wallet</Button> :
                    <Link href="https://metamask.io/download/">
                        <Button variant='outline'>Install Metamask</Button>
                    </Link>
                }
            </HStack> 
        </Box>
    )
}