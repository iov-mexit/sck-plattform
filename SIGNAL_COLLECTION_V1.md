# 🎯 Signal Collection System V1 - Minimal Approach

## Overview

This is a **minimal, focused signal collection system** designed to ingest external API/webhook data from sources like Secure Code Warrior, certification providers, and other security platforms. It's built for speed and simplicity, not feature completeness.

## 🎯 **V1 Goals**

✅ **Ingest signals** from external APIs/webhooks  
✅ **Associate signals** with digital twins  
✅ **Store basic data** (type, title, value, source, url, metadata)  
✅ **Show signal count** and recent signals per digital twin  

🚫 **Skip for now**: Verification logic, audit logging, complex analytics, role-matching

## 📦 **Minimal Schema**

### Signal Schema
```typescript
const SignalSchema = z.object({
  type: z.enum(['certification', 'activity']),
  title: z.string(),
  value: z.number().optional(),
  source: z.enum(['securecodewarrior', 'certification_provider', 'manual']),
  url: z.string().url().optional(),
  metadata: z.record(z.any()).optional(), // dump raw API data
  digitalTwinId: z.string()
});
```

### Database Model
```sql
model Signal {
  id              String   @id @default(cuid())
  type            String
  title           String
  description     String?
  value           Float?
  source          String
  url             String? // for external reference
  metadata        Json?   // dump raw API data
  verified        Boolean  @default(false)
  digitalTwinId   String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## 🚀 **Quick Start**

### 1. Create a Signal
```typescript
import { signalCollection } from '@/lib/signal-collection';

// Create a certification signal
const signal = await signalCollection.createSignal({
  type: 'certification',
  title: 'AWS Security Specialty',
  value: 100,
  source: 'certification_provider',
  url: 'https://aws.amazon.com/certification',
  metadata: {
    credentialId: 'AWS-SEC-12345',
    issuerUrl: 'https://aws.amazon.com',
    expirationDate: '2025-06-30'
  },
  digitalTwinId: 'dt-123'
});
```

### 2. Get Signals for a Digital Twin
```typescript
// Get all signals
const signals = await signalCollection.getSignalsByDigitalTwin('dt-123');

// Get only certifications
const certifications = await signalCollection.getSignalsByDigitalTwin('dt-123', {
  type: 'certification'
});

// Get recent signals
const recent = await signalCollection.getRecentSignals('dt-123', 5);

// Get signal count
const count = await signalCollection.getSignalCount('dt-123');
```

### 3. Bulk Import
```typescript
// Import multiple signals from external API
const results = await signalCollection.bulkImportSignals([
  {
    type: 'activity',
    title: 'Security Code Review',
    source: 'securecodewarrior',
    digitalTwinId: 'dt-123'
  },
  {
    type: 'certification',
    title: 'CISSP Certification',
    source: 'certification_provider',
    digitalTwinId: 'dt-123'
  }
]);

console.log(`Imported ${results.success} signals, ${results.failed} failed`);
```

## 📊 **API Endpoints**

### Create Signal
```http
POST /api/v1/signals
Content-Type: application/json

