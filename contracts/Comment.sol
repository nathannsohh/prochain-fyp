// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Comment {
    string commentContentHash;

    constructor(string memory _contentHash) {
        commentContentHash = _contentHash;
    }
}