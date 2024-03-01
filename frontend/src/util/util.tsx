export const getArrayOfPostContentHashes = (postData: any): Array<string>  => {
    let postHashArray = []
    for (const post of postData) {
        postHashArray.push(`"${post.postContentHash}"`)
    }
    return postHashArray
}

export const getArrayOfJobHashes = (jobData: any): Array<string>  => {
    let jobHashArray = []
    for (const job of jobData) {
        jobHashArray.push(`"${job.jobHash}"`)
    }
    return jobHashArray
}

export const getArrayOfJobOwners = (jobData: any): Array<string>  => {
    let jobOwnerArray = []
    for (const job of jobData) {
        jobOwnerArray.push(`"${job.owner}"`)
    }
    return jobOwnerArray
}

export const convertToJobMap = (jobData: any): Map<string, any> => {
    let jobMap = new Map()

    for (const job of jobData) {
        jobMap.set(job.content_hash, job)
    }

    return jobMap
}