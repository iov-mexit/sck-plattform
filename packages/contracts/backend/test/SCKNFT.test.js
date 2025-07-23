const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SCK NFT Contract - Simplified", function () {
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
      expect(await sckNFT.name()).to.equal("SCK NFT");
      expect(await sckNFT.symbol()).to.equal("SCK");
    });

    it("Should start with 0 total supply", async function () {
      expect(await sckNFT.totalSupply()).to.equal(0);
    });
  });

  describe("NFT Minting", function () {
    it("Should mint an NFT successfully", async function () {
      const tokenURI = "https://api.securecodeknight.com/metadata/1";

      await expect(sckNFT.mint(user1.address, tokenURI))
        .to.emit(sckNFT, "TokenMinted")
        .withArgs(0, user1.address, tokenURI);

      expect(await sckNFT.ownerOf(0)).to.equal(user1.address);
      expect(await sckNFT.totalSupply()).to.equal(1);
      expect(await sckNFT.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should prevent minting to zero address", async function () {
      await expect(
        sckNFT.mint(ethers.ZeroAddress, "https://example.com/metadata/1")
      ).to.be.revertedWith("Cannot mint to zero address");
    });

    it("Should prevent minting with empty token URI", async function () {
      await expect(
        sckNFT.mint(user1.address, "")
      ).to.be.revertedWith("Token URI cannot be empty");
    });

    it("Should only allow owner to mint", async function () {
      await expect(
        sckNFT.connect(user1).mint(user1.address, "https://example.com/metadata/1")
      ).to.be.revertedWithCustomError(sckNFT, "OwnableUnauthorizedAccount");
    });

    it("Should increment token ID correctly", async function () {
      const tokenURI1 = "https://api.securecodeknight.com/metadata/1";
      const tokenURI2 = "https://api.securecodeknight.com/metadata/2";

      await sckNFT.mint(user1.address, tokenURI1);
      await sckNFT.mint(user2.address, tokenURI2);

      expect(await sckNFT.ownerOf(0)).to.equal(user1.address);
      expect(await sckNFT.ownerOf(1)).to.equal(user2.address);
      expect(await sckNFT.totalSupply()).to.equal(2);
    });
  });

  describe("Token URI Management", function () {
    beforeEach(async function () {
      await sckNFT.mint(user1.address, "https://api.securecodeknight.com/metadata/1");
    });

    it("Should return custom token URI when set", async function () {
      const customURI = "https://custom.example.com/metadata/1";
      await sckNFT.setTokenURI(0, customURI);
      expect(await sckNFT.tokenURI(0)).to.equal(customURI);
    });

    it("Should return base URI + token ID when no custom URI set", async function () {
      const baseURI = "https://api.securecodeknight.com/metadata/";
      await sckNFT.setBaseURI(baseURI);
      expect(await sckNFT.tokenURI(0)).to.equal(baseURI + "0");
    });

    it("Should emit TokenURISet event", async function () {
      const customURI = "https://custom.example.com/metadata/1";
      await expect(sckNFT.setTokenURI(0, customURI))
        .to.emit(sckNFT, "TokenURISet")
        .withArgs(0, customURI);
    });

    it("Should prevent setting token URI for non-existent token", async function () {
      await expect(
        sckNFT.setTokenURI(999, "https://example.com/metadata/1")
      ).to.be.revertedWith("Token does not exist");
    });

    it("Should prevent setting empty token URI", async function () {
      await expect(
        sckNFT.setTokenURI(0, "")
      ).to.be.revertedWith("Token URI cannot be empty");
    });

    it("Should only allow owner to set token URI", async function () {
      await expect(
        sckNFT.connect(user1).setTokenURI(0, "https://example.com/metadata/1")
      ).to.be.revertedWithCustomError(sckNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await sckNFT.mint(user1.address, "https://api.securecodeknight.com/metadata/1");
    });

    it("Should return correct total supply", async function () {
      expect(await sckNFT.totalSupply()).to.equal(1);

      await sckNFT.mint(user2.address, "https://api.securecodeknight.com/metadata/2");
      expect(await sckNFT.totalSupply()).to.equal(2);
    });

    it("Should check token existence", async function () {
      expect(await sckNFT.exists(0)).to.be.true;
      expect(await sckNFT.exists(999)).to.be.false;
    });

    it("Should return correct base URI", async function () {
      const baseURI = "https://api.securecodeknight.com/metadata/";
      expect(await sckNFT.getBaseURI()).to.equal(baseURI);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to set base URI", async function () {
      const newURI = "https://new-api.example.com/metadata/";
      await sckNFT.setBaseURI(newURI);
      expect(await sckNFT.getBaseURI()).to.equal(newURI);
    });

    it("Should prevent non-owner from setting base URI", async function () {
      await expect(
        sckNFT.connect(user1).setBaseURI("https://example.com/")
      ).to.be.revertedWithCustomError(sckNFT, "OwnableUnauthorizedAccount");
    });
  });

  describe("Token Transfers", function () {
    beforeEach(async function () {
      await sckNFT.mint(user1.address, "https://api.securecodeknight.com/metadata/1");
    });

    it("Should allow token transfers", async function () {
      await sckNFT.connect(user1).transferFrom(user1.address, user2.address, 0);
      expect(await sckNFT.ownerOf(0)).to.equal(user2.address);
    });

    it("Should prevent unauthorized transfers", async function () {
      await expect(
        sckNFT.connect(user2).transferFrom(user1.address, user2.address, 0)
      ).to.be.revertedWith("ERC721: caller is not token owner or approved");
    });
  });
}); 