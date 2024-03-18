// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./libraries/JobExperienceLibrary.sol";

contract JobExperienceFactory {
    mapping(uint => JobExperienceLibrary.JobExperience) jobExperiences;
    uint jobExperienceCount;


    constructor() {
        jobExperienceCount = 0;
    }

    // For status, 0 is unverified, 1 is verified, 2 is rejected
    event JobExperienceCreated(
        uint _id,
        string _jobHash,
        address _owner,
        address _orgAddress,
        uint _status 
    );

    event JobExpStatusUpdated(
        uint _id,
        uint _status
    );

    event JobExpDeleted(
        uint _id,
        address _zeroAddress
    );

    event JobExpUpdated(
        uint _id,
        address _newAddress
    );

    function createJobExperience(string memory _jobExpHash, address _orgAddress) public {

        jobExperienceCount++;
        JobExperienceLibrary.JobExperience storage newJobExp = jobExperiences[jobExperienceCount];

        newJobExp.id = jobExperienceCount;
        newJobExp.jobExperienceHash = _jobExpHash;
        newJobExp.owner = msg.sender;
        newJobExp.orgAddress = _orgAddress;
        newJobExp.status = JobExperienceLibrary.JobExpStatus.UNVERIFIED;

        emit JobExperienceCreated(newJobExp.id, newJobExp.jobExperienceHash, newJobExp.owner, newJobExp.orgAddress, uint(newJobExp.status));
    }

    function verifyExperience(uint _jobExpId) public {
        JobExperienceLibrary.verifyExperience(jobExperiences[_jobExpId]);
        emit JobExpStatusUpdated(_jobExpId, uint(jobExperiences[_jobExpId].status));
    }

    function unverifyExperience(uint _jobExpId) public {
        JobExperienceLibrary.unverifyExperience(jobExperiences[_jobExpId]);
        emit JobExpStatusUpdated(_jobExpId, uint(jobExperiences[_jobExpId].status));
    }

    function rejectExperience(uint _jobExpId) public {
        JobExperienceLibrary.rejectExperience(jobExperiences[_jobExpId]);
        emit JobExpStatusUpdated(_jobExpId, uint(jobExperiences[_jobExpId].status));
    }

    function deleteExperience(uint _jobExpId) public {
        JobExperienceLibrary.deleteExperience(jobExperiences[_jobExpId]);
        emit JobExpDeleted(_jobExpId, address(0));
    }

    function updateOrgAddress(uint _jobExpId, address _newAddress) public {
        JobExperienceLibrary.updateOrgAddress(jobExperiences[_jobExpId], _newAddress);
        emit JobExpUpdated(_jobExpId, _newAddress);
    }
}