import { Card, CardBody, Box, Flex } from "@chakra-ui/react";
import Verification from "./Verification";
import { useEffect, useState } from "react";
import VerificationDetails from "./VerificationDetails";
import { getDetailsFromUserAddress } from "@/util/user_util";
import axios from "axios";
import { API_URL, THE_GRAPH_URL } from "@/util/constants";
import { getArrayOfJobExperience } from "@/util/util";
import { useMetamask } from "@/hooks/useMetamask";

export default function VerifyCard() {
    const { state: { wallet } } = useMetamask();
    const [selected, setSelected] = useState<number>(0)
    const [verifications, setVerifications] = useState<Verification[]>([])
    
    const handleJobClick = (index: number) => {
        setSelected(index)
    }

    const getVerifications = async () => {
        const graphqlQuery = {
            "operationName": "getJobExperiences",
            "query": `query getJobExperiences {
                         jobExperiences (
                            where: { orgAddress: "${wallet}" status: "0" }, 
                        ) { id, orgAddress, status, jobExpHash, owner } }`,
            "variables": {}
        }
        try {
            const jobExp = await axios.post(`${THE_GRAPH_URL}/jobExp`, graphqlQuery)
            const expHashes = getArrayOfJobExperience(jobExp.data.data.jobExperiences)
            let userHashes = []
            for (const exp of jobExp.data.data.jobExperiences) {
                console.log(exp)
                userHashes.push(`"${exp.owner}"`)
            }
            const jobExpResult = await axios.get(`${API_URL}/experience/[${expHashes}]`)
            let jobExpDetails: Map<string, any> = new Map<string, any>()
            for (const exp of jobExpResult.data.experiences) {
                jobExpDetails.set(exp.content_hash, exp)
            }
            const userDetails = await getDetailsFromUserAddress(userHashes)
            console.log(userDetails)

            const consolidatedJobExp: Verification[] = jobExp.data.data.jobExperiences.map((exp: any) => {
                return {
                    id: exp.id,
                    start: jobExpDetails.get(exp.jobExpHash).start,
                    end: jobExpDetails.get(exp.jobExpHash).end,
                    title: jobExpDetails.get(exp.jobExpHash).title,
                    about: jobExpDetails.get(exp.jobExpHash).about,
                    type: jobExpDetails.get(exp.jobExpHash).type,
                    user_image_hash: userDetails!.get(exp.owner)?.profileImageHash,
                    user_name: userDetails!.get(exp.owner)?.name,
                    user_address: userDetails!.get(exp.owner)?.address,
                    status: exp.status,
                    content_hash: exp.jobExpHash
                }
            })

            consolidatedJobExp.sort((a: any, b: any) => {
                const dateA = new Date(a.start) as any;
                const dateB = new Date(b.start) as any;
            
                return dateB - dateA;
            });
            console.log(consolidatedJobExp)
            setVerifications(consolidatedJobExp)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getVerifications();
    }, [wallet])

    return (
        <Box flex={1} height="91vh">
            <Card height="100%">
                <CardBody p={0} height="100%">
                    <Flex>
                        <Box width="42%" height="84vh" display="block" overflowY="scroll">
                            {verifications.map((verification, index) => {
                                return <Verification verification={verification} selected={selected === index} handleJobClick={handleJobClick} isOwnJob={false} index={index}/>
                            })}
                            
                        </Box>
                        <Box width="58%">
                            {verifications.length > 0 && <VerificationDetails verification={verifications[selected]} onRejectOrUpdate={() => {
                                setTimeout(async () => {
                                    await getVerifications()
                                }, 2000)
                            }}/>}
                        </Box>
                    </Flex>
                </CardBody>
            </Card>
        </Box>
    )
}