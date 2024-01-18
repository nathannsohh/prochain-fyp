import { Address, Bytes, Value } from "@graphprotocol/graph-ts";
import { UserRegistered, UserUpdated, UserConnectionsUpdated } from "./generated/UserFactory/UserFactory"
import { User } from './generated/schema'

export function handleUserRegistered(event: UserRegistered): void {
    let user = new User(event.params.user.toString())

    user.userAddress = event.params.user;
    user.profileDataHash = event.params._profileDataHash;
    user.profileHeaderHash = event.params._profileHeaderHash;
    user.profileImageHash = event.params._profileImageHash;
    user.pendingConnections = [];
    user.connections = [];

    user.save();
}

export function handleUserUpdated(event: UserUpdated): void {
    let user: User | null = User.load(event.params._user.toString());
    if (!user) return;

    user.profileImageHash = event.params._profileImageHash;
    user.profileHeaderHash = event.params._profileHeaderHash;

    user.save();
}

export function handleUserConnectionsUpdated(event: UserConnectionsUpdated): void {
    let user: User | null = User.load(event.params._user.toString());
    if (!user) return;
    
    user.connections = Value.fromAddressArray(event.params.connections).toBytesArray();
    user.pendingConnections = Value.fromAddressArray(event.params.pendingConnections).toBytesArray();

    user.save();
}