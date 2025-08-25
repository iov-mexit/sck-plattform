# 🔐 PHASE D: OPA Integration & Production Readiness

## **Overview**
Deploy Open Policy Agent (OPA) sidecar and complete production integration.

**Estimated Time**: 2 hours
**Prerequisites**: Phase A + B + C completed successfully

## **Step 1: OPA Sidecar Deployment**

### **1.1 Deploy OPA to Your Infrastructure**

Choose your deployment method:

#### **Option A: Docker Deployment (Recommended)**
```bash
# Create OPA configuration
mkdir -p opa-config
cd opa-config

# Create opa-config.yaml
cat > opa-config.yaml << EOF
services:
  sck-platform:
    url: https://sck-plattform.vercel.app
    headers:
      Authorization: Bearer ${OPA_ACCESS_TOKEN}

bundles:
  sck-policies:
    service: sck-platform
    resource: /api/v1/enforcement/bundles/active
    polling:
      min_delay_seconds: 10
      max_delay_seconds: 60

decision_logs:
  service: sck-platform
  resource: /api/v1/enforcement/logs
  reporting:
    min_delay_seconds: 5
    max_delay_seconds: 30

status:
  service: sck-platform
  resource: /api/v1/enforcement/status
EOF

# Run OPA container
docker run -d \
  --name opa-sck \
  --restart unless-stopped \
  -p 8181:8181 \
  -v $(pwd)/opa-config.yaml:/opa-config.yaml \
  openpolicyagent/opa:latest \
  run --server --config-file=/opa-config.yaml
```

#### **Option B: Kubernetes Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: opa-sck
spec:
  replicas: 1
  selector:
    matchLabels:
      app: opa-sck
  template:
    metadata:
      labels:
        app: opa-sck
    spec:
      containers:
      - name: opa
        image: openpolicyagent/opa:latest
        ports:
        - containerPort: 8181
        args:
        - run
        - --server
        - --config-file=/opa-config.yaml
        volumeMounts:
        - name: opa-config
          mountPath: /opa-config.yaml
          subPath: opa-config.yaml
      volumes:
      - name: opa-config
        configMap:
          name: opa-sck-config
```

### **1.2 Configure Bundle Storage**

Create a bundle storage endpoint in your SCK platform:

```typescript
// Add to your enforcement API
app.get('/api/v1/enforcement/bundles/active', async (req, res) => {
  const bundles = await prisma.policyBundle.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { activatedAt: 'desc' }
  });
  
  // Return in OPA bundle format
  res.json({
    bundles: bundles.map(bundle => ({
      url: bundle.storageUrl,
      size: bundle.bundleSize,
      hash: bundle.bundleHash
    }))
  });
});
```

## **Step 2: Policy Bundle Integration**

### **2.1 Create Sample Policy Bundle**

Create a test Rego policy:

```rego
# policies/mcp-access.rego
package mcp.access

import future.keywords.if
import future.keywords.in

default allow := false

allow if {
    input.method == "GET"
    input.path = "/api/v1/read"
    input.user.role == "reader"
}

allow if {
    input.method == "POST"
    input.path = "/api/v1/write"
    input.user.role == "writer"
    input.user.loa_level >= 4
}

deny if {
    input.method == "DELETE"
    input.path = "/api/v1/admin"
    input.user.role != "admin"
}
```

### **2.2 Test Bundle Compilation**

```bash
# Compile and publish test bundle
curl -X POST https://sck-plattform.vercel.app/api/v1/enforcement/bundles/compile \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "test-org",
    "version": "1.0.0",
    "artifacts": ["mcp-access"],
    "policies": ["mcp-access.rego"],
    "controls": ["access-control"]
  }'
```

## **Step 3: Policy Enforcement Testing**

### **3.1 Test OPA Policy Evaluation**

```bash
# Test policy evaluation
curl -X POST http://localhost:8181/v1/data/mcp/access \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "method": "GET",
      "path": "/api/v1/read",
      "user": {
        "role": "reader",
        "loa_level": 3
      }
    }
  }'
```

**Expected**: `{"result": {"allow": true}}`

### **3.2 Test Access Denial**

```bash
curl -X POST http://localhost:8181/v1/data/mcp/access \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "method": "DELETE",
      "path": "/api/v1/admin",
      "user": {
        "role": "user",
        "loa_level": 2
      }
    }
  }'
```

**Expected**: `{"result": {"allow": false, "deny": true}}`

## **Step 4: Production Integration**

### **4.1 Health Check Endpoint**

Add health check for OPA integration:

```typescript
// Add to your health API
app.get('/api/v1/enforcement/health', async (req, res) => {
  try {
    // Check OPA status
    const opaHealth = await fetch('http://localhost:8181/health');
    const opaStatus = await opaHealth.json();
    
    // Check bundle status
    const activeBundles = await prisma.policyBundle.count({
      where: { status: 'ACTIVE' }
    });
    
    res.json({
      status: 'healthy',
      opa: opaStatus,
      bundles: {
        active: activeBundles,
        last_update: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

### **4.2 Monitoring & Alerting**

Set up monitoring for:
- OPA sidecar health
- Bundle update frequency
- Policy evaluation latency
- Enforcement decision rates

## **Step 5: Production Readiness Verification**

### **5.1 Load Testing**

Test system under load:
```bash
# Test concurrent policy evaluations
for i in {1..100}; do
  curl -X POST http://localhost:8181/v1/data/mcp/access \
    -H "Content-Type: application/json" \
    -d '{"input": {"method": "GET", "path": "/api/v1/read", "user": {"role": "reader"}}}' &
done
wait
```

### **5.2 Security Testing**

Verify security measures:
- JWT token validation
- HMAC signature verification
- ANS identity pinning
- Rate limiting
- Input validation

## **✅ PHASE D COMPLETION CHECKLIST**

- [ ] OPA sidecar deployed and running
- [ ] Bundle storage configured
- [ ] Sample policies created and tested
- [ ] Policy enforcement working
- [ ] Health checks implemented
- [ ] Monitoring configured
- [ ] Load testing completed
- [ ] Security testing passed
- [ ] Production deployment ready

## **🎉 MILESTONE 3 COMPLETE!**

Once Phase D is complete, you'll have:
- ✅ **Complete MCP Enforcement System**
- ✅ **OPA Policy Enforcement**
- ✅ **Production-Ready Configuration**
- ✅ **Comprehensive Testing**
- ✅ **Monitoring & Alerting**

## **🚀 Next Steps After Milestone 3**

- **Milestone 4**: Advanced Policy Management
- **Milestone 5**: Trust Economy Integration
- **Production Rollout**: Gradual deployment to production users
- **Performance Optimization**: Fine-tune based on real usage

**Complete Phase D to finish Milestone 3! 🎯**
