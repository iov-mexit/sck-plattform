const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SCK NFT Contract", function () {
  let sckNFT;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contract
    const SCKNFT = await ethers.getContractFactory("SCKNFT");
    sckNFT = await SCKNFT.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await sckNFT.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await sckNFT.name()).to.equal("SCK Digital Twin");
      expect(await sckNFT.symbol()).to.equal("SCK");
    });

    it("Should start with 0 total digital twins", async function () {
      expect(await sckNFT.totalDigitalTwins()).to.equal(0);
    });
  });

  describe("Digital Twin Minting", function () {
    it("Should mint a digital twin successfully", async function () {
      const did = "did:sck:123456789";
      const role = "Developer";
      const organization = "SecureCorp";

      await expect(sckNFT.mintDigitalTwin(user1.address, did, role, organization))
        .to.emit(sckNFT, "DigitalTwinMinted")
        .withArgs(0, did, role, organization, user1.address);

      expect(await sckNFT.ownerOf(0)).to.equal(user1.address);
      expect(await sckNFT.totalDigitalTwins()).to.equal(1);
    });

    it("Should prevent minting with empty DID", async function () {
      await expect(
        sckNFT.mintDigitalTwin(user1.address, "", "Developer", "SecureCorp")
      ).to.be.revertedWith("DID cannot be empty");
    });

    it("Should prevent minting duplicate DID", async function () {
      const did = "did:sck:123456789";

      await sckNFT.mintDigitalTwin(user1.address, did, "Developer", "SecureCorp");

      await expect(
        sckNFT.mintDigitalTwin(user2.address, did, "Security Expert", "AnotherCorp")
      ).to.be.revertedWith("DID already exists");
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        sckNFT.connect(user1).mintDigitalTwin(user1.address, "did:sck:123", "Developer", "SecureCorp")
      ).to.be.revertedWithCustomError(sckNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Achievement Minting", function () {
    beforeEach(async function () {
      // Mint a digital twin first
      await sckNFT.mintDigitalTwin(user1.address, "did:sck:123", "Developer", "SecureCorp");
    });

    it("Should mint an achievement successfully", async function () {
      const achievementType = "certification";
      const title = "Security Expert Certification";
      const metadata = '{"provider": "SecureCodeWarrior", "score": 95}';

      await expect(sckNFT.mintAchievement(0, achievementType, title, metadata, false))
        .to.emit(sckNFT, "AchievementEarned")
        .withArgs(0, achievementType, title, false);

      const achievements = await sckNFT.getAchievements(0);
      expect(achievements.length).to.equal(1);
      expect(achievements[0].achievementType).to.equal(achievementType);
      expect(achievements[0].title).to.equal(title);
    });

    it("Should make token soulbound when achievement is soulbound", async function () {
      await sckNFT.mintAchievement(0, "certification", "Soulbound Achievement", "{}", true);

      expect(await sckNFT.isSoulbound(0)).to.be.true;
    });

    it("Should prevent minting achievement for non-existent token", async function () {
      await expect(
        sckNFT.mintAchievement(999, "certification", "Test", "{}", false)
      ).to.be.revertedWith("Digital twin does not exist");
    });

    it("Should prevent minting achievement with empty type", async function () {
      await expect(
        sckNFT.mintAchievement(0, "", "Test", "{}", false)
      ).to.be.revertedWith("Achievement type cannot be empty");
    });
  });

  describe("Soulbound Functionality", function () {
    beforeEach(async function () {
      await sckNFT.mintDigitalTwin(user1.address, "did:sck:123", "Developer", "SecureCorp");
    });

    it("Should prevent transfer of soulbound tokens", async function () {
      await sckNFT.mintAchievement(0, "certification", "Soulbound Achievement", "{}", true);

      await expect(
        sckNFT.connect(user1).transferFrom(user1.address, user2.address, 0)
      ).to.be.revertedWith("Token is soulbound and cannot be transferred");
    });

    it("Should allow transfer of non-soulbound tokens", async function () {
      await sckNFT.mintAchievement(0, "certification", "Regular Achievement", "{}", false);

      await expect(
        sckNFT.connect(user1).transferFrom(user1.address, user2.address, 0)
      ).to.not.be.reverted;
    });

    it("Should allow admin to set soulbound status", async function () {
      await sckNFT.setSoulboundStatus(0, true);
      expect(await sckNFT.isSoulbound(0)).to.be.true;

      await sckNFT.setSoulboundStatus(0, false);
      expect(await sckNFT.isSoulbound(0)).to.be.false;
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await sckNFT.mintDigitalTwin(user1.address, "did:sck:123", "Developer", "SecureCorp");
      await sckNFT.mintAchievement(0, "certification", "Test Achievement", "{}", false);
    });

    it("Should return correct digital twin data", async function () {
      const twinData = await sckNFT.getDigitalTwinData(0);
      expect(twinData.did).to.equal("did:sck:123");
      expect(twinData.role).to.equal("Developer");
      expect(twinData.organization).to.equal("SecureCorp");
      expect(twinData.isActive).to.be.true;
    });

    it("Should return correct achievement count", async function () {
      expect(await sckNFT.getAchievementCount(0)).to.equal(1);

      await sckNFT.mintAchievement(0, "activity", "Another Achievement", "{}", false);
      expect(await sckNFT.getAchievementCount(0)).to.equal(2);
    });

    it("Should find token by DID", async function () {
      expect(await sckNFT.getTokenIdByDID("did:sck:123")).to.equal(0);
    });

    it("Should check DID existence", async function () {
      expect(await sckNFT.doesDIDExist("did:sck:123")).to.be.true;
      expect(await sckNFT.doesDIDExist("did:sck:999")).to.be.false;
    });
  });

  describe("Admin Functions", function () {
    beforeEach(async function () {
      await sckNFT.mintDigitalTwin(user1.address, "did:sck:123", "Developer", "SecureCorp");
    });

    it("Should allow owner to set base URI", async function () {
      const newURI = "https://new-api.example.com/metadata/";
      await sckNFT.setBaseURI(newURI);
      expect(await sckNFT.tokenURI(0)).to.equal(newURI + "0");
    });

    it("Should allow owner to deactivate digital twin", async function () {
      await sckNFT.deactivateDigitalTwin(0);
      const twinData = await sckNFT.getDigitalTwinData(0);
      expect(twinData.isActive).to.be.false;
    });

    it("Should prevent non-owner from calling admin functions", async function () {
      await expect(
        sckNFT.connect(user1).setBaseURI("https://example.com/")
      ).to.be.revertedWithCustomError(sckNFT, "OwnableUnauthorizedAccount");
    });
  });
}); 