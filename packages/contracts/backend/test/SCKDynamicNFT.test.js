const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SCKDynamicNFT", function () {
  let sckNFT;
  let owner;
  let user1;
  let user2;
  let signalUpdater;
  let achievementMinter;

  const CONTRACT_NAME = "SCK Role Agents";
  const CONTRACT_SYMBOL = "SCKRA";
  const BASE_URI = "https://api.securecodeknight.com/metadata/";
  const CONTRACT_METADATA_URI = "https://api.securecodeknight.com/contract-metadata.json";

  beforeEach(async function () {
    [owner, user1, user2, signalUpdater, achievementMinter] = await ethers.getSigners();

    const SCKDynamicNFT = await ethers.getContractFactory("SCKDynamicNFT");
    sckNFT = await SCKDynamicNFT.deploy(
      CONTRACT_NAME,
      CONTRACT_SYMBOL,
      BASE_URI,
      CONTRACT_METADATA_URI
    );
    await sckNFT.waitForDeployment();

    // Grant roles
    const SIGNAL_UPDATER_ROLE = await sckNFT.SIGNAL_UPDATER_ROLE();
    const ACHIEVEMENT_MINTER_ROLE = await sckNFT.ACHIEVEMENT_MINTER_ROLE();

    await sckNFT.grantRole(SIGNAL_UPDATER_ROLE, signalUpdater.address);
    await sckNFT.grantRole(ACHIEVEMENT_MINTER_ROLE, achievementMinter.address);
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await sckNFT.name()).to.equal(CONTRACT_NAME);
      expect(await sckNFT.symbol()).to.equal(CONTRACT_SYMBOL);
    });

    it("Should set the correct owner", async function () {
      expect(await sckNFT.owner()).to.equal(owner.address);
    });

    it("Should grant correct roles to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await sckNFT.DEFAULT_ADMIN_ROLE();
      const SIGNAL_UPDATER_ROLE = await sckNFT.SIGNAL_UPDATER_ROLE();
      const ACHIEVEMENT_MINTER_ROLE = await sckNFT.ACHIEVEMENT_MINTER_ROLE();

      expect(await sckNFT.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await sckNFT.hasRole(SIGNAL_UPDATER_ROLE, owner.address)).to.be.true;
      expect(await sckNFT.hasRole(ACHIEVEMENT_MINTER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Role Agent Minting", function () {
    it("Should mint a role agent with correct data", async function () {
      const did = "did:ethr:0x123456789abcdef";
      const name = "Security Expert Alice";
      const role = "Security Expert";
      const organization = "SCK Platform";
      const initialTrustScore = 850;

      await expect(
        sckNFT.mintRoleAgent(user1.address, did, name, role, organization, initialTrustScore)
      ).to.emit(sckNFT, "RoleAgentMinted")
        .withArgs(0, did, name, role, organization, user1.address);

      const agentData = await sckNFT.getRoleAgentData(0);
      expect(agentData.did).to.equal(did);
      expect(agentData.name).to.equal(name);
      expect(agentData.role).to.equal(role);
      expect(agentData.organization).to.equal(organization);
      expect(agentData.trustScore).to.equal(initialTrustScore);
      expect(agentData.trustLevel).to.equal(3); // HIGHLY_TRUSTED
      expect(agentData.isActive).to.be.true;
      expect(agentData.isEligibleForAchievements).to.be.true;
    });

    it("Should prevent minting with duplicate DID", async function () {
      const did = "did:ethr:0x123456789abcdef";

      await sckNFT.mintRoleAgent(user1.address, did, "Agent 1", "Role 1", "Org 1", 500);

      await expect(
        sckNFT.mintRoleAgent(user2.address, did, "Agent 2", "Role 2", "Org 2", 600)
      ).to.be.revertedWith("DID already exists");
    });

    it("Should prevent minting with trust score above maximum", async function () {
      await expect(
        sckNFT.mintRoleAgent(user1.address, "did:ethr:0x123", "Agent", "Role", "Org", 1001)
      ).to.be.revertedWith("Trust score too high");
    });

    it("Should correctly calculate trust levels", async function () {
      // Test different trust levels
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x100", "Agent1", "Role", "Org", 100); // UNVERIFIED
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x300", "Agent2", "Role", "Org", 300); // BASIC
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x600", "Agent3", "Role", "Org", 600); // TRUSTED
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x800", "Agent4", "Role", "Org", 800); // HIGHLY_TRUSTED
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x950", "Agent5", "Role", "Org", 950); // ELITE

      expect((await sckNFT.getRoleAgentData(0)).trustLevel).to.equal(0); // UNVERIFIED
      expect((await sckNFT.getRoleAgentData(1)).trustLevel).to.equal(1); // BASIC
      expect((await sckNFT.getRoleAgentData(2)).trustLevel).to.equal(2); // TRUSTED
      expect((await sckNFT.getRoleAgentData(3)).trustLevel).to.equal(3); // HIGHLY_TRUSTED
      expect((await sckNFT.getRoleAgentData(4)).trustLevel).to.equal(4); // ELITE
    });
  });

  describe("Trust Signal Processing", function () {
    beforeEach(async function () {
      // Mint a test role agent
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x123", "Test Agent", "Security Expert", "SCK", 500);
    });

    it("Should process trust signal and update score", async function () {
      const tokenId = 0;
      const signalType = 0; // SECURITY_AUDIT
      const scoreImpact = 100;
      const source = "test-system";
      const metadata = '{"audit_type":"smart_contract"}';

      await expect(
        sckNFT.connect(signalUpdater).processTrustSignal(tokenId, signalType, scoreImpact, source, metadata)
      ).to.emit(sckNFT, "TrustSignalProcessed")
        .withArgs(tokenId, signalType, scoreImpact, source, signalUpdater.address);

      const agentData = await sckNFT.getRoleAgentData(tokenId);
      expect(agentData.trustScore).to.equal(600); // 500 + 100
      expect(agentData.totalSignals).to.equal(1);
    });

    it("Should prevent trust score from going below 0", async function () {
      const tokenId = 0;

      await sckNFT.connect(signalUpdater).processTrustSignal(tokenId, 0, -600, "test", "{}");

      const agentData = await sckNFT.getRoleAgentData(tokenId);
      expect(agentData.trustScore).to.equal(0); // Should be 0, not negative
    });

    it("Should prevent trust score from going above 1000", async function () {
      const tokenId = 0;

      await sckNFT.connect(signalUpdater).processTrustSignal(tokenId, 0, 600, "test", "{}");

      const agentData = await sckNFT.getRoleAgentData(tokenId);
      expect(agentData.trustScore).to.equal(1000); // Should cap at 1000
    });

    it("Should emit eligibility change event when crossing threshold", async function () {
      const tokenId = 0;
      // Agent starts with score 500 (not eligible)

      // Increase score to cross eligibility threshold
      await expect(
        sckNFT.connect(signalUpdater).processTrustSignal(tokenId, 0, 250, "test", "{}")
      ).to.emit(sckNFT, "EligibilityChanged")
        .withArgs(tokenId, false, true, 750);
    });

    it("Should only allow signal updater role to process signals", async function () {
      await expect(
        sckNFT.connect(user1).processTrustSignal(0, 0, 50, "test", "{}")
      ).to.be.reverted;
    });

    it("Should batch process multiple signals", async function () {
      // Mint additional agents
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x456", "Agent2", "Developer", "SCK", 600);
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x789", "Agent3", "Auditor", "SCK", 700);

      const tokenIds = [0, 1, 2];
      const signalTypes = [0, 1, 2]; // Different signal types
      const scoreImpacts = [50, -25, 75];
      const sources = ["system1", "system2", "system3"];
      const metadataArray = ['{"test":1}', '{"test":2}', '{"test":3}'];

      await sckNFT.connect(signalUpdater).batchProcessTrustSignals(
        tokenIds, signalTypes, scoreImpacts, sources, metadataArray
      );

      // Check results
      expect((await sckNFT.getRoleAgentData(0)).trustScore).to.equal(550); // 500 + 50
      expect((await sckNFT.getRoleAgentData(1)).trustScore).to.equal(575); // 600 - 25
      expect((await sckNFT.getRoleAgentData(2)).trustScore).to.equal(775); // 700 + 75
    });
  });

  describe("Achievement System", function () {
    beforeEach(async function () {
      // Mint an eligible role agent
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x123", "Test Agent", "Security Expert", "SCK", 850);
    });

    it("Should mint achievement for eligible agent", async function () {
      const tokenId = 0;
      const achievementType = "Security Certification";
      const title = "Smart Contract Auditor";
      const description = "Completed advanced smart contract audit training";
      const metadata = '{"certification":"expert"}';
      const isSoulbound = false;
      const imageURI = "https://example.com/badge.png";

      await expect(
        sckNFT.connect(achievementMinter).mintAchievement(
          tokenId, achievementType, title, description, metadata, isSoulbound, imageURI
        )
      ).to.emit(sckNFT, "AchievementEarned")
        .withArgs(tokenId, achievementType, title, 850, isSoulbound);

      const achievements = await sckNFT.getAchievements(tokenId);
      expect(achievements.length).to.equal(1);
      expect(achievements[0].achievementType).to.equal(achievementType);
      expect(achievements[0].title).to.equal(title);
      expect(achievements[0].trustScoreAtEarning).to.equal(850);
    });

    it("Should prevent achievement minting for ineligible agent", async function () {
      // Mint an ineligible agent
      await sckNFT.mintRoleAgent(user2.address, "did:ethr:0x456", "Low Trust Agent", "Developer", "SCK", 500);

      await expect(
        sckNFT.connect(achievementMinter).mintAchievement(
          1, "Test Achievement", "Test Title", "Test Description", "{}", false, ""
        )
      ).to.be.revertedWith("Agent not eligible for achievements");
    });

    it("Should make token soulbound when minting soulbound achievement", async function () {
      const tokenId = 0;

      await sckNFT.connect(achievementMinter).mintAchievement(
        tokenId, "Soulbound Cert", "Title", "Description", "{}", true, ""
      );

      expect(await sckNFT.isSoulbound(tokenId)).to.be.true;
    });

    it("Should only allow achievement minter role to mint achievements", async function () {
      await expect(
        sckNFT.connect(user1).mintAchievement(0, "Test", "Test", "Test", "{}", false, "")
      ).to.be.reverted;
    });
  });

  describe("Token Transfer Restrictions", function () {
    beforeEach(async function () {
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x123", "Test Agent", "Role", "Org", 850);
    });

    it("Should allow transfer of regular tokens", async function () {
      const tokenId = 0;

      await sckNFT.connect(user1).transferFrom(user1.address, user2.address, tokenId);

      expect(await sckNFT.ownerOf(tokenId)).to.equal(user2.address);
    });

    it("Should prevent transfer of soulbound tokens", async function () {
      const tokenId = 0;

      // Make token soulbound by minting soulbound achievement
      await sckNFT.connect(achievementMinter).mintAchievement(
        tokenId, "Soulbound", "Title", "Description", "{}", true, ""
      );

      await expect(
        sckNFT.connect(user1).transferFrom(user1.address, user2.address, tokenId)
      ).to.be.revertedWith("Token is soulbound and cannot be transferred");
    });
  });

  describe("Platform Statistics", function () {
    it("Should track global platform statistics", async function () {
      // Mint agents with different trust levels
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x100", "Agent1", "Role", "Org", 100); // UNVERIFIED
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x300", "Agent2", "Role", "Org", 300); // BASIC
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x800", "Agent3", "Role", "Org", 800); // HIGHLY_TRUSTED
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x950", "Agent4", "Role", "Org", 950); // ELITE

      // Process some signals
      await sckNFT.connect(signalUpdater).processTrustSignal(0, 0, 50, "test", "{}");
      await sckNFT.connect(signalUpdater).processTrustSignal(1, 1, 25, "test", "{}");

      // Mint some achievements
      await sckNFT.connect(achievementMinter).mintAchievement(2, "Test", "Title", "Desc", "{}", false, "");
      await sckNFT.connect(achievementMinter).mintAchievement(3, "Test2", "Title2", "Desc2", "{}", false, "");

      const stats = await sckNFT.getPlatformStats();

      expect(stats[0]).to.equal(4); // Total agents
      expect(stats[1]).to.equal(2); // Total signals processed
      expect(stats[2]).to.equal(2); // Total achievements
      expect(stats[3]).to.equal(2); // Eligible agents (trust level 3+ : HIGHLY_TRUSTED + ELITE)
      expect(stats[4]).to.equal(1); // Unverified agents
      expect(stats[5]).to.equal(1); // Basic agents
      expect(stats[6]).to.equal(0); // Trusted agents
      expect(stats[7]).to.equal(1); // Highly trusted agents
      expect(stats[8]).to.equal(1); // Elite agents
    });
  });

  describe("Dynamic Metadata", function () {
    beforeEach(async function () {
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x123", "Security Expert", "Security Expert", "SCK Platform", 850);
    });

    it("Should generate dynamic token URI", async function () {
      const tokenId = 0;
      const tokenURI = await sckNFT.tokenURI(tokenId);

      expect(tokenURI).to.include("data:application/json;base64,");

      // Decode and verify JSON structure
      const base64Data = tokenURI.split(",")[1];
      const jsonData = Buffer.from(base64Data, 'base64').toString();
      const metadata = JSON.parse(jsonData);

      expect(metadata.name).to.equal("Security Expert");
      expect(metadata.description).to.include("trust score 850/1000");
      expect(metadata.attributes).to.be.an("array");

      // Check for specific attributes
      const trustScoreAttr = metadata.attributes.find(attr => attr.trait_type === "Trust Score");
      expect(trustScoreAttr.value).to.equal(850);

      const trustLevelAttr = metadata.attributes.find(attr => attr.trait_type === "Trust Level");
      expect(trustLevelAttr.value).to.equal("Highly Trusted");
    });

    it("Should update metadata after trust score change", async function () {
      const tokenId = 0;

      // Process trust signal to change score
      await sckNFT.connect(signalUpdater).processTrustSignal(tokenId, 0, 100, "test", "{}");

      const tokenURI = await sckNFT.tokenURI(tokenId);
      const base64Data = tokenURI.split(",")[1];
      const jsonData = Buffer.from(base64Data, 'base64').toString();
      const metadata = JSON.parse(jsonData);

      // Should reflect new trust score (850 + 100 = 950, capped at 1000)
      const trustScoreAttr = metadata.attributes.find(attr => attr.trait_type === "Trust Score");
      expect(trustScoreAttr.value).to.equal(950);

      const trustLevelAttr = metadata.attributes.find(attr => attr.trait_type === "Trust Level");
      expect(trustLevelAttr.value).to.equal("Elite");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to set base URI", async function () {
      const newBaseURI = "https://new-api.example.com/metadata/";
      await sckNFT.setBaseURI(newBaseURI);

      // Verify by checking token URI structure
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x123", "Test", "Role", "Org", 500);
      const tokenURI = await sckNFT.tokenURI(0);

      // The metadata should reference the new base URI for images
      const base64Data = tokenURI.split(",")[1];
      const jsonData = Buffer.from(base64Data, 'base64').toString();
      const metadata = JSON.parse(jsonData);

      expect(metadata.image).to.include(newBaseURI);
    });

    it("Should allow owner to deactivate and reactivate agents", async function () {
      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x123", "Test", "Role", "Org", 500);
      const tokenId = 0;

      await sckNFT.deactivateRoleAgent(tokenId);
      expect((await sckNFT.getRoleAgentData(tokenId)).isActive).to.be.false;

      await sckNFT.reactivateRoleAgent(tokenId);
      expect((await sckNFT.getRoleAgentData(tokenId)).isActive).to.be.true;
    });

    it("Should prevent non-owners from admin functions", async function () {
      await expect(
        sckNFT.connect(user1).setBaseURI("https://example.com/")
      ).to.be.reverted;

      await sckNFT.mintRoleAgent(user1.address, "did:ethr:0x123", "Test", "Role", "Org", 500);

      await expect(
        sckNFT.connect(user1).deactivateRoleAgent(0)
      ).to.be.reverted;
    });
  });
}); 