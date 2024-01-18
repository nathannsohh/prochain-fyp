// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import './libraries/UserLibrary.sol';

contract UserFactory {
    mapping(address => UserLibrary.User) public users;

    event UserRegistered(address indexed user, string _profileDataHash, string _profileImageHash, string _profileHeaderHash);
    event UserUpdated(address indexed _user, string _profileImageHash, string _profileHeaderHash);
    event UserConnectionsUpdated(address indexed _user, address[] connections, address[] pendingConnections);

    modifier userMustExist(address _walletAddress) {
        require(users[_walletAddress].exists, "User does not exist!");
        _;
    }

    function registerUser(string memory _profileDataHash, string memory _profileImageHash, string memory _profileHeaderHash) public {
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

        emit UserRegistered(msg.sender, _profileDataHash, _profileImageHash, _profileHeaderHash);
    }

    function getUserProfile(address _userWallet) public view returns (UserLibrary.User memory) {
        return users[_userWallet];
    }
    
    function doesUserExist(address _userWallet) public view returns (bool) {
        return users[_userWallet].exists;
    }

    // ############################## USER FUNCTIONS ############################## 

    function getNumberOfConnections(address _userWallet) public view userMustExist(_userWallet) returns (uint) {
        return UserLibrary.getNumberOfConnections(users[_userWallet]);
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
}