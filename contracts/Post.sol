// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import './Comment.sol';

contract Post {
    string public postImageHash;
    string public postContentHash;
    address[] public likedBy;
    uint likeMilestone;
    address[] public comments;
    uint commentMilestone;

    constructor(string memory _imageHash, string memory _contentHash) {
        postImageHash = _imageHash;
        postContentHash = _contentHash;
        likeMilestone = 0;
        commentMilestone = 0;
    }

    function likePost() public {
        require(checkIfLikedAlready(msg.sender) == false, 'User has already liked this post!');
        
        likedBy.push(msg.sender);
        
        if (likedBy.length >= 20 && likedBy.length % 10 > likeMilestone) {
            // Make sure that users cannot like and unlike to get reward
            likeMilestone = likedBy.length % 10;

            // TODO: Transfer tokens to user as reward
        }
    }

    function unlikePost() public {
        require(checkIfLikedAlready(msg.sender) == true, 'User has not liked this post!');

        for (uint i = 0; i < likedBy.length; i++) {
            if (likedBy[i] == msg.sender) {
                likedBy[i] = likedBy[likedBy.length - 1];
                delete likedBy[likedBy.length - 1];
                break;
            }
        }
    }

    function comment(string memory _message) public {
        Comment newComment = new Comment(_message);
        comments.push(address(newComment));

        if (comments.length >= 20 && comments.length % 10 > commentMilestone) {
            commentMilestone = comments.length % 10;
            
            // TODO: Transfer tokens to user as reward
        }
    }

    function uncomment() public {
        
    }

    function checkIfLikedAlready(address _user) public view returns (bool) {
        for (uint i = 0; i < likedBy.length; i++) {
            if (likedBy[i] == _user) {
                return true;
            }
        }
        return false;
    }
}