import { Badge, Box, Button, HStack, Heading, Icon, Text } from "@chakra-ui/react";
import { FaSuitcase } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";

export default function JobDescription() {
    return (
        <Box height="91vh" overflowY="scroll" p={5}>
           <Heading fontSize="23px" mb={1}>Frontend Engineer, Global CRM Engineering - 2024 Start</Heading>
           <Box fontSize={14}>
                <Text>TikTok</Text>
                <Text>Singapore</Text>
           </Box>
           <HStack mt={3}>
            <Icon as={FaSuitcase} boxSize={6} color="#666666" mr={1}/>
            <Badge colorScheme="green">Full-Time</Badge>
           </HStack>
           <HStack mt={2}>
            <Icon as={FaBuilding} boxSize={6} color="#666666" mr={1}/>
            <Text fontSize={14} colorScheme="green">Entertainment Providers</Text>
           </HStack>
           <Button colorScheme="blue" borderRadius={18} mt={6}>Apply</Button>

           <Box mt={7}>
            <Text fontSize={20} fontWeight="semibold">Job Description</Text>
            <Text fontSize={15}>
            TikTok is the leading destination for short-form mobile video. Our mission is to inspire creativity and bring joy. TikTok has global offices including Los Angeles, New York, London, Paris, Berlin, Dubai, Singapore, Jakarta, Seoul and Tokyo. 
<br /><br />
Why Join Us <br />
Creation is the core of TikTok's purpose. Our platform is built to help imaginations thrive. This is doubly true of the teams that make TikTok possible. 
Together, we inspire creativity and bring joy - a mission we all believe in and aim towards achieving every day. 
To us, every challenge, no matter how difficult, is an opportunity; to learn, to innovate, and to grow as one team. Status quo? Never. Courage? Always. 
At TikTok, we create together and grow together. That's how we drive impact - for ourselves, our company, and the communities we serve. 
Join us. <br /><br />

Team Introduction<br />
The goal of the Global CRM Engineering team is to build a stable, flexible and intelligent CRM platform for TikTok, improve commercialization efficiency and client satisfaction. The Singapore CRM engineering team is tasked with creating the revenue planning and forecasting modules within the CRM.
You'll work hands-on in a fast paced environment to create technical solutions and provide actionable recommendations for TikTok's proprietary CRM platform. You'll work alongside a global team of product managers located in TikTok's major markets to build innovative sales, marketing and analytics tools to increase user adoption and satisfaction.
<br /><br />
We are looking for talented individuals to join us in 2024. As a graduate, you will get unparalleled opportunities for you to kickstart your career, pursue bold ideas and explore limitless growth opportunities. Co-create a future driven by your inspiration with TikTok.
<br /><br />
Candidates can apply to a maximum of two positions and will be considered for jobs in the order you apply. The application limit is applicable to TikTok and its affiliates' jobs globally. Applications will be reviewed on a rolling basis - we encourage you to apply early.
<br /><br />
Responsibilities<br />
- Frontend development of TikTok's proprietary CRM platform.<br />
- Turn TikTok's proprietary CRM into an enterprise ready, market leading SaaS platform leveraging best practices from the industry.<br />
- Understand users' personalized requests and come up with scalable technical solutions. <br />
<br />
Qualifications<br />
<br />
 - Bachelor's degree or above in computer science or related fields.<br />
- Proficiency in Javascript, ES5/6, CSS.<br />
- Thorough understanding of at least one of the major frontend frameworks (React, Angular, Vue etc).<br />
- Good intuition about design is preferred.<br />
- Familiarity with CRM platforms and Ad Sales automated processes is a plus.<br />
<br />
TikTok is committed to creating an inclusive space where employees are valued for their skills, experiences, and unique perspectives. Our platform connects people from across the globe and so does our workplace. At TikTok, our mission is to inspire creativity and bring joy. To achieve that goal, we are committed to celebrating our diverse voices and to creating an environment that reflects the many communities we reach. We are passionate about this and hope you are too.
<br /><br />
By submitting an application for this role, you accept and agree to our global applicant privacy policy, which may be accessed here: https://careers.tiktok.com/legal/privacy.
<br /><br />
If you have any questions, please reach out to us at apac-earlycareers@tiktok.com

            </Text>
           </Box>
        </Box>
    )
}