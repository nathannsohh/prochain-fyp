import { useMetamask } from '@/hooks/useMetamask';
import useProCoinTokenContract from '@/hooks/useProCoinTokenContract';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    Box,
    VStack,
    Text,
    Button,
    Spinner,
    useDisclosure
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { IoWallet } from "react-icons/io5";

interface WalletPopoverProps {
    wallet: string
}


export default function WalletPopover(props: WalletPopoverProps) {
    const { dispatch } = useMetamask();
    const proCoinTokenContract = useProCoinTokenContract()
    const [loading, setLoading] = useState<boolean>(false)
    const [prcValue, setPrcValue] = useState<number>(0)
    const { isOpen, onToggle, onClose } = useDisclosure()

    
    const getPrcValue = async () => {
        try {
            setLoading(true)
            const val = await proCoinTokenContract!.balanceOf(props.wallet)
            setPrcValue(val)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleAddPrc = async () => {
        dispatch({ type: "loading" });
    
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
              symbol: "PRC",
              decimals: 18,
              image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=023",
            },
          },
        });
        dispatch({ type: "idle" });
      };

    useEffect(() => {
        if (isOpen) getPrcValue()
    }, [isOpen])

    return (
        <Popover placement='bottom-start'>
            <PopoverTrigger>
                <Box as='button' color="#5A5A5A" height="100%" width="85px" _hover={{color: '#000000'}} onClick={onToggle}>
                    <VStack spacing={0} height="100%">
                        <Box height="60%" mt={2}>
                            <IoWallet size={25}/>
                        </Box>
                        <Text fontSize="12" mb={1} width="100%">Wallet</Text>
                    </VStack>
                </Box>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>Wallet Details</PopoverHeader>
                <PopoverBody>
                    {
                        loading ? 
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                      /> : 
                      <>
                        <Text mb={2} fontWeight="semibold">PRC Balance: {Number(prcValue)}</Text>
                        <Button onClick={handleAddPrc} colorScheme='blue'>Add PRC to Metamask</Button> 
                      </>
                    }
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}