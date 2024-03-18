// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library JobExperienceLibrary{

    enum JobExpStatus { UNVERIFIED, VERIFIED, REJECTED }

    struct JobExperience {
        uint id;
        string jobExperienceHash;
        address owner;
        address orgAddress;
        JobExpStatus status;
    }

    function verifyExperience(JobExperience storage self) public {
        self.status = JobExpStatus.VERIFIED;
    }

    function unverifyExperience(JobExperience storage self) public {
        self.status = JobExpStatus.UNVERIFIED;
    }

    function rejectExperience(JobExperience storage self) public {
        self.status = JobExpStatus.REJECTED;
    }

    function deleteExperience(JobExperience storage self) public {
        self.owner = address(0);
    }

    function updateOrgAddress(JobExperience storage self, address _newAddress) public {
        self.orgAddress = _newAddress;
        self.status = JobExpStatus.UNVERIFIED;
    }
}