import { Box } from "@chakra-ui/react"
import Job from "./Job"

const JOBLIST = [1,2,3,4,5,6,7,8,9,10,1,1,1,1,1,1,1,1,1,1,1,1]

export default function Jobs() {
    return (
        <Box>
           {
            JOBLIST.map((job) => {
                return <Job />
            })
           } 
        </Box>
    )
}