{
  "type": "certification",
  "title": "AWS Security Specialty",
  "value": 100,
  "source": "certification_provider",
  "url": "https://aws.amazon.com/certification",
  "metadata": {
    "credentialId": "AWS-SEC-12345"
  },
  "digitalTwinId": "dt-123"
}
```

### Get Signals
```http
GET /api/v1/signals?digitalTwinId=dt-123&type=certification&limit=10
```

### Get Statistics
```http
GET /api/v1/signals/statistics?digitalTwinId=dt-123
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "recent": 5,
    "recentSignals": [
      {
        "id": "signal-123",
        "type": "certification",
        "title": "AWS Security Specialty",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

## 🎨 **UI Components**

### SignalCollection Component
```tsx
import { SignalCollection } from '@/components/signal-collection';

function DigitalTwinPage({ digitalTwinId }: { digitalTwinId: string }) {
  return (
    <div>
      <h1>Digital Twin Signals</h1>
      <SignalCollection digitalTwinId={digitalTwinId} />
    </div>
  );
}
```

### SignalAnalytics Component
```tsx
import { SignalAnalytics } from '@/components/signal-analytics';

function AnalyticsPage({ digitalTwinId }: { digitalTwinId: string }) {
  return (
    <div>
      <h1>Signal Analytics</h1>
      <SignalAnalytics digitalTwinId={digitalTwinId} />
    </div>
  );
}
```

## 🔗 **External Integrations**

### Secure Code Warrior Webhook
```typescript
// Example webhook handler
app.post('/webhook/securecodewarrior', async (req, res) => {
  const { digitalTwinId, activity } = req.body;
  
  await signalCollection.createSignal({
    type: 'activity',
    title: activity.title,
    value: activity.score,
    source: 'securecodewarrior',
    url: activity.certificateUrl,
    metadata: activity, // dump all raw data
    digitalTwinId
  });
  
  res.json({ success: true });
});
```

### Certification Provider API
```typescript
// Example API integration
async function syncCertifications(digitalTwinId: string) {
  const certifications = await fetchCertificationsFromProvider();
  
  const signals = certifications.map(cert => ({
    type: 'certification',
    title: cert.name,
    value: cert.score,
    source: 'certification_provider',
    url: cert.verificationUrl,
    metadata: cert,
    digitalTwinId
  }));
  
  const results = await signalCollection.bulkImportSignals(signals);
  return results;
}
```

## 🎯 **Use Cases**

### 1. **Secure Code Warrior Integration**
- Webhook receives training completion events
- Creates activity signals with scores
- Links to training certificates

### 2. **Certification Provider Integration**
- API syncs certification data
- Creates certification signals
- Includes verification URLs

### 3. **Manual Entry**
- Users manually add activities
- Simple form for quick entry
- Basic validation

## 🚀 **Next Steps (V2)**

Once you have real signals flowing, consider adding:

### **Verification System**
```typescript
// Future: Add verification
await signalCollection.verifySignal(signalId, {
  verified: true,
  method: 'manual_review'
});
```

### **Advanced Analytics**
```typescript
// Future: Add detailed statistics
const stats = await signalCollection.getSignalStatistics(digitalTwinId);
// - By type breakdown
// - Value analysis
// - Trend analysis
```

### **Rate Limiting**
```typescript
// Future: Add protection
const signal = await signalCollection.createSignal(data, {
  skipRateLimit: false // enforce limits
});
```

## 📋 **Best Practices**

### **1. Keep It Simple**
- Focus on ingestion, not analysis
- Store raw API data in metadata
- Don't over-engineer validation

### **2. External Data First**
- Design for webhook/API integration
- Handle bulk imports efficiently
- Preserve original data structure

### **3. Minimal UI**
- Show signal count and recent signals
- Simple forms for manual entry
- Basic filtering by type

### **4. Error Handling**
- Graceful failure for invalid data
- Structured error reporting
- Retry logic for bulk operations

## 🎯 **Success Metrics**

### **V1 Success Criteria**
- ✅ **Signal Ingestion**: Successfully receive external data
- ✅ **Digital Twin Association**: Link signals to twins
- ✅ **Basic Display**: Show signal count and recent signals
- ✅ **Bulk Operations**: Handle multiple signals efficiently

### **Technical Metrics**
- **API Response Time**: <200ms
- **Bulk Import Success**: >95%
- **Data Integrity**: No signal loss
- **Error Rate**: <5%

## 🔄 **Development Workflow**

### **Daily Development**
```bash
# Test signal creation
curl -X POST http://localhost:3000/api/v1/signals \
  -H "Content-Type: application/json" \
  -d '{
    "type": "certification",
    "title": "Test Cert",
    "source": "manual",
    "digitalTwinId": "dt-1"
  }'

# Check statistics
curl http://localhost:3000/api/v1/signals/statistics?digitalTwinId=dt-1
```

### **Testing**
```bash
# Run signal tests
npm run test:signals

# Test API endpoints
npm run test:api
```

---

**V1 Philosophy**: "Simple Box" approach - capture raw signals with just enough structure. Don't build infrastructure for things that aren't happening yet. Focus on getting real data flowing first, then add complexity based on actual needs. 