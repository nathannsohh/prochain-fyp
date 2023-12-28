const hre = require("hardhat");

async function main() {

    // User Manager
    const userManagerContract = await hre.ethers.deployContract('UserManager')
    await userManagerContract.waitForDeployment();

    // ProCoin Token
    const initialSupply = 10000000;
    const procoinTokenContract = await hre.ethers.deployContract('ProCoinToken', [initialSupply])
    await procoinTokenContract.waitForDeployment();

    // Post Factory
    const postFactoryContract = await hre.ethers.deployContract('PostFactory', [procoinTokenContract.target])
    await postFactoryContract.waitForDeployment();

    console.log(`UserManager deployed to ${userManagerContract.target}`);
    console.log(`ProCoinToken deployed to ${procoinTokenContract.target}`);
    console.log(`PostFactory deployed to ${postFactoryContract.target}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});