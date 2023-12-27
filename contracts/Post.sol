// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import './Comment.sol';

contract Post {
    string public postImageHash;
    string public postContentHash;

    mapping(address => bool) hasLiked;
    address[] likedBy;
    uint likeMilestone;
    address[] public comments;
    uint commentMilestone;
    address owner;

    event CommentCreated(address indexed _commentAddress);
    event PostLiked(address indexed _likerAddress);

    constructor(string memory _imageHash, string memory _contentHash, address _ownerAddress) {
        postImageHash = _imageHash;
        postContentHash = _contentHash;
        likeMilestone = 0;
        commentMilestone = 0;
        owner = _ownerAddress;
    }

    function likePost() public {
        require(!hasLiked[msg.sender], 'User has already liked this post!');
        
        hasLiked[msg.sender] = true;
        
        if (likedBy.length >= 20 && likedBy.length % 10 > likeMilestone) {
            // Make sure that users cannot like and unlike to get reward
            likeMilestone = likedBy.length % 10;

            // TODO: Transfer tokens to user as reward
        }
        emit PostLiked(msg.sender);
    }

    function unlikePost() public {
        require(hasLiked[msg.sender] == true, 'User has not liked this post!');

        hasLiked[msg.sender] = false;
        for (uint i = 0; i < likedBy.length; i++) {
            if (likedBy[i] == msg.sender) {
                likedBy[i] = likedBy[likedBy.length - 1];
                delete likedBy[likedBy.length - 1];
                break;
            }
        }
    }

    function comment(string memory _message) public {
        Comment newComment = new Comment(_message, msg.sender);
        comments.push(address(newComment));

        if (comments.length >= 20 && comments.length % 10 > commentMilestone) {
            commentMilestone = comments.length % 10;
            
            // TODO: Transfer tokens to user as reward
        }
        emit CommentCreated(address(newComment));
    }

    function uncomment(address _commentAddress) public {
        int addressIndex = _getIndexOfComment(_commentAddress);

        require(addressIndex != -1, "This comment does not exist!");

        for (uint i = uint(addressIndex); i < comments.length - 1; i++) {
            comments[i] = comments[i+1];
        }
        comments.pop();
    }

    function _getIndexOfComment(address _commentAddress) private view returns (int) {
        for (uint i = 0; i < comments.length; i++) {
            if (comments[i] == _commentAddress) {
                return int(i);
            }
        }
        return -1;
    }
}