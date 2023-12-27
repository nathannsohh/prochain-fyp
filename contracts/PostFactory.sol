// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./Post.sol";

contract PostFactory {
    
    event PostCreated(address indexed _postAddress);

    function createPost(string memory _imageHash, string memory _contentHash) public {
        Post newPost = new Post(_imageHash, _contentHash, msg.sender);
        emit PostCreated(address(newPost));
    }
}