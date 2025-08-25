# 🧪 PHASE C: Basic Functionality Testing

## **Overview**
Test the core Milestone 3 enforcement system functionality.

**Estimated Time**: 1 hour
**Prerequisites**: Phase A (environment) + Phase B (database) completed

## **Step 1: Environment Verification**

First, verify your environment variables are loaded:

```bash
# Check if critical variables are set
echo "JWT_SECRET: ${JWT_SECRET:0:20}..."
echo "BUNDLE_SIGNING_SECRET: ${BUNDLE_SIGNING_SECRET:0:20}..."
echo "HMAC_SHARED_SECRET: ${HMAC_SHARED_SECRET:0:20}..."
```

**Expected**: Should show first 20 characters of each secret, not empty.

## **Step 2: API Endpoint Health Check**

Test that all enforcement endpoints respond without errors:

### **2.1 Test Bundle Compilation**
```bash
curl -X POST https://sck-plattform.vercel.app/api/v1/enforcement/bundles/compile \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "test-org",
    "version": "1.0.0",
    "artifacts": ["test-artifact"],
    "policies": ["test-policy"],
    "controls": ["test-control"]
  }'
```

**Expected**: Should return JSON response (even if error, should not be 500)

### **2.2 Test Token Issuance**
```bash
curl -X POST https://sck-plattform.vercel.app/api/v1/enforcement/tokens/issue \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "test-org",
    "artifactId": "test-artifact",
    "artifactType": "MCP_POLICY",
    "loaLevel": 4,
    "scope": ["mcp:invoke"],
    "issuerId": "test-issuer"
  }'
```

**Expected**: Should return JWT token or meaningful error

### **2.3 Test HMAC Verification**
```bash
curl -X POST https://sck-plattform.vercel.app/api/v1/enforcement/verify \
  -H "Content-Type: application/json" \
  -H "X-SCK-Signature: test-signature" \
  -H "X-SCK-Timestamp: 2025-01-25T12:00:00Z" \
  -H "X-SCK-ANS-ID: test.knaight" \
  -d '{"action": "test"}'
```

**Expected**: Should return verification result

## **Step 3: Database Connection Test**

Verify Prisma can connect to the new tables:

```bash
# Test database connection
cd apps/web
npx prisma db pull
```

**Expected**: Should introspect and show PolicyBundle, GatewayToken, EnforcementCall tables.

## **Step 4: Basic Functionality Tests**

### **4.1 Test Policy Bundle Creation**
1. Create a simple policy bundle
2. Verify it's stored in database
3. Check status progression (DRAFT → PUBLISHED → ACTIVE)

### **4.2 Test Gateway Token Lifecycle**
1. Issue a token
2. Introspect the token
3. Verify token claims
4. Revoke the token

### **4.3 Test Enforcement Call Logging**
1. Make an enforcement call
2. Verify it's logged in EnforcementCall table
3. Check metadata and decision recording

## **Step 5: Error Handling Verification**

Test that the system handles errors gracefully:

### **5.1 Missing Environment Variables**
- Remove JWT_SECRET temporarily
- Test token issuance
- Should return meaningful error, not crash

### **5.2 Invalid Input Data**
- Send malformed JSON
- Send missing required fields
- Should return validation errors

### **5.3 Database Connection Issues**
- Test with invalid DATABASE_URL
- Should handle connection failures gracefully

## **✅ PHASE C COMPLETION CHECKLIST**

- [ ] Environment variables verified and loaded
- [ ] All API endpoints respond (no 500 errors)
- [ ] Database connection to new tables working
- [ ] Policy bundle creation test passed
- [ ] Gateway token lifecycle test passed
- [ ] Enforcement call logging test passed
- [ ] Error handling tests passed
- [ ] No critical errors in logs

## **🚀 NEXT: PHASE D - OPA Integration**

Once Phase C is complete, we'll implement:
- OPA sidecar deployment
- Bundle storage configuration
- Policy enforcement testing
- Production readiness verification

## **🔍 Troubleshooting Common Issues**

### **Issue: "JWT_SECRET is not defined"**
**Solution**: Set JWT_SECRET in Vercel environment variables

### **Issue: "Table does not exist"**
**Solution**: Run Phase B database migration in Supabase

### **Issue: "500 Internal Server Error"**
**Solution**: Check environment variables and database connection

### **Issue: "Invalid JWT token"**
**Solution**: Verify JWT_SECRET is set and consistent

**Complete Phase C first, then let me know to proceed with Phase D!**
