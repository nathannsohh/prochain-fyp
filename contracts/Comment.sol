// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Comment {
    string commentContentHash;
    address owner;

    constructor(string memory _contentHash, address _ownerAddress) {
        commentContentHash = _contentHash;
        owner = _ownerAddress;
    }
}