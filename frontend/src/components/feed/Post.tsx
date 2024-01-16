import { Card, CardBody, Avatar, HStack, VStack, Box, Text, Divider, Button, Spacer } from '@chakra-ui/react'
import { BiLike } from "react-icons/bi";
import { FaRegCommentAlt } from "react-icons/fa";
import { useRef, useEffect, useState } from 'react'

export default function Post() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState<Boolean>(false);
    const [isSeeMore, setIsSeeMore] = useState<Boolean>(false)

    useEffect(() => {
        const container = containerRef.current;
    
        if (container) {
            const isOverflowing = container.scrollHeight > container.clientHeight;
            setIsTruncated(isOverflowing);
        }
    }, []);

    const seeMoreHandler = () => {
        setIsSeeMore(prevState => !prevState)
    }
    
    return (
        <Card width="100%" mt={2} borderRadius="20px" pt={2} pb={1}>
            <CardBody pl={0} pr={0} pb={1}>
                <Box pl={7} pr={7} mb={3}>
                    <HStack>
                        <Avatar mr={2} height="55px" width="55px"/>
                        <VStack alignItems="start" spacing={0}>
                            <Text fontWeight="semibold" fontSize={14} height={5}>Nathan Soh</Text>
                            <Text fontSize={13} color="#7D7D7D" height={5}>Final Year Computer Science Student at Nanyang Technological University</Text>
                            <Text fontSize={13} color="#7D7D7D" height={5}>5d ago</Text>
                        </VStack>
                    </HStack>
                    <Text mt={3} noOfLines={isSeeMore ? undefined : 3} ref={containerRef}>
                        Top 4 reasons why data engineering is the best data profession:

                        1. highest pay for the least education
                        Machine learning engineers and data scientists make 10-15% more but spent 30% more time in college. Data analysts make less than data engineers but require less schooling.
                    </Text>
                    {isTruncated && !isSeeMore && <Button variant="link" onClick={seeMoreHandler}>See more...</Button>}
                    {isTruncated && isSeeMore && <Button variant="link" onClick={seeMoreHandler}>See less...</Button>}
                </Box>
                <Divider width="100%"/>
                <HStack pl={7} pr={7} mt={3}>
                    <Button leftIcon={<BiLike size={20} />} variant="ghost">13</Button>
                    <Button leftIcon={<FaRegCommentAlt size={20} />} variant='ghost'>14</Button>
                    <Spacer />
                </HStack>
            </CardBody>
        </Card>
    )
}