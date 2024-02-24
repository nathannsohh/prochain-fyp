'use client'
import ConnectionsCard from "@/components/network/ConnectionsCard";
import RequestCard from "@/components/network/RequestCard";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useMetamask } from "@/hooks/useMetamask";
import useUserManangerContract from "@/hooks/useUserFactoryContract";
import { getArrayOfDetailsFromUserAddress, getUserConnectionDetails } from "@/util/user_util";
import { Box } from "@chakra-ui/react"
import { Contract } from "ethers";
import { useEffect, useState } from "react";

export default function NetworkPage() {
    const { state: { wallet, status } } = useMetamask();
    const [pendingConnections, setPendingConnections] = useState<Array<UserDetails>>()
    const [connections, setConnections] = useState<Array<UserDetails>>()
    const userFactoryContract: Contract | null = useUserManangerContract();
    const ownProfile: ProfileState = useAppSelector((state) => state.ownProfile)

    useEffect(() => {
        if (status === "idle" && wallet !== null) {
            getConnections()
        }
    }, [wallet, status, ownProfile])

    const getConnections = async () => {
        let userConnections = await getUserConnectionDetails(wallet!)
        let pendingConnectionsAddresses = []
        let connectionsAddresses = []
        try {
            for (const address of userConnections!.pendingConnections) {
                pendingConnectionsAddresses.push(`"${address}"`)
            }
            for (const address of userConnections!.connections) {
                connectionsAddresses.push(`"${address}"`)
            }
        } catch (e) {
            console.error(e)
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
        let pending = pendingConnections!
        let accepted;
        for (let i = 0; i < pending.length; i++) {
            if (pending[i].address === address) {
                accepted = pending[i]
                pending.splice(i, 1)
                setPendingConnections(pending)
                break
            }
        }
        setConnections((prevConnections) => [...prevConnections!, accepted!])
    }

    const ignoreRequest = async (address: string) => {
        await userFactoryContract?.removeConnectionFromPendingConnections(wallet, address)
        let pending = pendingConnections!
        for (let i = 0; i < pending.length; i++) {
            if (pending[i].address === address) {
                pending.splice(i, 1)
                setPendingConnections(pending)
                break
            }
        }
    }

    const removeConnection = async (address: string) => {
        await userFactoryContract?.removeConnectionFromConnections(wallet, address)
        let curConnections = connections!
        for (let i = 0; i < curConnections.length; i++) {
            if (curConnections[i].address === address) {
                curConnections.splice(i, 1)
                setConnections(curConnections)
                break
            }
        }
    }

    return (
        <Box bg="#F6F6F6">
            <RequestCard pendingConnections={pendingConnections!} acceptRequest={acceptRequest} ignoreRequest={ignoreRequest} />
            <ConnectionsCard connections={connections!} removeConnection={removeConnection}/>
        </Box>
    )
}