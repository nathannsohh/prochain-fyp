// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./libraries/PostLibrary.sol";
import "./ProCoinToken.sol";

contract PostFactory {

    mapping(uint => PostLibrary.Post) posts;
    uint postCount;
    
    ProCoinToken procoin;

    event PostCreated(
        uint _id,
        string _postImageHash,
        string _postContentHash,
        address _owner
    );
    event CommentCreated(
        uint indexed _commentId, 
        string _commentContentHash, 
        address _commentedBy, 
        uint _postId
    );
    event PostLiked(uint indexed _postId, address _likedBy);
    event PostUnliked(uint indexed _postId, address _unlikedBy);

    constructor(address _procoinAddress) {
        procoin = ProCoinToken(_procoinAddress);
        postCount = 0;
    }

    function createPost(string memory _imageHash, string memory _contentHash) public {
        address[] memory likedBy;
        postCount++;
        PostLibrary.Post storage newPost = posts[postCount];

        newPost.postImageHash = _imageHash;
        newPost.postContentHash = _contentHash;
        newPost.id = postCount;
        newPost.likedBy = likedBy;
        newPost.likeMilestone = 0;
        newPost.comments.push();
        newPost.commentMilestone = 0;
        newPost.commentCount = 0;
        newPost.owner = msg.sender;

        emit PostCreated(postCount, _imageHash, _contentHash, msg.sender);
    }

    // ###################### POST FUNCTIONS ###########################
    function likePost(uint _postId) public {
        PostLibrary.likePost(posts[_postId]);

        if (posts[_postId].likedBy.length >= 1
        // TODO: Uncomment after testing the automatic distributeReward function 
        // && posts[_id].likedBy.length / 10 > posts[_id].likeMilestone
        ) {
            // Make sure that users cannot like and unlike to get reward
            posts[_postId].likeMilestone = posts[_postId].likedBy.length / 10;

            // Transfer tokens to user
            distributeReward(posts[_postId].owner);
        }
        emit PostLiked(_postId, msg.sender);
    }

    function unlikePost(uint _postId) public {
        PostLibrary.unlikePost(posts[_postId]);
        emit PostUnliked(_postId, msg.sender);
    }

    function comment(uint _postId, string memory _commentHash) public {
        uint commentId = PostLibrary.comment(posts[_postId], _commentHash);

        if (posts[_postId].comments.length >= 10 && posts[_postId].comments.length / 10 > posts[_postId].commentMilestone) {
            posts[_postId].commentMilestone = posts[_postId].comments.length / 10;

            // Transfer tokens to user
            distributeReward(posts[_postId].owner);
        }
        emit CommentCreated(commentId, _commentHash, msg.sender, _postId);
    }

    function uncomment(uint _id, uint _commentId) public {
        PostLibrary.uncomment(posts[_id], _commentId);
    }

    function distributeReward(address _ownerAddress) internal {
        procoin.transfer(_ownerAddress, 10);
    }
}