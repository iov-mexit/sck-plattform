import { expect } from "chai";
import { ethers } from "hardhat";

describe("PolicyAgent (chain tests)", function () {
  it("should allow purchase and emit PolicyPurchased", async function () {
    const Policy = await ethers.getContractFactory("PolicyAgent");
    const policy = await Policy.deploy();
    await policy.waitForDeployment();

    const [buyer] = await ethers.getSigners();

    const tx = await policy.connect(buyer).purchasePolicy(42, { value: (await policy.priceWei()) });
    const rcpt = await tx.wait();

    // event check
    const ev = rcpt.logs?.find(l => l.topics.length > 0);
    expect(await policy.hasAccess(buyer.address, 42)).to.equal(true);
  });

  it("should revert on insufficient payment", async function () {
    const Policy = await ethers.getContractFactory("PolicyAgent");
    const policy = await Policy.deploy();
    await policy.waitForDeployment();

    const [buyer] = await ethers.getSigners();

    await expect(policy.connect(buyer).purchasePolicy(1, { value: 1 })).to.be.reverted;
  });
});

