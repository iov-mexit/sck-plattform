const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SCK NFT Contract...");

  // Get the contract factory
  const SCKNFT = await hre.ethers.getContractFactory("SCKNFT");

  // Deploy the contract
  const sckNFT = await SCKNFT.deploy();

  // Wait for deployment to finish
  await sckNFT.waitForDeployment();

  const address = await sckNFT.getAddress();

  console.log("✅ SCK NFT Contract deployed to:", address);
  console.log("📋 Contract Details:");
  console.log("   - Name: SCK Digital Twin");
  console.log("   - Symbol: SCK");
  console.log("   - Owner:", await sckNFT.owner());

  // Verify contract on Etherscan (if not localhost)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
    }
  }

  console.log("\n🎯 Next Steps:");
  console.log("   1. Set up metadata API endpoint");
  console.log("   2. Configure base URI: await sckNFT.setBaseURI('https://api.securecodeknight.com/metadata/')");
  console.log("   3. Mint first digital twin");
  console.log("   4. Integrate with signal collection system");

  return address;
}

// Handle errors
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
}); 