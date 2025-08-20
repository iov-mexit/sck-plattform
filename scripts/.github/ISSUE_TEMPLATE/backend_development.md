---
name: Backend Development
about: Backend API, database, or service implementation
title: ''
labels: 'backend, api'
assignees: ''
---

## 🛠️ Backend Development Task

**Component Type:**
- [ ] API Endpoint
- [ ] Database Schema/Migration
- [ ] External Signal Processing
- [ ] Business Logic Implementation
- [ ] Authentication/Authorization
- [ ] Background Job/Queue
- [ ] Third-party Integration

**Scope:**
- [ ] New feature implementation
- [ ] Existing feature enhancement
- [ ] Bug fix
- [ ] Performance optimization
- [ ] Security improvement

## 📊 External Signal Requirements

**Signal Integration (if applicable):**
- [ ] Processes external signals from: [source]
- [ ] Signal validation with Zod schema
- [ ] Source authentication required
- [ ] Real-time processing needed
- [ ] Historical signal tracking

**No Mock Data Policy:**
- [ ] All data comes from external signals or database
- [ ] No hardcoded test data
- [ ] Proper loading states implemented
- [ ] Error states for signal failures

## 🗄️ Database Requirements

**Schema Changes:**
- [ ] New tables/models needed
- [ ] Existing schema modifications
- [ ] Migration script required
- [ ] Data integrity constraints
- [ ] Performance considerations

**Prisma Implementation:**
- [ ] Schema.prisma updated
- [ ] Database migration created
- [ ] Prisma client generation
- [ ] Seed data script (real data only)

## 🔌 API Design

**Endpoints:**
- [ ] `GET /api/v1/...`
- [ ] `POST /api/v1/...`
- [ ] `PUT /api/v1/...`
- [ ] `DELETE /api/v1/...`

**Request/Response Format:**
```typescript
// Request
interface RequestType {
  // Define request structure
}

// Response  
interface ResponseType {
  // Define response structure
}
```

**Error Handling:**
- [ ] Proper HTTP status codes
- [ ] Detailed error messages
- [ ] Correlation ID in responses
- [ ] External signal error propagation

## ✅ Acceptance Criteria

**Functionality:**
- [ ] API endpoints work as specified
- [ ] External signal processing functional
- [ ] Database operations optimized
- [ ] Business logic correctly implemented
- [ ] Error handling comprehensive

**Organization-Controlled Backend:**
- [ ] No wallet requirements for end users
- [ ] Backend handles blockchain operations
- [ ] Traditional authentication patterns
- [ ] Organization admin controls

**Performance:**
- [ ] Response times under 200ms
- [ ] Database queries optimized
- [ ] External API calls efficient
- [ ] Caching implemented where appropriate

## 📋 Definition of Done

**Code Quality:**
- [ ] TypeScript types comprehensive
- [ ] ESLint rules passing
- [ ] No hardcoded domain strings
- [ ] Error handling robust
- [ ] Code review completed

**Testing:**
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests for external signals
- [ ] API tests with real requests
- [ ] Error scenario testing
- [ ] Performance testing

**Documentation:**
- [ ] API documentation updated
- [ ] Database schema documented
- [ ] External signal integration documented
- [ ] Code comments for complex logic

**Security:**
- [ ] Input validation comprehensive
- [ ] Authentication/authorization correct
- [ ] External signal source validation
- [ ] No sensitive data exposure
- [ ] SQL injection prevention

## 🧪 Testing Strategy

**Unit Testing:**
```typescript
// Example test structure
describe('Feature Name', () => {
  it('should process external signal correctly', () => {
    // Test external signal processing
  });
  
  it('should handle signal source validation', () => {
    // Test signal authentication
  });
});
```

**Integration Testing:**
- [ ] Real external signal API integration
- [ ] Database transaction testing
- [ ] Cross-service communication
- [ ] Error propagation testing

**Performance Testing:**
- [ ] Load testing with realistic data
- [ ] External signal processing under load
- [ ] Database query optimization
- [ ] Memory usage optimization

## 🔍 Monitoring & Observability

**Metrics:**
- [ ] Response time tracking
- [ ] External signal processing metrics
- [ ] Error rate monitoring
- [ ] Database performance metrics

**Logging:**
- [ ] Structured logging with correlation ID
- [ ] External signal processing logs
- [ ] Error logs with context
- [ ] Performance logs

**Health Checks:**
- [ ] Endpoint health check
- [ ] External signal source connectivity
- [ ] Database connectivity
- [ ] Overall service health

## 📝 Additional Context

Add any other context about the backend implementation here.