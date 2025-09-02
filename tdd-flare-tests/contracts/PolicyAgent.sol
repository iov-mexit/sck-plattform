// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title PolicyAgent micropayment & handover contract (minimal)
contract PolicyAgent {
    event PolicyPurchased(address indexed buyer, uint256 indexed policyId, uint256 amount);

    // pricing in wei (for tests we'll use small numbers)
    uint256 public priceWei = 1e13; // 0.00001 ETH-equivalent for test

    mapping(address => mapping(uint256 => bool)) public purchased;

    function purchasePolicy(uint256 policyId) external payable {
        require(msg.value >= priceWei, "Insufficient payment");
        purchased[msg.sender][policyId] = true;
        emit PolicyPurchased(msg.sender, policyId, msg.value);
    }

    function hasAccess(address user, uint256 policyId) external view returns (bool) {
        return purchased[user][policyId];
    }

    // admin convenience for tests: set price
    function setPrice(uint256 _priceWei) external {
        priceWei = _priceWei;
    }
}