const hre = require("hardhat");

async function main() {

    const userManagerContract = await hre.ethers.deployContract('UserManager')

    // const start = hre.ethers.parseEther('0.0001')
    // const decrease = hre.ethers.parseEther('0.000000041')
    // const totalSupply = 100000
    // // const floorPrice = hre.ethers.parseEther('0.01')

    // const auctionContract = await hre.ethers.deployContract("DutchAuction", [start, decrease, totalSupply]);

    await userManagerContract.waitForDeployment();


    console.log(
        `UserManager deployed to ${userManagerContract.target}`
    );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});