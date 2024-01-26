// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library OrganisationsLibrary {
    struct Organisation {
        address walletAddress;
        string profileImageHash;
        string profileHeaderHash;
        string profileDataHash;
        
        address [] followedBy;

        bool exists;
    }

    modifier onlyOwner(address _walletAddress) {
        require(msg.sender == _walletAddress, "Only the owner of this profile can perform this action!");
        _;
    }

    function getNumberOfFollowers(Organisation storage self) public view returns (uint) {
        return self.followedBy.length;
    }

    function isFollower(Organisation storage self, address _userAddress) public view returns (bool) {
        bool res = false;
        for (uint i; i < self.followedBy.length; i++) {
            if (self.followedBy[i] == _userAddress) {
                res = true;
                break;
            }
        }
        return res;
    }

    function setProfileImageHash(Organisation storage self, string memory _hash) public onlyOwner(self.walletAddress) {
        self.profileImageHash = _hash;
    }

    function setProfileHeaderHash(Organisation storage self, string memory _hash) public onlyOwner(self.walletAddress){
        self.profileHeaderHash = _hash;
    }

    function setProfileDataHash(Organisation storage self,  string memory _hash) public onlyOwner(self.walletAddress) {
        self.profileDataHash = _hash;
    }

    function setProfileHeaderAndImageHash(Organisation storage self, string memory _profileImageHash, string memory _profileHeaderHash) public onlyOwner(self.walletAddress) {
        self.profileImageHash = _profileImageHash;
        self.profileHeaderHash = _profileHeaderHash;
    }

    function follow(Organisation storage self, address _userAddress) public {
        require(!isFollower(self, _userAddress), "This user is already following this organisation!");
        self.followedBy.push(_userAddress);
    }

    function unfollow(Organisation storage self, address _userAddress) public {
        require(isFollower(self, _userAddress), "This user is not following this organisation!");
        for (uint i = 0; i < self.followedBy.length; i++) {
            if (self.followedBy[i] == _userAddress) {
                self.followedBy[i] = self.followedBy[self.followedBy.length - 1];
                delete self.followedBy[self.followedBy.length - 1];
            }
        }
    }
}