# 🚀 SCK Platform - Wallet Access & Certified Agents

## 🎯 **Feature Branch: `feature/wallet-access-and-certified-agents`**

This branch implements the second great use case for SCK Platform: **Wallet-Only Access + Tamperproof Certified Agents + Micropayments**.

---

## 🏗️ **Architecture Overview**

### **Core Components:**
1. **🔐 Wallet-Only Authentication** - Replace email/password with MetaMask/WalletConnect
2. **💸 Micropayment System** - Tiny crypto payments before premium features
3. **🤖 Tamperproof Certified Agents** - Immutable, versioned policy agents
4. **📜 Policy Lifecycle** - Draft → Approve → Sign → Store → Integrate
5. **🔗 Integration Flow** - Export policies to org compliance systems

---

## 🧪 **TDD Development Approach**

### **Why TDD First?**
- **Tests become the specification** - behavior-driven development
- **Fail fast, iterate quickly** - catch issues early
- **Real integration testing** - no mocking forced
- **CI integration** from day one

### **Test Structure:**
- **`test/hardhat/`** - Smart contract tests (Hardhat + Solidity)
- **`test/api/`** - API integration tests (Jest + Supertest)
- **`test/e2e/`** - End-to-end user flows (Playwright)

---

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
cd tdd-flare-tests
yarn install
```

### **2. Run Tests (TDD Style)**
```bash
# Smart contract tests (local Hardhat network)
yarn test:chain

# API integration tests
yarn test:api

# End-to-end tests (requires staging URL)
yarn test:e2e

# Run everything
yarn test
```

---

## 🔧 **Development Workflow**

### **Phase 1: Smart Contract Foundation**
1. **Write failing tests** for PolicyAgent behavior
2. **Implement Solidity contract** until tests pass
3. **Test on Hardhat network** (fast local development)

### **Phase 2: API Integration**
1. **Write failing tests** for purchase API endpoints
2. **Implement Next.js API routes** until tests pass
3. **Test with real Supabase** (optional integration)

### **Phase 3: User Experience**
1. **Write failing tests** for wallet connection flow
2. **Implement React components** until tests pass
3. **Test with Playwright** (E2E validation)

---

## 🌐 **Network Configuration**

### **Local Development (Default)**
- **Hardhat Network** - Fast, ephemeral, no gas costs
- **Perfect for rapid iteration** and development

### **Testnet Integration (Optional)**
- **Flare Coston Testnet** - Real blockchain testing
- **Set environment variables:**
  ```bash
  COSTON_RPC_URL=https://coston-api.flare.network/ext/bc/C/rpc
  DEPLOYER_PRIVATE_KEY=your_private_key_here
  ```

---

## 📊 **Current Status**

### **✅ Completed:**
- [x] **Project structure** - TDD test skeleton
- [x] **Smart contract** - PolicyAgent.sol
- [x] **Hardhat config** - Local + Coston networks
- [x] **First tests** - Basic purchase flow

### **🔄 In Progress:**
- [ ] **Contract compilation** - Hardhat setup
- [ ] **Test execution** - Verify TDD approach works

### **📋 Next Steps:**
- [ ] **Run first tests** (should fail initially - TDD!)
- [ ] **Fix contract issues** until tests pass
- [ ] **Add more test cases** for edge cases
- [ ] **Implement API layer** with failing tests

---

## 🎯 **Success Criteria**

### **Smart Contract Layer:**
- [ ] **Policy purchase** works correctly
- [ ] **Access control** prevents unauthorized usage
- [ ] **Events emitted** for blockchain tracking
- [ ] **Price management** allows admin updates

### **API Layer:**
- [ ] **Purchase webhook** accepts valid requests
- [ ] **Database integration** stores purchase records
- [ ] **Error handling** for invalid inputs
- [ ] **Authentication** validates wallet signatures

### **User Experience:**
- [ ] **Wallet connection** works seamlessly
- [ ] **Payment flow** guides users clearly
- [ ] **Policy access** unlocks after payment
- [ ] **Export functionality** provides compliance artifacts

---

## 🔗 **Integration Points**

### **With Existing SCK Platform:**
- **Role Agents** → **Certified Agents** (evolution)
- **External Signal Funneling** → **Policy Generation**
- **ANS Registry** → **Policy Certification & Storage**
- **Trust Constellation** → **Policy Approval Dashboard**

### **New Revenue Streams:**
- **Micropayments** for policy drafting
- **Premium features** for advanced compliance
- **Enterprise integration** APIs
- **Policy certification** services

---

## 🚨 **Important Notes**

### **Security Considerations:**
- **Private keys** should never be committed to git
- **Testnet only** for now - no mainnet deployment
- **Environment variables** for sensitive configuration

### **Development Best Practices:**
- **Write tests first** - TDD approach
- **Small commits** - incremental progress
- **Real integration** - avoid excessive mocking
- **Documentation** - keep README updated

---

## 🎉 **Ready to Build!**

**This feature branch will transform SCK Platform from a trust credentialing system into a comprehensive compliance automation platform with wallet-based access and tamperproof agents.**

**Let's start with the first failing test!** 🚀

