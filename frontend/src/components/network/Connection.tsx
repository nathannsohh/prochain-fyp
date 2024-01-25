import { Box, Avatar, HStack, VStack, Text, Divider, Spacer, IconButton, MenuButton, MenuList, MenuItem, Menu } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface ConnectionProps {
    user: UserDetails,
    removeConnection: (address: string) => void
}

export default function Connection(props: ConnectionProps) {
    const [isHovering, setIsHovering] = useState<boolean>(false)
    const router = useRouter()

    const onMouseEnterHandler = () => {
        setIsHovering(true)
    }

    const onMouseLeaveHandler = () => {
        setIsHovering(false)
    }

    const nameOnClickHandler = () => {
        router.push(`/profile/${props.user.address}`)
    }

    return (
        <Box>
            <HStack p={7} pt={3} pb={3}>
                <HStack onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler} onClick={nameOnClickHandler} _hover={{cursor: "pointer"}}>
                    <Avatar mr={2} src={`http://127.0.0.1:8080/ipfs/${props.user.profileImageHash}`}/>
                    <VStack alignItems="start" spacing={0}>
                        <Text fontWeight="semibold" fontSize={14} height={5} as={isHovering ? "u" : undefined}>{props.user.name}</Text>
                        <Text fontSize={13} color="#7D7D7D" height={5} as={isHovering ? "u" : undefined}>{props.user.bio}</Text>
                    </VStack>
                </HStack>
                <Spacer />
                <Menu>
                    <MenuButton as={IconButton} aria-label={"options"} icon={<BsThreeDots />} isRound variant="ghost"/>
                    <MenuList>
                        <MenuItem icon={<FaTrash />} onClick={() => props.removeConnection(props.user.address)}>Remove Connection</MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
            <Divider/>
        </Box>
    )
}