// DEPRECATED - DO NOT USE

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./UserProfile.sol";

contract UserManager {
    mapping(address => address) public users;

    event UserRegistered(address indexed user, address profile);

    function registerUser(string memory _hash) public {
        require(users[msg.sender] == address(0), "User already registered");
        
        UserProfile newUser = new UserProfile(msg.sender, _hash);
        users[msg.sender] = address(newUser);

        emit UserRegistered(msg.sender, address(newUser));
    }

    function getUserProfile(address _userWallet) public view returns (address) {
        return users[_userWallet];
    }
    
    function doesUserExist() public view returns (bool) {
        return users[msg.sender] != address(0);
    }

    fallback() external payable {}
    receive() external payable {}
}