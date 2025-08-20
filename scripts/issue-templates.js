#!/usr/bin/env node

/**
 * Issue Templates for SCK Platform Development
 * 
 * Generates GitHub issue templates with proper checklists and criteria
 * that align with SCK's development principles:
 * - External signal funneling architecture
 * - No mock data policy
 * - Organization-controlled backend
 * - Traditional UX patterns
 */

const fs = require('fs');
const path = require('path');

const TEMPLATES = {
  feature: {
    name: 'Feature Request',
    about: 'Suggest a new feature for the SCK Platform',
    filename: 'feature_request.md'
  },
  bug: {
    name: 'Bug Report',
    about: 'Report a bug in the SCK Platform',
    filename: 'bug_report.md'
  },
  security: {
    name: 'Security Issue',
    about: 'Report a security vulnerability or implement security feature',
    filename: 'security_issue.md'
  },
  integration: {
    name: 'External Signal Integration',
    about: 'Add or modify external signal source integration',
    filename: 'signal_integration.md'
  },
  ans: {
    name: 'ANS Integration',
    about: 'ANS Registry integration or cross-domain functionality',
    filename: 'ans_integration.md'
  },
  backend: {
    name: 'Backend Development',
    about: 'Backend API, database, or service implementation',
    filename: 'backend_development.md'
  },
  frontend: {
    name: 'Frontend Development',
    about: 'UI component, page, or frontend feature implementation',
    filename: 'frontend_development.md'
  }
};

class IssueTemplateGenerator {
  constructor(outputDir = '.github/ISSUE_TEMPLATE') {
    this.outputDir = outputDir;
    this.templatesDir = path.join(process.cwd(), outputDir);
  }

  generateAll() {
    console.log('🎯 Generating SCK Platform issue templates...');

    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }

    for (const [type, config] of Object.entries(TEMPLATES)) {
      this.generateTemplate(type, config);
    }

