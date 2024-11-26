const hre = require("hardhat");

async function main() {
  const MusicStore = await hre.ethers.getContractFactory("MusicStore");
  const musicStore = await MusicStore.deploy(); 

  await musicStore.deployed();

  console.log(`MusicStore deployed to: ${musicStore.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
