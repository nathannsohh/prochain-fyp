// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ProCoinToken is ERC20 {
  constructor(uint initialSupply) ERC20("ProCoin", "PRC"){
    _mint(msg.sender, initialSupply);
  }
} 