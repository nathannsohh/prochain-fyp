// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library UserLibrary {

    struct User {
    address walletAddress;
    string profileImageHash;
    string profileHeaderHash;
    string profileDataHash;

    address[] connections;
    address[] pendingConnections;

    bool exists;
}

    event ConnectionRequestReceived(address indexed _from);

    modifier onlyUser(address _walletAddress) {
        require(msg.sender == _walletAddress, "Only the user of this profile can perform this action!");
        _;
    }

    function getNumberOfConnections(User storage self) public view returns (uint) {
        return self.connections.length;
    }

    function setProfileImageHash(User storage self, string memory _hash) public onlyUser(self.walletAddress) {
        self.profileImageHash = _hash;
    }

    function setProfileHeaderHash(User storage self, string memory _hash) public onlyUser(self.walletAddress){
        self.profileHeaderHash = _hash;
    }

    function setProfileDataHash(User storage self,  string memory _hash) public onlyUser(self.walletAddress) {
        self.profileDataHash = _hash;
    }

    function acceptConnection(User storage self, address _connectionAddress) public onlyUser(self.walletAddress) {
        self.connections.push(_connectionAddress);
        removeConnectionFromPendingConnections(self, _connectionAddress);

    }

    function addConnectionRequest(User storage self, address _connectionAddress) public {
        self.pendingConnections.push(_connectionAddress);
        emit ConnectionRequestReceived(_connectionAddress);
    }

    function removeConnectionFromConnections(User storage self, address _userWalletAddress) public {
        uint index = getIndexOfConnection(self, _userWalletAddress);
        if (index >= self.connections.length) return;

        for (uint i = index; i < self.connections.length - 1; i++) {
            self.connections[i] = self.connections[i+1];
        }
        self.connections.pop();
    }

    function removeConnectionFromPendingConnections(User storage self, address _userWalletAddress) public {
        uint index = getIndexOfPendingConnection(self, _userWalletAddress);
        if (index >= self.pendingConnections.length) return;

        for (uint i = index; i < self.pendingConnections.length - 1; i++) {
            self.pendingConnections[i] = self.pendingConnections[i+1];
        }
        self.pendingConnections.pop();
    }

    function getIndexOfPendingConnection(User storage self, address _connectionAddress) internal view returns (uint) {
        for (uint i = 0; i < self.pendingConnections.length; i++) {
            if (self.pendingConnections[i] == _connectionAddress) {
                return i;
            }
        }
        revert('This connection is not in the pending connections list');
    }

    function getIndexOfConnection(User storage self, address _connectionAddress) internal view returns (uint) {
        for (uint i = 0; i < self.connections.length; i++) {
            if (self.connections[i] == _connectionAddress) {
                return i;
            }
        }
        revert('This connection is not in the pending connections list');
    }

}