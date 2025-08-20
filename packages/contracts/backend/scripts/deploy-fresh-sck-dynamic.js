const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying SCK Dynamic NFT Contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📱 Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    throw new Error("❌ Deployer account has no ETH for gas fees!");
  }

  // Deploy the contract
  console.log("📦 Deploying SCKDynamicNFT contract...");
  const SCKDynamicNFT = await ethers.getContractFactory("SCKDynamicNFT");

  // Constructor parameters: name, symbol, baseURI, contractMetadataURI
  const contract = await SCKDynamicNFT.deploy(
    "SCK Dynamic Role Agent NFT",                    // name
    "SCKDNFT",                                       // symbol
    "https://api.securecodeknight.com/nft/metadata/", // baseURI
    "https://api.securecodeknight.com/contract-metadata.json"  // contractMetadataURI
  );

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ SCKDynamicNFT deployed to:", contractAddress);
  console.log("👑 Owner:", deployer.address);
  console.log("🌐 Network: Sepolia");
  console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);

  // Test the mintRoleAgent function exists
  console.log("\n🧪 Testing contract functions...");
  try {
    // This should not revert (just checking function exists)
    const testCall = contract.interface.getFunction("mintRoleAgent");
    console.log("✅ mintRoleAgent function exists:", testCall.name);

    const tokenCounter = await contract._tokenIdCounter();
    console.log("✅ Token counter initialized:", tokenCounter.toString());

  } catch (error) {
    console.log("❌ Function test failed:", error.message);
  }

  console.log("\n🎯 READY FOR REAL ON-CHAIN NFT MINTING!");
  console.log("📋 Update your .env.local with:");
  console.log(`NEXT_PUBLIC_SCK_NFT_ADDRESS=${contractAddress}`);

  return {
    contractAddress,
    deployer: deployer.address,
    network: "sepolia"
  };
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main; 