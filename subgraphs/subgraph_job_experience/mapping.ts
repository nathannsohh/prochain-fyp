import { JobExpDeleted, JobExperienceCreated, JobExpStatusUpdated, JobExpUpdated } from "./generated/JobExperienceFactory/JobExperienceFactory"
import { JobExperience } from "./generated/schema"

export function handleJobExperienceCreated(event: JobExperienceCreated): void {
    let jobExp = new JobExperience(event.params._id.toString())

    jobExp.jobExpId = event.params._id;
    jobExp.jobExpHash = event.params._jobHash;
    jobExp.owner = event.params._owner;
    jobExp.orgAddress = event.params._orgAddress;
    jobExp.status = event.params._status;

    jobExp.save()
}

export function handleJobExpStatusUpdated(event: JobExpStatusUpdated): void {
    let jobExp: JobExperience | null = JobExperience.load(event.params._id.toString())
    if (!jobExp) return;

    jobExp.status = event.params._status;
    jobExp.save()
}

export function handleJobExpDeleted(event: JobExpDeleted): void {
    let jobExp: JobExperience | null = JobExperience.load(event.params._id.toString())
    if (!jobExp) return;

    jobExp.owner = event.params._zeroAddress;
    jobExp.save();
}

export function handleJobExpUpdated(event: JobExpUpdated): void {
    let jobExp: JobExperience | null = JobExperience.load(event.params._id.toString())
    if (!jobExp) return;

    jobExp.orgAddress = event.params._newAddress;
    jobExp.save();
}