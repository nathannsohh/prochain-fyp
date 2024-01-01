// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract UserProfile {
    address public walletAddress;
    string public profileImageHash;
    string public profileHeaderHash;
    string public profileDataHash;

    address[] public connections;
    address[] public pendingConnections;

    event ConnectionRequestReceived(address indexed _from);

    modifier onlyUser(address _walletAddress) {
        require(msg.sender == _walletAddress, "Only the user of this profile can perform this action!");
        _;
    }

    constructor (address _walletAddress, string memory _hash) {
        walletAddress = _walletAddress;
        profileDataHash = _hash;
    }

    function getNumberOfConnections() public view returns (uint) {
        return connections.length;
    }

    function setProfileImageHash(string memory _hash) public {
        profileImageHash = _hash;
    }

    function setProfileHeaderHash(string memory _hash) public {
        profileHeaderHash = _hash;
    }

    function setProfileDataHash(string memory _hash) public {
        profileDataHash = _hash;
    }

    function acceptConnection(address _connectionAddress) public onlyUser(walletAddress) {
        connections.push(_connectionAddress);
        uint index = getIndexOfPendingConnection(_connectionAddress);
        removeConnectionFromPendingConnections(index);

    }

    function addRequest(address _connectionAddress) public {
        pendingConnections.push(_connectionAddress);
        emit ConnectionRequestReceived(_connectionAddress);
    }

    function getIndexOfPendingConnection(address _connectionAddress) internal view returns (uint) {
        for (uint i = 0; i < pendingConnections.length; i++) {
            if (pendingConnections[i] == _connectionAddress) {
                return i;
            }
        }
        revert('This connection is not in the pending connections list');
    }

    function removeConnectionFromConnections(uint _index) public onlyUser(walletAddress) {
        if (_index >= connections.length) return;

        for (uint i = _index; i < connections.length - 1; i++) {
            connections[i] = connections[i+1];
        }
        connections.pop();
    }

    function removeConnectionFromPendingConnections(uint _index) public onlyUser(walletAddress) {
        if (_index >= pendingConnections.length) return;

        for (uint i = _index; i < pendingConnections.length - 1; i++) {
            pendingConnections[i] = pendingConnections[i+1];
        }
        pendingConnections.pop();
    }
}