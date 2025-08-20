### Database Summary - SCK Platform

## 🏢 **SecureCodeCorp Organization**
- **Name**: SecureCodeCorp  
- **Domain**: securecodecorp.com
- **Status**: Active with onboarding complete

## 👥 **Role Agents** (2 agents created)

### Agent 1:
Name: DevOps Engineer Role Agent
- **DID**: did:ethr:0x742d35Ccdd02392A4fF7a2B4Da71a2f9b2d6c1B1
- **Role**: DevOps Engineer
- **Trust Score**: 850/1000 ✅
- **Status**: Active, Eligible for NFT Minting

### Agent 2:
Name: Security Engineer Role Agent
- **DID**: did:ethr:0x9A8b2C4e5F1d3A7e9C2B5f8A1D4e7B0C3F6A9E2D
- **Role**: Security Engineer  
- **Trust Score**: 920/1000 ✅
- **Status**: Active, Eligible for NFT Minting

## 📊 **Trust Signals** (5 signals collected)

### Signal 1:
- **Type**: CERTIFICATION_EARNED
- **Title**: "AWS Security Certification Achieved"
- **Value**: 85
- **Role Agent**: Security Engineer
- **Verified**: ✅

### Signal 2:
- **Type**: CODE_REVIEW_COMPLETED
- **Title**: "Security Code Review - Authentication Module"  
- **Value**: 75
- **Role Agent**: DevOps Engineer
- **Verified**: ✅

### Signal 3:
- **Type**: VULNERABILITY_REPORTED
- **Title**: "SQL Injection Vulnerability Identified"
- **Value**: 90
- **Role Agent**: Security Engineer
- **Verified**: ✅

## 🏆 **Certifications** (2 active)

### Certification 1:
- **Type**: SECURITY_CLEARANCE
- **Issuer**: "SecureCodeCorp Security Team"
- **Role Agent**: DevOps Engineer
- **Status**: Active
- **Expires**: 2025-01-01

### Certification 2:  
- **Type**: AWS_CERTIFIED_SECURITY
- **Issuer**: "Amazon Web Services"
- **Role Agent**: Security Engineer
- **Status**: Active
- **Expires**: 2025-06-15

## 🔍 **Quick Database Queries**

### View Role Agents:
```sql
SELECT id, name, assignedToDid, trustScore, status 
FROM role_agents;
```

### View Trust Signals:
```sql
SELECT type, title, value, verified, roleAgentId
FROM signals 
ORDER BY createdAt DESC;
```

### View Active Certifications:
```sql
SELECT type, issuer, roleAgentId, expiresAt
FROM certifications 
WHERE verified = true;
```

## 📈 **Summary Stats**
1. **1 Organization**: SecureCodeCorp
2. **2 Role Agents**: Both for SecureCodeCorp  
3. **5 Trust Signals**: All verified
4. **2 Certifications**: Both active
5. **Trust Scores**: Range 850-920 (High trust level)

**🎯 Status**: Ready for NFT credential minting for both role agents! 