import { Box, Avatar, HStack, VStack, Text, Divider, Spacer, IconButton, MenuButton, MenuList, MenuItem, Menu } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";

export default function Connection() {
    return (
        <Box>
            <HStack p={7} pt={3} pb={3}>
                <Avatar mr={2}/>
                <VStack alignItems="start" spacing={0}>
                    <Text fontWeight="semibold" fontSize={14} height={5}>Ryan Sim</Text>
                    <Text fontSize={13} color="#7D7D7D" height={5}>Final year student @ NTU EEE</Text>
                </VStack>
                <Spacer />
                <Menu>
                    <MenuButton as={IconButton} aria-label={"options"} icon={<BsThreeDots />} isRound variant="ghost"/>
                    <MenuList>
                        <MenuItem icon={<FaTrash />}>Remove Connection</MenuItem>
                    </MenuList>
                </Menu>
            </HStack>
            <Divider/>
        </Box>
    )
}