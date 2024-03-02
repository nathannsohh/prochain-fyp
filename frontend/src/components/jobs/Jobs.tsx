import { Box } from "@chakra-ui/react"
import Job from "./Job"

interface JobsProps {
    jobList: Array<number>
    selected: number,
    handleJobClick: (index: number) => void,
    isOwnJob: boolean
}

export default function Jobs(props: JobsProps) {
    return (
        <Box>
           {
            props.jobList.map((job, index) => {
                return <Job key={index} selected={props.selected === index} index={index} handleJobClick={props.handleJobClick} job={job} isOwnJob={props.isOwnJob}/>
            })
           } 
        </Box>
    )
}