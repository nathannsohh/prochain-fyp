const hre = require("hardhat");

async function main() {

    // User Library
    const userLibrary = await hre.ethers.deployContract('UserLibrary');
    await userLibrary.waitForDeployment();

    // User Manager
    const UserFactoryContract = await hre.ethers.getContractFactory('UserFactory', {
        libraries: {
            UserLibrary: userLibrary.target
        }
    })
    const userFactoryContract = await UserFactoryContract.deploy()

    // ProCoin Token
    const initialSupply = 10000000;
    const procoinTokenContract = await hre.ethers.deployContract('ProCoinToken', [initialSupply])
    await procoinTokenContract.waitForDeployment();

    // Post Factory
    const postFactoryContract = await hre.ethers.deployContract('PostFactory', [procoinTokenContract.target])
    await postFactoryContract.waitForDeployment();

    console.log(`UserLibrary deployed to ${userLibrary.target}`)
    console.log(`UserFactory deployed to ${await userFactoryContract.getAddress()}`);
    console.log(`ProCoinToken deployed to ${procoinTokenContract.target}`);
    console.log(`PostFactory deployed to ${postFactoryContract.target}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});