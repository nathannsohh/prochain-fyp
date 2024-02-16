import { Box, Icon, HStack, Input, InputGroup, InputLeftElement, Spacer } from "@chakra-ui/react";
import Image from 'next/image'
import ProChainLogo from '@/images/ProChainWithNoWords.png'
import { FiSearch } from "react-icons/fi";
import { AiFillHome } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoNotificationsSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import RoutingButton from './RoutingButton.js'
import WalletPopover from "./WalletPopover";

interface MainHeaderProps {
    wallet: string,
    isOrganisation: Boolean | null
}

export default function MainHeader(props: MainHeaderProps) {

    return (
        <Box 
            bg="#FFFFFF"
            borderBottom="1px"
            borderColor="#DDDCDC"
            display="grid"
            position="fixed"
            width= "100%"
            minWidth="100%"
            zIndex={1000}
        >
            <HStack>
                <Spacer />
                <HStack spacing={0} width="950px">
                    <HStack mt={2} mb={2}>
                        <Image src={ProChainLogo} alt="ProChain logo" width={35}/>
                        <InputGroup ml={2}>
                            <InputLeftElement>
                                <FiSearch />
                            </InputLeftElement>
                            <Input variant="filled" maxWidth={350} minWidth={100} placeholder='Search' height={10}/>
                        </InputGroup>
                    </HStack>
                    <Spacer />
                    <RoutingButton icon={<AiFillHome size={25}/>} label="Home" route="/feed"/>
                    {!props.isOrganisation && <RoutingButton icon={<FaUserFriends size={26}/>} label="My Network" route="/network"/>}
                    <RoutingButton icon={<BsFillSuitcaseLgFill size={25}/>} label="Jobs" route="/jobs"/>
                    {/* {/* <RoutingButton icon={<BiSolidMessageDetail size={25}/>} label="Messages" route="/feed"/> */}
                    <WalletPopover wallet={props.wallet}/>
                    <RoutingButton icon={<FaUserCircle size={25}/>} label="Me" route={`/profile/${props.wallet}`}/>
                </HStack> 
                <Spacer />
            </HStack>
        </Box>
    )
}