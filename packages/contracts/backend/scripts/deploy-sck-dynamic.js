const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting SCK Dynamic NFT deployment...");

  // Get the contract factory
  const SCKDynamicNFT = await ethers.getContractFactory("SCKDynamicNFT");

  // Deploy parameters
  const name = "SCK Role Agents";
  const symbol = "SCKRA";
  const baseURI = "https://api.securecodeknight.com/metadata/";
  const contractMetadataURI = "https://api.securecodeknight.com/contract-metadata.json";

  console.log("📝 Deployment parameters:");
  console.log(`  Name: ${name}`);
  console.log(`  Symbol: ${symbol}`);
  console.log(`  Base URI: ${baseURI}`);
  console.log(`  Contract Metadata URI: ${contractMetadataURI}`);

  // Deploy the contract
  console.log("\n⏳ Deploying contract...");
  const sckNFT = await SCKDynamicNFT.deploy(
    name,
    symbol,
    baseURI,
    contractMetadataURI
  );

  // Wait for deployment
  await sckNFT.waitForDeployment();
  const contractAddress = await sckNFT.getAddress();

  console.log(`✅ SCK Dynamic NFT deployed to: ${contractAddress}`);

  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log(`📋 Deployed by: ${deployer.address}`);
  console.log(`💰 Deployer balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} ETH`);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");

  try {
    const deployedName = await sckNFT.name();
    const deployedSymbol = await sckNFT.symbol();
    const owner = await sckNFT.owner();

    console.log(`  ✅ Contract name: ${deployedName}`);
    console.log(`  ✅ Contract symbol: ${deployedSymbol}`);
    console.log(`  ✅ Contract owner: ${owner}`);

    // Check roles
    const DEFAULT_ADMIN_ROLE = await sckNFT.DEFAULT_ADMIN_ROLE();
    const SIGNAL_UPDATER_ROLE = await sckNFT.SIGNAL_UPDATER_ROLE();
    const ACHIEVEMENT_MINTER_ROLE = await sckNFT.ACHIEVEMENT_MINTER_ROLE();

    const hasAdminRole = await sckNFT.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
    const hasSignalRole = await sckNFT.hasRole(SIGNAL_UPDATER_ROLE, deployer.address);
    const hasAchievementRole = await sckNFT.hasRole(ACHIEVEMENT_MINTER_ROLE, deployer.address);

    console.log(`  ✅ Admin role: ${hasAdminRole ? 'Granted' : 'Not granted'}`);
    console.log(`  ✅ Signal updater role: ${hasSignalRole ? 'Granted' : 'Not granted'}`);
    console.log(`  ✅ Achievement minter role: ${hasAchievementRole ? 'Granted' : 'Not granted'}`);

  } catch (error) {
    console.error("❌ Deployment verification failed:", error);
    return;
  }

  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");

  try {
    // Test minting a role agent
    const tx = await sckNFT.mintRoleAgent(
      deployer.address,
      "did:ethr:0x123456789abcdef",
      "Test Security Expert",
      "Security Expert",
      "SCK Platform",
      850 // High trust score for testing
    );

    const receipt = await tx.wait();
    console.log(`  ✅ Test role agent minted in tx: ${receipt.hash}`);

    // Get the token ID (should be 0 for first mint)
    const tokenId = 0;
    const agentData = await sckNFT.getRoleAgentData(tokenId);

    console.log(`  ✅ Agent trust score: ${agentData.trustScore}/1000`);
    console.log(`  ✅ Agent trust level: ${agentData.trustLevel}`);
    console.log(`  ✅ NFT eligible: ${agentData.isEligibleForAchievements}`);

    // Test trust signal processing
    const signalTx = await sckNFT.processTrustSignal(
      tokenId,
      0, // SECURITY_AUDIT
      50, // +50 trust score
      "test-system",
      '{"audit_type":"smart_contract","severity":"high"}'
    );

    await signalTx.wait();
    console.log(`  ✅ Trust signal processed successfully`);

    // Check updated trust score
    const updatedAgentData = await sckNFT.getRoleAgentData(tokenId);
    console.log(`  ✅ Updated trust score: ${updatedAgentData.trustScore}/1000`);

    // Test achievement minting (agent should be eligible with score >= 750)
    const achievementTx = await sckNFT.mintAchievement(
      tokenId,
      "Security Certification",
      "Smart Contract Security Audit Expert",
      "Completed comprehensive smart contract security audit",
      '{"certification_level":"expert","issuer":"SCK Platform"}',
      false, // Not soulbound
      "https://api.securecodeknight.com/achievements/security-expert.png"
    );

    await achievementTx.wait();
    console.log(`  ✅ Achievement minted successfully`);

    // Get platform statistics
    const stats = await sckNFT.getPlatformStats();
    console.log(`  ✅ Total agents: ${stats[0]}`);
    console.log(`  ✅ Total signals: ${stats[1]}`);
    console.log(`  ✅ Total achievements: ${stats[2]}`);

  } catch (error) {
    console.error("❌ Functionality test failed:", error);
  }

  // Output deployment info for frontend integration
  console.log("\n📋 Deployment Summary for Frontend Integration:");
  console.log("=".repeat(60));
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log(`Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Block Number: ${await ethers.provider.getBlockNumber()}`);
  console.log("=".repeat(60));

  // Environment variable format
  console.log("\n📋 Environment Variables:");
  console.log(`NEXT_PUBLIC_SCK_NFT_ADDRESS=${contractAddress}`);
  console.log(`NEXT_PUBLIC_SCK_NFT_NETWORK=${(await ethers.provider.getNetwork()).name}`);
  console.log(`NEXT_PUBLIC_SCK_NFT_CHAIN_ID=${(await ethers.provider.getNetwork()).chainId}`);

  // ABI location
  console.log("\n📋 Contract ABI:");
  console.log("ABI will be available at: artifacts/contracts/SCKDynamicNFT.sol/SCKDynamicNFT.json");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("🔗 View on Etherscan: https://sepolia.etherscan.io/address/" + contractAddress);
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Deployment failed:", error);
    process.exit(1);
  }); 