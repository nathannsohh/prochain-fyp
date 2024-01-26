import { Address, Bytes, Value } from "@graphprotocol/graph-ts";
import { 
    UserRegistered, 
    UserUpdated, 
    UserConnectionsUpdated, 
    OrganisationRegistered,
    OrganisationUpdated,
    OrganisationFollowed,
    OrganisationUnfollowed
} from "./generated/UserFactory/UserFactory"
import { User, Organisation } from './generated/schema'

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

export function handleOrganisationRegistered(event: OrganisationRegistered): void {
    let org = new Organisation(event.params._organisationWallet.toString())

    org.organisationAddress = event.params._organisationWallet;
    org.profileDataHash = event.params._profileDataHash;
    org.profileHeaderHash = event.params._profileHeaderHash;
    org.profileImageHash = event.params._profileImageHash;
    org.followedBy = [];

    org.save();
}

export function handleOrganisationUpdated(event: OrganisationUpdated): void {
    let org: Organisation | null = Organisation.load(event.params._organisationWallet.toString());
    if (!org) return;

    org.profileImageHash = event.params._profileImageHash;
    org.profileHeaderHash = event.params._profileHeaderHash;

    org.save();
}

export function handleOrganisationFollowed(event: OrganisationFollowed): void {
    let org: Organisation | null = Organisation.load(event.params._organisationWallet.toString());
    if (!org) return;

    let followerList = org.followedBy;
    followerList.push(event.params._followedBy.toString());
    org.followedBy = followerList;

    org.save();
}

export function handleOrganisationUnfollowed(event: OrganisationUnfollowed): void {
    let org: Organisation | null = Organisation.load(event.params._organisationWallet.toString());
    if (!org) return;

    let followerList = org.followedBy;
    const index = followerList.indexOf(event.params._unfollowedBy.toString());
    followerList.splice(index, 1);
    org.followedBy = followerList;

    org.save();
}