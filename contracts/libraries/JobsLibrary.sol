// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library JobsLibrary {
    enum JobStatus { OPEN, CLOSED }

    struct Job {
        uint id;
        string jobHash;
        address owner;
        address[] appliedBy;
        JobStatus status;
    }

    function closeJobApplication(Job storage self) public {
        self.status = JobStatus.CLOSED;
    }

    function openJobApplication(Job storage self) public {
        self.status = JobStatus.OPEN;
    }

    function applyToJob(Job storage self, address _applicantAddress) public {
        self.appliedBy.push(_applicantAddress);
    }

    function resetJob(Job storage self) public {
        self.appliedBy = new address[](0);
    }
}