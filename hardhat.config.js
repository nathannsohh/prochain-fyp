require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.23",
  networks: {
    localhost: {
      url: "http://0.0.0.0:8545",
    }
  }
};
