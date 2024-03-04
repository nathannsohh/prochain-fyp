import { getArrayOfDetailsFromUserAddress } from "@/util/user_util";
import { Box, HStack, IconButton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import Applicant from "./Applicant";

interface ApplicantsProps {
    onBack: () => void,
    applicants: string[]
}

export default function Applicants(props: ApplicantsProps) {
    const [users, setUsers] = useState<UserDetails[]>([])

    const formatAddressArray = (addresses: string[]): string[] => {
        const formatted = addresses.map((address) => `"${address}"`)
        console.log(formatted)
        return formatted
    }

    useEffect(() => {
        const formattedAddresses = formatAddressArray(props.applicants)
        getArrayOfDetailsFromUserAddress(formattedAddresses).then((userDetails) => {
            setUsers(userDetails!)
        })
    }, [])

    return (
        <Box>
            <HStack>
                <IconButton aria-label={"Back"} icon={<IoMdArrowBack />} onClick={props.onBack}/>
                <Text ml={5} fontSize={22} fontWeight="600">Applicants</Text>
            </HStack>
            {users.length > 0 && users.map((user) => {
                return <Applicant user={user}/>
            })}
        </Box>
    )
}