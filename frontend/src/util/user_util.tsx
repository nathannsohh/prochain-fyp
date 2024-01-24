import axios from 'axios'
import { API_URL, THE_GRAPH_URL } from './constants'

interface UserConnections {
    connections: Array<string>,
    pendingConnections: Array<string>
}

export async function getUserConnectionDetails(address: string): Promise<UserConnections | undefined > {
    const graphqlQuery = {
        "operationName": "getUsers",
        "query": `query getUsers {
                     users (
                        where: { userAddress: "${address}"}, 
                    ) { userAddress pendingConnections connections }}`,
        "variables": {}
    }
    try {
        const userResult = await axios.post(`${THE_GRAPH_URL}/users`, graphqlQuery)
        const user = userResult.data.data.users[0]
        return {
            connections: user.connections,
            pendingConnections: user.pendingConnections
        }
    } catch (e) {
        console.error(e)
    }
}

export async function getDetailsFromUserAddress(addresses: Array<string>): Promise<Map<string, UserDetails> | undefined> {
    const graphqlQuery = {
        "operationName": "getUsers",
        "query": `query getUsers {
                     users (
                        where: { userAddress_in: [${addresses}]}, 
                    ) { userAddress profileDataHash profileImageHash }}`,
        "variables": {}
    }
    try {
        const users = await axios.post(`${THE_GRAPH_URL}/users`, graphqlQuery)
        let dataHashArray = []
        let profileImageMap = new Map<string, string>()
        for (const user of users.data.data.users) {
            dataHashArray.push(`"${user.profileDataHash}"`)
            profileImageMap.set(user.userAddress, user.profileImageHash)
        }
        const userData = await axios.get(`${API_URL}/users/[${dataHashArray}]`)
        
        let output: Map<string, UserDetails> = new Map<string, UserDetails>()
        for (const user of userData.data.users) {
            output.set(user.wallet_address, {
                name: user.first_name + ' ' + user.last_name,
                bio: user.bio,
                profileImageHash: profileImageMap.get(user.wallet_address)!,
                address: user.wallet_address
            })
        }
        return output
    } catch (e) {
        console.log(e)
    }
}

export async function getArrayOfDetailsFromUserAddress(addresses: Array<string>): Promise<Array<UserDetails> | undefined> {
    if (addresses.length === 0) {
        return []
    }
    const graphqlQuery = {
        "operationName": "getUsers",
        "query": `query getUsers {
                     users (
                        where: { userAddress_in: [${addresses}]}, 
                    ) { userAddress profileDataHash profileImageHash }}`,
        "variables": {}
    }
    
    try {
        const users = await axios.post(`${THE_GRAPH_URL}/users`, graphqlQuery)
        console.log(users)
        let dataHashArray = []
        let profileImageMap = new Map<string, string>()
        for (const user of users.data.data.users) {
            dataHashArray.push(`"${user.profileDataHash}"`)
            profileImageMap.set(user.userAddress, user.profileImageHash)
        }
        const userData = await axios.get(`${API_URL}/users/[${dataHashArray}]`)
        
        let output = []
        for (const user of userData.data.users) {
            output.push( {
                name: user.first_name + ' ' + user.last_name,
                bio: user.bio,
                profileImageHash: profileImageMap.get(user.wallet_address)!,
                address: user.wallet_address
            })
        }
        return output
    } catch (e) {
        console.log(e)
    }
}

