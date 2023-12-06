// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Post {
    string public postImageIPFSHash;
    string public postContentIPFSHash;
    uint public likes = 0;
    address[] public comments;
}