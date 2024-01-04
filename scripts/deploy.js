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
    
    // Post Library
    const postLibrary = await hre.ethers.deployContract('PostLibrary');
    await postLibrary.waitForDeployment();

    // Post Factory
    const PostFactoryContract = await hre.ethers.getContractFactory('PostFactory', {
        libraries: {
            PostLibrary: postLibrary.target
        }
    })
    const postFactoryContract = await PostFactoryContract.deploy(procoinTokenContract.target);

    console.log(`UserLibrary deployed to ${userLibrary.target}`)
    console.log(`UserFactory deployed to ${await userFactoryContract.getAddress()}`);
    console.log(`ProCoinToken deployed to ${procoinTokenContract.target}`);
    console.log(`PostFactory deployed to ${await postFactoryContract.getAddress()}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});