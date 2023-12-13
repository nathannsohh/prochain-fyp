import { Box, VStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function IconButton(props) {
    const router = useRouter()

    const onClickHandler = () => {
        router.push(props.route)
    }

    return (
        <Box as='button' color="#5A5A5A" height="100%" width="85px" _hover={{color: '#000000'}} onClick={onClickHandler}>
            <VStack spacing={0} height="100%">
                <Box height="60%" mt={2}>
                    {props.icon}
                </Box>
                <Text fontSize="12" mb={1}>{props.label}</Text>
            </VStack>
        </Box>
    )
}