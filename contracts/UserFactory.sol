// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import './libraries/UserLibrary.sol';

contract UserFactory {
    mapping(address => UserLibrary.User) public users;

    event UserRegistered(address indexed user);

    modifier userMustExist(address _walletAddress) {
        require(users[_walletAddress].exists, "User does not exist!");
        _;
    }

    function registerUser(string memory _hash) public {
        require(users[msg.sender].exists != true, "User already registered");

        address[] memory connections;
        address[] memory pendingConnections;

        UserLibrary.User memory newUser = UserLibrary.User(
            msg.sender, 
            "0", 
            "0", 
            _hash, 
            connections, 
            pendingConnections, 
            true
        );
        users[msg.sender] = newUser;

        emit UserRegistered(msg.sender);
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
    }

    function setProfileHeaderHash(address _userWallet, string memory _hash) public userMustExist(_userWallet){
        UserLibrary.setProfileHeaderHash(users[_userWallet], _hash);
    }

    function setProfileDataHash(address _userWallet,  string memory _hash) public userMustExist(_userWallet) {
        UserLibrary.setProfileDataHash(users[_userWallet], _hash);
    }

    function acceptConnection(address _userWallet, address _connectionAddress) public userMustExist(_userWallet) {
        UserLibrary.acceptConnection(users[_userWallet], _connectionAddress);
        users[_connectionAddress].connections.push(_userWallet);
    }

    function addConnectionRequest(address _userWallet, address _connectionAddress) public userMustExist(_userWallet) {
        UserLibrary.addConnectionRequest(users[_userWallet], _connectionAddress);
    }

    function removeConnectionFromConnections(address _userWallet, address _connectionAddress) public userMustExist(_userWallet) {
        require(msg.sender == _userWallet, "Only the owner of the account can perform this action!");

        UserLibrary.removeConnectionFromConnections(users[_userWallet], _connectionAddress);
        UserLibrary.removeConnectionFromConnections(users[_connectionAddress], _userWallet);
    }

    function removeConnectionFromPendingConnections(address _userWallet, address _connectionAddress) public userMustExist(_userWallet) {
        UserLibrary.removeConnectionFromPendingConnections(users[_userWallet], _connectionAddress);
    }
}