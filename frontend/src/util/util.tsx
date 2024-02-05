export const getArrayOfPostContentHashes = (postData: any): Array<string>  => {
    let postHashArray = []
    for (const post of postData) {
        postHashArray.push(`"${post.postContentHash}"`)
    }
    return postHashArray
}