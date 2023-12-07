// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./UserProfile.sol";

contract UserManager {
    mapping(address => address) public users;

    event UserRegistered(address indexed user, address profile);

    function registerUser() public {
        require(users[msg.sender] != address(0), "User already registered");
        
        UserProfile newUser = new UserProfile(msg.sender);
        users[msg.sender] = address(newUser);

        emit UserRegistered(msg.sender, address(newUser));
    }

    function getUserProfile() public view returns (address) {
        return users[msg.sender];
    }

    function doesUserExist() public view bool {
        return users[msg.sender] != address(0);
    }
}