import { Box, Divider, HStack, Text, Button } from "@chakra-ui/react";
import Image from "next/image";
import LikeIcon from "@/images/like-icon.png"
import CommentIcon from "@/images/comment-icon.png"

const POST = {
    content: "Been quite the journey working on some groundbreaking stuff with the team at Aquaria and I'm absolutely thrilled to share that our founders have both been officially named members of the prestigious 2024 #Forbes30Under30 Class within the category of Energy! The recognition of our Atmospheric Water Generator technology is not just a win for us—it's a win for a more sustainable, eco-friendly future that we're passionately crafting. Let's make waves for a water-sufficient world! Here's to more innovation, collaboration, and positive change! #Sustainability #Innovation #TeamWork #EnvironmentalImpact #WaterSolutions #InnovateForGood #SustainableLiving",
    likedBy: [1,2,3],
    comments: [1,2,3]
}


export default function ProfilePost() {
    return (
        <Box fontSize="14px" mb={0} mt={2}>
            <Box pl={6} pr={6}>
                <Box cursor="pointer">
                    <HStack color="#616161" fontSize="15px" mb={1}>
                        <Text fontWeight="semibold" mr={1}>Bob Ross</Text>
                        <Text>5 Jan 2024</Text>
                    </HStack>
                    <Text noOfLines={3}>{POST.content}</Text>
                </Box>
                <HStack spacing={0} mt={3} fontSize="12px" mb={3}>
                    <Button variant="link">
                        <Image src={LikeIcon} alt="like icon" width={20}/>
                        <Text ml={1} fontSize="12px">3</Text>
                    </Button>
                    <Button variant="link" ml={3}>
                        <Image src={CommentIcon} alt="comment icon" width={20}/>
                        <Text ml={1} fontSize="12px">3</Text>
                    </Button>
                </HStack>
            </Box>
            <Divider borderColor="#C8C8C8" width="100%" pb={0}/>
        </Box>
    )
}