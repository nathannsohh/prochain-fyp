// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import './libraries/UserLibrary.sol';
import './libraries/OrganisationsLibrary.sol';

contract UserFactory {
    enum ProfileType { USER, ORGANISATION }

    mapping(address => ProfileType) profileTypeMap;
    mapping(address => UserLibrary.User) public users;
    mapping(address => OrganisationsLibrary.Organisation) public organisations;

    event UserRegistered(address indexed user, string _profileDataHash, string _profileImageHash, string _profileHeaderHash);
    event UserUpdated(address indexed _user, string _profileImageHash, string _profileHeaderHash);
    event UserConnectionsUpdated(address indexed _user, address[] connections, address[] pendingConnections);

    event OrganisationRegistered(address indexed _organisationWallet, string _profileDataHash, string _profileImageHash, string _profileHeaderHash);
    event OrganisationUpdated(address indexed organisationWallet, string _profileImageHash, string _profileHeaderHash);
    event OrganisationFollowersUpdated(address indexed _organisationWallet, address[] _followedBy);

    modifier userMustExist(address _walletAddress) {
        require(users[_walletAddress].exists, "User does not exist!");
        _;
    }

    modifier organisationMustExist(address _walletAddress) {
        require(organisations[_walletAddress].exists, "Organisation does not exist!");
        _;
    }

    // ############################## UTILITY FUNCTIONS ############################## 

    function doesWalletExist(address _walletAddress) public view returns (bool) {
        return organisations[_walletAddress].exists || users[_walletAddress].exists;
    }

    function getProfileType(address _walletAddress) public view returns (ProfileType) {
        return profileTypeMap[_walletAddress];
    }

    function getUserProfile(address _userWallet) public view returns (UserLibrary.User memory) {
        return users[_userWallet];
    }

    function getOrganisationProfile(address _walletAddress) public view returns (OrganisationsLibrary.Organisation memory) {
        return organisations[_walletAddress];
    }

    // To deprecate
    function doesUserExist(address _userWallet) public view returns (bool) {
        return users[_userWallet].exists;
    }

    // ############################## USER FUNCTIONS ############################## 

    function registerUser(string memory _profileDataHash, string memory _profileImageHash, string memory _profileHeaderHash) public {
        require(organisations[msg.sender].exists != true, "This wallet is already registered as an Organisation!");
        require(users[msg.sender].exists != true, "User already registered");

        address[] memory connections;
        address[] memory pendingConnections;

        UserLibrary.User memory newUser = UserLibrary.User(
            msg.sender, 
            _profileImageHash, 
            _profileHeaderHash, 
            _profileDataHash, 
            connections, 
            pendingConnections, 
            true
        );
        users[msg.sender] = newUser;
        profileTypeMap[msg.sender] = ProfileType.USER;


        emit UserRegistered(msg.sender, _profileDataHash, _profileImageHash, _profileHeaderHash);
    }

    function getNumberOfConnections(address _userWallet) public view userMustExist(_userWallet) returns (uint) {
        return UserLibrary.getNumberOfConnections(users[_userWallet]);
    }

    function isConnection(address _selfWallet, address _userWallet) public view userMustExist(_userWallet) returns (bool) {
        return UserLibrary.isConnection(users[_userWallet], _selfWallet);
    }

    function setProfileImageHash(address _userWallet, string memory _hash) public userMustExist(_userWallet) {
        UserLibrary.setProfileImageHash(users[_userWallet], _hash);
        emit UserUpdated(_userWallet, users[_userWallet].profileImageHash, _hash);
    }

    function setProfileHeaderHash(address _userWallet, string memory _hash) public userMustExist(_userWallet){
        UserLibrary.setProfileHeaderHash(users[_userWallet], _hash);
        emit UserUpdated(_userWallet, _hash, users[_userWallet].profileHeaderHash);
    }

    function setProfileHeaderAndImageHash(address _userWallet, string memory _profileImageHash, string memory _profileHeaderHash) public userMustExist(_userWallet) {
        UserLibrary.setProfileHeaderAndImageHash(users[_userWallet], _profileImageHash, _profileHeaderHash);
        emit UserUpdated(_userWallet, _profileImageHash, _profileHeaderHash);
    }

    function setProfileDataHash(address _userWallet,  string memory _hash) public userMustExist(_userWallet) {
        UserLibrary.setProfileDataHash(users[_userWallet], _hash);
    }

    function acceptConnection(address _userWallet, address _connectionAddress) public userMustExist(_userWallet) {
        UserLibrary.acceptConnection(users[_userWallet], _connectionAddress);
        users[_connectionAddress].connections.push(_userWallet);
        emit UserConnectionsUpdated(_userWallet, users[_userWallet].connections, users[_userWallet].pendingConnections);
    }

    function addConnectionRequest(address _userWallet, address _connectionAddress) public userMustExist(_userWallet) {
        UserLibrary.addConnectionRequest(users[_userWallet], _connectionAddress);
        emit UserConnectionsUpdated(_userWallet, users[_userWallet].connections, users[_userWallet].pendingConnections);
    }

    function removeConnectionFromConnections(address _userWallet, address _connectionAddress) public userMustExist(_userWallet) {
        require(msg.sender == _userWallet, "Only the owner of the account can perform this action!");

        UserLibrary.removeConnectionFromConnections(users[_userWallet], _connectionAddress);
        UserLibrary.removeConnectionFromConnections(users[_connectionAddress], _userWallet);
        emit UserConnectionsUpdated(_userWallet, users[_userWallet].connections, users[_userWallet].pendingConnections);
    }

    function removeConnectionFromPendingConnections(address _userWallet, address _connectionAddress) public userMustExist(_userWallet) {
        UserLibrary.removeConnectionFromPendingConnections(users[_userWallet], _connectionAddress);
        emit UserConnectionsUpdated(_userWallet, users[_userWallet].connections, users[_userWallet].pendingConnections);
    }

    // ############################## ORGANISATION FUNCTIONS ############################## 
    function registerOrganisation(string memory _profileDataHash, string memory _profileImageHash, string memory _profileHeaderHash) public {
        require(users[msg.sender].exists != true, "This wallet is already registered as a User");
        require(organisations[msg.sender].exists != true, "Wallet already registered as an Organisation!");

        address[] memory followedBy;

        OrganisationsLibrary.Organisation memory newOrg = OrganisationsLibrary.Organisation(
            msg.sender, 
            _profileImageHash, 
            _profileHeaderHash, 
            _profileDataHash, 
            followedBy,
            true
        );
        organisations[msg.sender] = newOrg;
        profileTypeMap[msg.sender] = ProfileType.ORGANISATION;

        emit OrganisationRegistered(msg.sender, _profileDataHash, _profileImageHash, _profileHeaderHash);
    }

    function getNumberOfFollowers(address _orgWallet) public view organisationMustExist(_orgWallet) returns (uint) {
        return OrganisationsLibrary.getNumberOfFollowers(organisations[_orgWallet]);
    }

    function isFollower(address _orgWallet, address _userWallet) public view userMustExist(_userWallet) organisationMustExist(_orgWallet) returns (bool) {
        return OrganisationsLibrary.isFollower(organisations[_orgWallet], _userWallet);
    }

    function setOrgProfileImageHash(address _orgWallet, string memory _hash) public organisationMustExist(_orgWallet) {
        OrganisationsLibrary.setProfileImageHash(organisations[_orgWallet], _hash);
        emit OrganisationUpdated(_orgWallet, organisations[_orgWallet].profileImageHash, _hash);
    }

    function setOrgProfileHeaderHash(address _orgWallet, string memory _hash) public organisationMustExist(_orgWallet) {
        OrganisationsLibrary.setProfileHeaderHash(organisations[_orgWallet], _hash);
        emit OrganisationUpdated(_orgWallet, _hash, users[_orgWallet].profileHeaderHash);
    }

    function setOrgProfileHeaderAndImageHash(address _orgWallet, string memory _profileImageHash, string memory _profileHeaderHash) public organisationMustExist(_orgWallet) {
        OrganisationsLibrary.setProfileHeaderAndImageHash(organisations[_orgWallet], _profileImageHash, _profileHeaderHash);
        emit OrganisationUpdated(_orgWallet, _profileImageHash, _profileHeaderHash);
    }

    function setOrgProfileDataHash(address _orgWallet,  string memory _hash) public organisationMustExist(_orgWallet) {
        OrganisationsLibrary.setProfileDataHash(organisations[_orgWallet], _hash);
    }

    function followOrganisation(address _orgWallet, address _userAddress) public organisationMustExist(_orgWallet) userMustExist(_userAddress) {
        OrganisationsLibrary.follow(organisations[_orgWallet], _userAddress);
        emit OrganisationFollowersUpdated(_orgWallet, organisations[_orgWallet].followedBy);
    }

    function unfollowOrganisation(address _orgWallet, address _userAddress) public organisationMustExist(_orgWallet) userMustExist(_userAddress) {
        OrganisationsLibrary.unfollow(organisations[_orgWallet], _userAddress);
        emit OrganisationFollowersUpdated(_orgWallet, organisations[_orgWallet].followedBy);
    }
}