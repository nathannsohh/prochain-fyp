import { JobCreated, JobStatusUpdated, JobApplied, JobReset } from "./generated/JobFactory/JobFactory"
import { Job } from "./generated/schema"

export function handleJobCreated(event: JobCreated): void {
    let job = new Job(event.params._id.toString())

    job.jobId = event.params._id;
    job.jobHash = event.params._id.toString();
    job.appliedBy = [];
    job.owner = event.params._owner;
    job.status = event.params._status;

    job.save()
}

export function handleJobStatusUpdated(event: JobStatusUpdated): void {
    let job: Job | null = Job.load(event.params._id.toString())
    if (!job) return;

    job.status = event.params._status;
    job.save()
}

export function handleJobApplied(event: JobApplied): void {
    let job: Job | null = Job.load(event.params._id.toString())
    if (!job) return;

    let appliedBy = job.appliedBy;
    appliedBy.push(event.params._applicantAddress)
    job.appliedBy = appliedBy;

    job.save()
}

export function handleJobReset(event: JobReset): void {
    let job: Job | null = Job.load(event.params._id.toString())
    if (!job) return;

    job.appliedBy = [];

    job.save()
}