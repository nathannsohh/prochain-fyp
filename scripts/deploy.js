const hre = require("hardhat");

async function main() {

    // User Library
    const userLibrary = await hre.ethers.deployContract('UserLibrary');
    await userLibrary.waitForDeployment();

    const organisationsLibrary = await hre.ethers.deployContract('OrganisationsLibrary');
    await organisationsLibrary.waitForDeployment();

    // User Manager
    const UserFactoryContract = await hre.ethers.getContractFactory('UserFactory', {
        libraries: {
            UserLibrary: userLibrary.target,
            OrganisationsLibrary: organisationsLibrary.target
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

    // Jobs Library
    const jobsLibrary = await hre.ethers.deployContract('JobsLibrary');
    await jobsLibrary.waitForDeployment();

    // Jobs Factory
    const JobFactoryContract = await hre.ethers.getContractFactory('JobFactory', {
        libraries: {
            JobsLibrary: jobsLibrary.target
        }
    })
    const jobFactoryContract = await JobFactoryContract.deploy(procoinTokenContract.target);

    console.log(`UserLibrary deployed to ${userLibrary.target}`)
    console.log(`OrganisationLibrary deployed to ${organisationsLibrary.target}`)
    console.log(`UserFactory deployed to ${await userFactoryContract.getAddress()}`);
    console.log(`ProCoinToken deployed to ${procoinTokenContract.target}`);
    console.log(`PostFactory deployed to ${await postFactoryContract.getAddress()}`);
    console.log(`JobFactory deployed to ${await jobFactoryContract.getAddress()}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});