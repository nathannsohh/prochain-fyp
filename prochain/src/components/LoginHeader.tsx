'use client'
import { Box, HStack, Spacer, Button } from "@chakra-ui/react"
import ProChainLogo from "../images/ProChainWithWords.png"
import Image from 'next/image'

interface LoginHeaderProps {
    metamaskIsInstalled: boolean,
}

export default function LoginHeader(props: LoginHeaderProps) {
    return(
         <Box 
            bg="#F6F6F6"
            paddingTop={3}
            paddingBottom={3}
            paddingLeft="8%"
            paddingRight="7%"
        >
            <HStack>
                <Image src={ProChainLogo} alt="ProChain logo" width={170}/>
                <Spacer />
                {
                    props.metamaskIsInstalled ? 
                    <Button variant='outline'>Connect Wallet</Button> :
                    <Button variant='outline'>Install Metamask</Button>
                }
            </HStack> 
        </Box>
    )
}