import { Box } from "@chakra-ui/react"
import Job from "./Job"

interface JobsProps {
    jobList: Array<number>
    selected: number,
    handleJobClick: (index: number) => void
}

export default function Jobs(props: JobsProps) {
    return (
        <Box>
           {
            props.jobList.map((job, index) => {
                return <Job selected={props.selected === index} index={index} handleJobClick={props.handleJobClick}/>
            })
           } 
        </Box>
    )
}