    this.generateConfig();
    console.log('✅ All issue templates generated successfully!');
  }

  generateTemplate(type, config) {
    const template = this.getTemplateContent(type, config);
    const filepath = path.join(this.templatesDir, config.filename);

    fs.writeFileSync(filepath, template, 'utf8');
    console.log(`📝 Generated: ${config.filename}`);
  }

  generateConfig() {
    const configContent = this.getConfigContent();
    const configPath = path.join(this.templatesDir, 'config.yml');

    fs.writeFileSync(configPath, configContent, 'utf8');
    console.log('⚙️  Generated: config.yml');
  }

  getTemplateContent(type, config) {
    const frontmatter = `---
name: ${config.name}
about: ${config.about}
title: ''
labels: '${this.getDefaultLabels(type)}'
assignees: ''
---

`;

    switch (type) {
      case 'feature':
        return frontmatter + this.getFeatureTemplate();
      case 'bug':
        return frontmatter + this.getBugTemplate();
      case 'security':
        return frontmatter + this.getSecurityTemplate();
      case 'integration':
        return frontmatter + this.getIntegrationTemplate();
      case 'ans':
        return frontmatter + this.getANSTemplate();
      case 'backend':
        return frontmatter + this.getBackendTemplate();
      case 'frontend':
        return frontmatter + this.getFrontendTemplate();
      default:
        return frontmatter + this.getGenericTemplate();
    }
  }

  getDefaultLabels(type) {
    const labelMap = {
      feature: 'feature, enhancement',
      bug: 'bug',
      security: 'security, high-priority',
      integration: 'integration, external-signals',
      ans: 'ans-integration, cross-domain',
      backend: 'backend, api',
      frontend: 'frontend, ui'
    };
    return labelMap[type] || 'enhancement';
  }

  getFeatureTemplate() {
    return `## 🎯 Feature Description

**What feature are you requesting?**
A clear and concise description of what you want to happen.

**Which part of SCK Platform does this affect?**
- [ ] Role Agent Management
- [ ] External Signal Processing
- [ ] ANS Registry Integration
- [ ] NFT Minting/Anchoring
- [ ] Trust Constellation
- [ ] Organization Admin Panel
- [ ] Cross-Domain Communication

**External Signal Integration Required?**
- [ ] Yes - requires new external signal source
- [ ] Yes - modifies existing signal processing
- [ ] No - uses existing signals only
- [ ] N/A - no signal dependency

## 🏗️ Implementation Approach

**Proposed solution:**
A clear and concise description of what you want to happen.

**Alternatives considered:**
A clear and concise description of any alternative solutions or features you've considered.

## ✅ Acceptance Criteria

**MUST comply with SCK Platform principles:**
- [ ] No mock data - all data from external signals or database APIs
- [ ] Traditional UX patterns (no wallet requirement for end users)
- [ ] Organization-controlled backend operations
- [ ] External signal source attribution
- [ ] Cross-domain integration if applicable

**Feature-specific criteria:**
- [ ] 
- [ ] 
- [ ] 

## 📋 Definition of Done

**Code Quality:**
- [ ] TypeScript types implemented
- [ ] Unit tests written and passing
- [ ] Integration tests for external signals
- [ ] No hardcoded domain strings
- [ ] Follows SCK coding patterns

**External Signal Compliance:**
- [ ] Uses real external signal sources
- [ ] Proper signal source attribution
- [ ] Signal validation implemented
- [ ] Error handling for signal failures

**Documentation:**
- [ ] API documentation updated
- [ ] User guide updated if applicable
- [ ] External signal integration documented

**Review & Deployment:**
- [ ] Code review completed
- [ ] Security review if applicable
- [ ] Cross-domain testing completed
- [ ] Deployment verification

## 🔗 Related Issues

- Related to #
- Depends on #
- Blocks #

## 📝 Additional Context

Add any other context, screenshots, or examples about the feature request here.`;
  }

  getBugTemplate() {
    return `## 🐛 Bug Description

**Describe the bug**
A clear and concise description of what the bug is.

**Which component is affected?**
- [ ] Role Agent Creation/Management
- [ ] External Signal Processing
- [ ] ANS Registry Integration
- [ ] NFT Minting/Contract
- [ ] Trust Constellation Visualization
- [ ] Organization Admin Panel
- [ ] Cross-Domain Communication
- [ ] Authentication (Magic Link)

## 🔄 Reproduction Steps

**To Reproduce:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior:**
A clear and concise description of what you expected to happen.

**Actual behavior:**
A clear and concise description of what actually happened.

## 🌍 Environment

**SCK Platform Environment:**
- Domain: [secure-knaight.io / secure-knaight.eu / localhost]
- Browser: [e.g. Chrome 91, Safari 14]
- Operating System: [e.g. macOS, Windows, Linux]
- User Role: [Organization Admin / Role Agent / External User]

**External Signal Context:**
- Signal Source: [SCW, ISACA, GitHub, etc.]
- Signal Type: [Trust Score, Certification, Audit Result]
- Last Signal Received: [timestamp]

## 📊 External Signal Data

**If related to external signals:**
- [ ] Signal processing failure
- [ ] Signal source authentication issue
- [ ] Signal validation error
- [ ] ANS registration failure

**Signal Details:**
\`\`\`json
{
  "signalSource": "",
  "signalType": "",
  "timestamp": "",
  "errorMessage": ""
}
\`\`\`

## 🔧 Debug Information

**Console Errors:**
\`\`\`
Paste console errors here
\`\`\`

**Network Requests:**
\`\`\`
Paste relevant network request details
\`\`\`

**Correlation ID (if available):**
\`\`\`
paste-correlation-id-here
\`\`\`

## 📸 Screenshots

If applicable, add screenshots to help explain your problem.

## ✅ Fix Validation

**How to verify the fix:**
- [ ] 
- [ ] 
- [ ] 

**Regression testing:**
- [ ] External signal processing still works
- [ ] ANS integration unaffected
- [ ] No new security vulnerabilities
- [ ] Cross-domain communication intact

## 🔗 Related Issues

- Related to #
- Duplicate of #
- Caused by #`;
  }

  getSecurityTemplate() {
    return `## 🔐 Security Issue Type

**Issue Classification:**
- [ ] Vulnerability Report
- [ ] Security Enhancement
- [ ] Compliance Requirement
- [ ] External Signal Security

**Severity Level:**
- [ ] Critical (immediate action required)
- [ ] High (fix within 24 hours)
- [ ] Medium (fix within 1 week)
- [ ] Low (fix within 1 month)

## 🎯 Security Context

**Affected Components:**
- [ ] External Signal Authentication
- [ ] ANS Registration Signing
- [ ] Cross-Domain Communication
- [ ] NFT Contract Interactions
- [ ] Organization Data Access
- [ ] API Authentication/Authorization

**Attack Vector:**
- [ ] External Signal Injection
- [ ] Cross-Domain Request Forgery
- [ ] Unauthorized ANS Registration
- [ ] NFT Contract Vulnerability
- [ ] Data Exposure
- [ ] Authentication Bypass

## 🔍 Vulnerability Details

**Description:**
Provide a clear description of the security issue.

**Steps to Reproduce:**
1. 
2. 
3. 

**Impact:**
What is the potential impact of this vulnerability?

**Affected External Signals:**
- Signal Sources: [SCW, ISACA, GitHub, etc.]
- Data Types: [Trust Scores, Certifications, etc.]
- Authentication Methods: [API Keys, HMAC, etc.]

## 🛡️ Proposed Solution

**Mitigation Strategy:**
How should this be fixed?

**External Signal Security:**
- [ ] Enhanced signal source validation
- [ ] Improved signature verification
- [ ] Rate limiting for signal endpoints
- [ ] Signal source authentication audit

**Cross-Domain Security:**
- [ ] CORS policy review
- [ ] Domain validation enhancement
- [ ] ANS registration security
- [ ] Verification endpoint protection

## ✅ Security Checklist

**Implementation Requirements:**
- [ ] Security review by team lead
- [ ] Penetration testing completed
- [ ] External signal security validated
- [ ] Cross-domain security tested
- [ ] Compliance requirements met

**Documentation:**
- [ ] Security documentation updated
- [ ] Incident response plan updated
- [ ] External signal security guide updated

**Verification:**
- [ ] Security scan passed
- [ ] Manual security testing completed
- [ ] Third-party security review (if critical)

## 🚨 Disclosure Policy

**For vulnerability reports:**
- [ ] This is a responsible disclosure
- [ ] I have not shared this vulnerability publicly
- [ ] I understand SCK's security response process

**Timeline:**
- Discovery Date: 
- Initial Report: 
- Expected Fix: 

## 🔗 References

- Related security advisories: 
- Documentation: 
- External resources: `;
  }

  getIntegrationTemplate() {
    return `## 🔌 External Signal Integration

**Signal Source Information:**
- Source Name: [SCW, ISACA, GitHub, etc.]
- Signal Type: [Trust Score, Certification, Audit Result, etc.]
- API Documentation: [link to external API docs]
- Authentication Method: [API Key, OAuth, HMAC, etc.]

**Integration Type:**
- [ ] New signal source integration
- [ ] Existing signal source modification
- [ ] Signal processing enhancement
- [ ] Signal validation improvement

## 📊 Signal Schema

**External Signal Format:**
\`\`\`json
{
  "signalType": "",
  "source": "",
  "trustScore": 0,
  "metadata": {},
  "timestamp": "",
  "signature": ""
}
\`\`\`

**Required Fields:**
- [ ] Signal source identifier
- [ ] Trust score/rating value
- [ ] Timestamp
- [ ] Authentication signature
- [ ] Metadata (certifications, etc.)

## 🏗️ Implementation Requirements

**External Signal Processing:**
- [ ] Signal ingestion endpoint (\`/api/v1/signals\`)
- [ ] Source authentication validation
- [ ] Signal format validation (Zod schema)
- [ ] Real-time signal processing
- [ ] Signal source attribution storage

**ANS Integration:**
- [ ] Auto-registration trigger on signal update
- [ ] ANS payload update with new signal data
- [ ] Cross-domain sync verification
- [ ] Public verification endpoint update

**Role Agent Updates:**
- [ ] Trust score recalculation
- [ ] Level assignment review
- [ ] NFT eligibility check
- [ ] Constellation visualization update

## ✅ Acceptance Criteria

**Signal Integration:**
- [ ] External API connection established
- [ ] Authentication working correctly
- [ ] Signal validation implemented
- [ ] Error handling for API failures
- [ ] Rate limiting for external requests

**Data Processing:**
- [ ] Real-time signal processing
- [ ] Source attribution maintained
- [ ] No mock or placeholder data
- [ ] Signal history tracking
- [ ] Correlation ID propagation

**ANS Integration:**
- [ ] Auto-registration on signal update
- [ ] Public verification API updated
- [ ] Cross-domain communication tested
- [ ] ANS payload validation

## 📋 Definition of Done

**Technical Implementation:**
- [ ] Zod schema for signal validation
- [ ] TypeScript types for signal data
- [ ] Unit tests for signal processing
- [ ] Integration tests with external API
- [ ] Error handling and retry logic

**Security & Compliance:**
- [ ] Signal source authentication verified
- [ ] API security review completed
- [ ] Rate limiting implemented
- [ ] Input validation comprehensive
- [ ] No security vulnerabilities

**Documentation:**
- [ ] External signal source documented
- [ ] API integration guide updated
- [ ] Signal processing flow documented
- [ ] Troubleshooting guide created

**Monitoring & Observability:**
- [ ] Signal processing metrics added
- [ ] Error monitoring configured
- [ ] Alert thresholds set
- [ ] Health check integration

## 🧪 Testing Strategy

**External API Testing:**
- [ ] Mock external API for unit tests
- [ ] Integration tests with real API
- [ ] Error scenario testing
- [ ] Rate limit handling testing

**Signal Processing Testing:**
- [ ] Valid signal processing
- [ ] Invalid signal rejection
- [ ] Signal source verification
- [ ] Real-time update testing

**ANS Integration Testing:**
- [ ] Auto-registration testing
- [ ] Cross-domain communication
- [ ] Public verification API
- [ ] Error propagation testing

## 🔗 External Resources

- API Documentation: 
- Authentication Guide: 
- Rate Limits: 
- Status Page: 

## 📝 Additional Context

Add any other context about the external signal integration here.`;
  }

  getANSTemplate() {
    return `## 🌐 ANS Integration Issue

**Integration Type:**
- [ ] Auto-registration enhancement
- [ ] Cross-domain communication
- [ ] Public verification API
- [ ] ANS Registry feature
- [ ] Domain configuration
- [ ] Verification widget

**Affected Domains:**
- [ ] secure-knaight.io (SCK Platform)
- [ ] secure-knaight.eu (EU Compliance)
- [ ] knaight.site (ANS Registry)
- [ ] Cross-domain integration

## 🔗 Cross-Domain Context

**SCK Platform → ANS Flow:**
- [ ] Role agent creation triggers ANS registration
- [ ] External signal updates propagate to ANS
- [ ] Trust score changes update ANS records
- [ ] Level promotions trigger ANS updates

**ANS Registry Features:**
- [ ] Agent search and discovery
- [ ] Public verification endpoints
- [ ] Rate-limited public APIs
- [ ] Embeddable verification widget

## 🏗️ Implementation Requirements

**Auto-Registration:**
- [ ] Generate ANS identifier: \`{level}-{role}.{org-domain}.knaight\`
- [ ] HMAC/DID signing for security
- [ ] Idempotent registration (safe to retry)
- [ ] Correlation ID tracking
- [ ] Retry queue for failures

**Public Verification:**
- [ ] Verification-as-a-Service APIs
- [ ] Rate limiting by IP/API key
- [ ] Response caching for performance
- [ ] Graceful degradation on failures

**Cross-Domain Security:**
- [ ] CORS configuration validated
- [ ] Origin validation implemented
- [ ] No hardcoded domain strings
- [ ] Environment-specific configuration

## ✅ Acceptance Criteria

**Auto-Registration:**
- [ ] Role agents auto-register to ANS
- [ ] Level-based naming convention (\`L{level} {role}\`)
- [ ] Qualification metadata included
- [ ] Verification endpoint provided
- [ ] Registration status tracking

**Public Discovery:**
- [ ] Search by qualification level
- [ ] Filter by role and organization
- [ ] Public verification API functional
- [ ] Rate limiting protective
- [ ] Caching improves performance

**Cross-Domain Integration:**
- [ ] Secure communication between domains
- [ ] No sensitive data exposed publicly
- [ ] Proper error handling across domains
- [ ] Real-time sync verification

## 📋 Definition of Done

**Backend Implementation:**
- [ ] Cross-domain APIs implemented
- [ ] Security measures in place
- [ ] Rate limiting configured
- [ ] Correlation ID tracking
- [ ] Error handling comprehensive

**Frontend Integration:**
- [ ] ANS status components functional
- [ ] Cross-domain UI working
- [ ] Verification widget embeddable
- [ ] Real-time updates working
- [ ] Mobile responsive design

**Security & Compliance:**
- [ ] CORS policies correct
- [ ] Domain validation secure
- [ ] No hardcoded domains
- [ ] Authentication secure
- [ ] Rate limiting effective

**Documentation:**
- [ ] Cross-domain integration guide
- [ ] API documentation complete
- [ ] Widget integration examples
- [ ] Troubleshooting guide

## 🔧 Testing Requirements

**Cross-Domain Testing:**
- [ ] Local development setup tested
- [ ] Staging environment validated
- [ ] Production domain configuration
- [ ] Cross-domain error handling

**ANS Integration Testing:**
- [ ] Auto-registration flow tested
- [ ] Public verification API tested
- [ ] Widget embedding tested
- [ ] Rate limiting validated

**Security Testing:**
- [ ] CORS policies tested
- [ ] Authentication flow verified
- [ ] Input validation comprehensive
- [ ] No data leakage confirmed

## 🌍 Environment Configuration

**Development:**
- SCK Platform: \`http://localhost:3000\`
- ANS Registry: \`http://localhost:3001\`

**Staging:**
- SCK Platform: \`https://staging.secure-knaight.io\`
- ANS Registry: \`https://staging.knaight.site\`

**Production:**
- SCK Platform: \`https://secure-knaight.io\`
- ANS Registry: \`https://knaight.site\`

## 🔗 Related Documentation

- Domain Strategy: DOMAIN_STRATEGY.md
- Cross-Domain Setup: 
- ANS Registry API: 
- Security Policies: `;
  }

  getBackendTemplate() {
    return `## 🛠️ Backend Development Task

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
- [ ] \`GET /api/v1/...\`
- [ ] \`POST /api/v1/...\`
- [ ] \`PUT /api/v1/...\`
- [ ] \`DELETE /api/v1/...\`

**Request/Response Format:**
\`\`\`typescript
// Request
interface RequestType {
  // Define request structure
}

// Response  
interface ResponseType {
  // Define response structure
}
\`\`\`

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
\`\`\`typescript
// Example test structure
describe('Feature Name', () => {
  it('should process external signal correctly', () => {
    // Test external signal processing
  });
  
  it('should handle signal source validation', () => {
    // Test signal authentication
  });
});
\`\`\`

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

Add any other context about the backend implementation here.`;
  }

  getFrontendTemplate() {
    return `## 🎨 Frontend Development Task

**Component Type:**
- [ ] React Component
- [ ] Page/Route
- [ ] UI/UX Enhancement
- [ ] Data Visualization
- [ ] Form/Input Handling
- [ ] Real-time Updates
- [ ] Mobile Responsiveness

**Scope:**
- [ ] New feature implementation
- [ ] Existing component enhancement
- [ ] Bug fix
- [ ] Performance optimization
- [ ] Accessibility improvement

## 📊 External Signal Display

**Signal Visualization (if applicable):**
- [ ] Trust score display with source attribution
- [ ] Signal timeline/history view
- [ ] External signal source indicators
- [ ] Real-time signal updates
- [ ] Signal processing status

**No Mock Data Policy:**
- [ ] All data fetched from \`/api/v1/*\` endpoints
- [ ] Real external signal data only
- [ ] Proper loading states implemented
- [ ] Error states for API failures
- [ ] No placeholder or "coming soon" content

## 🏗️ Traditional UX Requirements

**Organization-Controlled Experience:**
- [ ] No wallet connection UI required
- [ ] Traditional web forms and interactions
- [ ] Magic Link authentication flow
- [ ] Familiar web navigation patterns
- [ ] Progressive enhancement approach

**ANS Integration Display:**
- [ ] ANS registration status visible
- [ ] Public verification URL display
- [ ] Cross-domain status indicators
- [ ] Level-based qualification display
- [ ] ANS auto-registration feedback

## 📱 Design Requirements

**User Interface:**
- [ ] Mobile responsive design
- [ ] Accessibility compliance (WCAG 2.1)
- [ ] Consistent with existing design system
- [ ] Trust constellation integration
- [ ] Real-time updates without page refresh

**External Signal Attribution:**
- [ ] Clear source attribution for all trust data
- [ ] Signal verification status display
- [ ] Signal freshness indicators
- [ ] Source reliability indicators

## ✅ Acceptance Criteria

**Functionality:**
- [ ] Component renders correctly
- [ ] Real-time external signal updates
- [ ] Proper error handling and display
- [ ] Loading states during API calls
- [ ] Form validation (if applicable)

**Data Integration:**
- [ ] Fetches real data from APIs
- [ ] Displays external signal sources
- [ ] Shows trust score progression
- [ ] Real-time constellation updates
- [ ] ANS integration status

**User Experience:**
- [ ] Intuitive navigation
- [ ] Clear feedback for user actions
- [ ] Traditional web interaction patterns
- [ ] No Web3 complexity exposed
- [ ] Organization admin controls accessible

## 📋 Definition of Done

**Code Quality:**
- [ ] TypeScript types comprehensive
- [ ] React best practices followed
- [ ] ESLint rules passing
- [ ] Component testing completed
- [ ] Code review completed

**Design Compliance:**
- [ ] Design system components used
- [ ] Mobile responsive design
- [ ] Accessibility tested
- [ ] Cross-browser compatibility
- [ ] Performance optimized

**Integration:**
- [ ] API integration working
- [ ] Real-time updates functional
- [ ] Error handling comprehensive
- [ ] Loading states appropriate
- [ ] External signal display correct

**Testing:**
- [ ] Unit tests for components
- [ ] Integration tests with APIs
- [ ] User interaction testing
- [ ] Accessibility testing
- [ ] Performance testing

## 🧪 Testing Strategy

**Component Testing:**
\`\`\`typescript
// Example test structure
describe('ComponentName', () => {
  it('should display external signal data correctly', () => {
    // Test external signal display
  });
  
  it('should handle loading states', () => {
    // Test loading UI
  });
  
  it('should show error states for API failures', () => {
    // Test error handling
  });
});
\`\`\`

**User Interaction Testing:**
- [ ] Form submission flows
- [ ] Real-time update behavior
- [ ] Error recovery flows
- [ ] Navigation patterns

**Visual Testing:**
- [ ] Component in different states
- [ ] Mobile responsive layout
- [ ] Cross-browser rendering
- [ ] Accessibility compliance

## 🔄 Real-time Updates

**External Signal Updates:**
- [ ] WebSocket connection for real-time data
- [ ] Optimistic UI updates
- [ ] Conflict resolution for concurrent updates
- [ ] Graceful degradation for connection issues

**ANS Integration Updates:**
- [ ] Real-time ANS registration status
- [ ] Public verification status updates
- [ ] Cross-domain sync indicators
- [ ] Level promotion notifications

## 📊 Performance Requirements

**Loading Performance:**
- [ ] Initial render under 100ms
- [ ] Lazy loading for heavy components
- [ ] Image optimization
- [ ] Bundle size optimization

**Runtime Performance:**
- [ ] Smooth animations (60fps)
- [ ] Efficient re-renders
- [ ] Memory leak prevention
- [ ] Battery-efficient on mobile

## 🌍 Cross-Domain Considerations

**ANS Registry Integration:**
- [ ] Cross-domain communication working
- [ ] Public verification widget embeddable
- [ ] Secure cross-origin requests
- [ ] Error handling for cross-domain failures

**Domain Configuration:**
- [ ] Environment-specific API endpoints
- [ ] No hardcoded domain strings
- [ ] Proper CORS handling
- [ ] CDN optimization

## 📝 Additional Context

Add any other context about the frontend implementation here.`;
  }

  getGenericTemplate() {
    return `## 📝 Issue Description

**What needs to be done?**
A clear and concise description of the task or issue.

**Component/Area Affected:**
- [ ] Role Agent Management
- [ ] External Signal Processing
- [ ] ANS Registry Integration
- [ ] NFT Minting/Anchoring
- [ ] Trust Constellation
- [ ] Organization Admin Panel
- [ ] Cross-Domain Communication
- [ ] Documentation

## 🎯 Requirements

**Functional Requirements:**
- [ ] 
- [ ] 
- [ ] 

**External Signal Compliance:**
- [ ] Uses real external signal sources
- [ ] No mock or placeholder data
- [ ] Proper signal source attribution
- [ ] Real-time external signal processing

**SCK Platform Principles:**
- [ ] Traditional UX patterns (no wallet required)
- [ ] Organization-controlled backend
- [ ] Cross-domain integration if applicable
- [ ] Level-based role agent naming

## ✅ Acceptance Criteria

- [ ] 
- [ ] 
- [ ] 

## 📋 Definition of Done

**Technical:**
- [ ] Implementation completed
- [ ] Tests written and passing
- [ ] Code review completed
- [ ] Documentation updated

**Quality:**
- [ ] No mock data used
- [ ] External signal integration tested
- [ ] Performance requirements met
- [ ] Security review completed

## 🔗 Related Issues

- Related to #
- Depends on #
- Blocks #`;
  }

  getConfigContent() {
    return `blank_issues_enabled: false
contact_links:
  - name: 💬 Discussion Forum
    url: https://github.com/your-org/sck-platform/discussions
    about: Ask questions and discuss the SCK Platform with the community
  - name: 📚 Documentation
    url: https://secure-knaight.org
    about: Read the official SCK Platform documentation
  - name: 🔐 Security Issues
    url: mailto:security@secure-knaight.io
    about: Report security vulnerabilities privately`;
  }
}

// Main execution
if (require.main === module) {
  const generator = new IssueTemplateGenerator();
  generator.generateAll();
}

module.exports = { IssueTemplateGenerator, TEMPLATES }; 