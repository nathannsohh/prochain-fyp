// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./libraries/JobsLibrary.sol";
import "./ProCoinToken.sol";

contract JobFactory {
    mapping(uint => JobsLibrary.Job) jobs;
    uint jobCount;

    ProCoinToken procoin;

    constructor(address _procoinAddress) {
        procoin = ProCoinToken(_procoinAddress);
        jobCount = 0;
    }

    // For status, 0 is open, 1 is closed
    event JobCreated(
        uint _id,
        string _jobHash,
        address _owner,
        uint _status 
    );

    event JobStatusUpdated(
        uint _id,
        uint _status
    );

    function createJob(string memory _jobHash) public {
        // TODO: Update this value after testing
        require(procoin.balanceOf(msg.sender) >= 1, "Insufficient ProCoin to list a job!");
        procoin.transferBack(msg.sender, 1);

        address[] memory appliedBy;
        jobCount++;
        JobsLibrary.Job storage newJob = jobs[jobCount];

        newJob.id = jobCount;
        newJob.jobHash = _jobHash;
        newJob.owner = msg.sender;
        newJob.appliedBy = appliedBy;
        newJob.status = JobsLibrary.JobStatus.OPEN;

        emit JobCreated(jobCount, _jobHash, msg.sender, 0);
    }

    function getNumberOfApplications(uint _jobId) public view returns (uint) {
        return jobs[_jobId].appliedBy.length;
    }

    function hasApplied(uint _jobId, address _applicantAddress) public view returns (bool) {
        for (uint i = 0; i < jobs[_jobId].appliedBy.length; i++) {
            if (jobs[_jobId].appliedBy[i] == _applicantAddress) {
                return true;
            }
        }
        return false;
    }

    function closeJobApplication(uint _jobId) public {
        require(jobs[_jobId].status == JobsLibrary.JobStatus.OPEN, "Job status is already closed!");

        JobsLibrary.closeJobApplication(jobs[_jobId]);
        emit JobStatusUpdated(_jobId, 1);
    }

    function openJobApplication(uint _jobId) public {
        require(jobs[_jobId].status == JobsLibrary.JobStatus.CLOSED, "Job status is already open!");

        JobsLibrary.openJobApplication(jobs[_jobId]);
        emit JobStatusUpdated(_jobId, 0);

    }

    function applyToJob(uint _jobId) public {
        require(procoin.balanceOf(msg.sender) >= 1, "Insufficient ProCoin to apply for this job!");

        procoin.transferBack(msg.sender, 1);
        JobsLibrary.applyToJob(jobs[_jobId], msg.sender);
    }

    function resetJob(uint _jobId) public {
        JobsLibrary.resetJob(jobs[_jobId]);
    }
}