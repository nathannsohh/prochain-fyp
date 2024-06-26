import { PostCreated, PostLiked, CommentCreated, PostUnliked  } from "./generated/PostFactory/PostFactory"
import { Post, Comment } from "./generated/schema"

export function handlePostCreated(event: PostCreated): void {
    let post = new Post(event.params._id.toString())

    post.postId = event.params._id;
    post.postImageHash = event.params._postImageHash.toString();
    post.postContentHash = event.params._postContentHash.toString();
    post.owner = event.params._owner;
    post.likedBy = [];

    post.save()
}

export function handlePostLiked(event: PostLiked): void {
    let post: Post | null = Post.load(event.params._postId.toString())
    if (!post) return;
    let likedBy = post.likedBy;
    likedBy.push(event.params._likedBy);

    post.likedBy = likedBy;
    post.save()
}

export function handlePostUnliked(event: PostUnliked): void {
    let post: Post | null = Post.load(event.params._postId.toString())
    if (!post) return;

    let index = post.likedBy.indexOf(event.params._unlikedBy);
    let likedBy = post.likedBy;
    likedBy.splice(index, 1);
    post.likedBy = likedBy;

    post.save()
}

export function handleCommentCreated(event: CommentCreated): void {
    let comment = new Comment(event.params._commentId.toString());

    comment.commentContentHash = event.params._commentContentHash;
    comment.owner = event.params._commentedBy;
    comment.post = event.params._postId.toString();

    comment.save()
}