'use client'
import ConnectionsCard from "@/components/network/ConnectionsCard";
import RequestCard from "@/components/network/RequestCard";
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserFactoryContract";
import { getArrayOfDetailsFromUserAddress, getUserConnectionDetails } from "@/util/user_util";
import { Box } from "@chakra-ui/react"
import { Contract } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NetworkPage() {
    const { state: { wallet, status } } = useMetamask();
    const [pendingConnections, setPendingConnections] = useState<Array<UserDetails>>()
    const [connections, setConnections] = useState<Array<UserDetails>>()
    const router = useRouter()
    const userFactoryContract: Contract | null = useUserManangerContract();

    useEffect(() => {
        if (status === "idle") {
            if (wallet === null) router.push('/login')
            console.log(userFactoryContract);
            userFactoryContract?.doesUserExist(wallet).then((result) => {
                if (!result) {
                    router.push('/profile/new')
                } else {
                    getConnections()
                }
            })
        }
    }, [wallet, status])

    const getConnections = async () => {
        let userConnections = await getUserConnectionDetails(wallet!)
        let pendingConnectionsAddresses = []
        let connectionsAddresses = []

        for (const address of userConnections!.pendingConnections) {
            pendingConnectionsAddresses.push(`"${address}"`)
        }
        for (const address of userConnections!.connections) {
            connectionsAddresses.push(`"${address}"`)
        }

        const [pendingConnections, connections] = await Promise.all([
            getArrayOfDetailsFromUserAddress(pendingConnectionsAddresses),
            getArrayOfDetailsFromUserAddress(connectionsAddresses)
        ])
        setPendingConnections(pendingConnections)
        setConnections(connections)
    }

    const acceptRequest = async (address: string) => {
        await userFactoryContract?.acceptConnection(wallet, address)
    }

    const ignoreRequest = async (address: string) => {
        await userFactoryContract?.removeConnectionFromPendingConnections(wallet, address)
    }

    const removeConnection = async (address: string) => {
        await userFactoryContract?.removeConnectionFromConnections(wallet, address)
    }

    return (
        <Box bg="#F6F6F6">
            <RequestCard pendingConnections={pendingConnections!} acceptRequest={acceptRequest} ignoreRequest={ignoreRequest} />
            <ConnectionsCard connections={connections!} removeConnection={removeConnection}/>
        </Box>
    )
}