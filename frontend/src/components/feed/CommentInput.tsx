import { HStack, Avatar, Button, Box } from '@chakra-ui/react'
import { useState } from 'react'
import { AutoResizeTextarea } from './AutoResizeTextarea'

interface CommentInputProps {
    profileImageHash: string,
    onComment: (comment: string) => Promise<void>
}

export default function CommentInput(props: CommentInputProps) {
    const [commentValue, setCommentValue] = useState<string>("")
    const [disableButton, setDisableButton] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)

    const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentValue(event.target.value)
        setDisableButton(event.target.value.length === 0)
    }

    const onComment = async () => {
        setLoading(true)
        await props.onComment(commentValue)
        setCommentValue("")
        setLoading(false)
    }

    return (
        <Box pl={7} pr={7} mt={4} mb={6}>
            <HStack mb={3}>
                <Avatar size="sm" src={`http://127.0.0.1:8080/ipfs/${props.profileImageHash}`}/>
                <AutoResizeTextarea placeholder="Leave your comment here" value={commentValue} onChange={onChangeHandler} borderRadius="18px"/>
            </HStack>
            <Button size="sm" colorScheme='blue' isDisabled={disableButton} onClick={onComment} isLoading={loading}>Comment</Button>
        </Box>
    )
}