// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library PostLibrary {

    struct Post {
        string postImageHash;
        string postContentHash;
        uint id;

        mapping(address => bool) hasLiked;
        address[] likedBy;
        uint likeMilestone;

        Comment[] comments;
        uint commentMilestone;
        uint commentCount;

        address owner;
    }

    struct Comment {
        string commentContentHash;
        address owner;
        uint id;
    }

    function likePost(Post storage self) public {
        require(!self.hasLiked[msg.sender], 'User has already liked this post!');
        
        self.hasLiked[msg.sender] = true;
        self.likedBy.push(msg.sender);
    }

    function unlikePost(Post storage self) public {
        require(self.hasLiked[msg.sender] == true, 'User has not liked this post!');

        self.hasLiked[msg.sender] = false;
        for (uint i = 0; i < self.likedBy.length; i++) {
            if (self.likedBy[i] == msg.sender) {
                self.likedBy[i] = self.likedBy[self.likedBy.length - 1];
                delete self.likedBy[self.likedBy.length - 1];
                break;
            }
        }
    }

    function comment(Post storage self, string memory _commentHash) public returns (uint) {
        self.commentCount++;
        Comment memory newComment = Comment(_commentHash, msg.sender, self.commentCount);
        self.comments.push(newComment);
        return self.commentCount;
    }

    function uncomment(Post storage self, uint _id) public {
        int commentIndex = _getIndexOfComment(self, _id);

        require(commentIndex != -1, "This comment does not exist!");

        for (uint i = uint(commentIndex); i < self.comments.length - 1; i++) {
            self.comments[i] = self.comments[i+1];
        }
        self.comments.pop();
    }

    function _getIndexOfComment(Post storage self, uint _id) private view returns (int) {
        for (uint i = 0; i < self.comments.length; i++) {
            if (self.comments[i].id == _id) {
                return int(i);
            }
        }
        return -1;
    }
}