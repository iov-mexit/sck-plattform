#!/usr/bin/env node

/**
 * GitHub Issues Import Script for SCK Platform Milestones
 * 
 * Usage:
 *   node scripts/github-issues-import.js --repo owner/repo --token YOUR_TOKEN
 *   node scripts/github-issues-import.js --dry-run  # Test without creating issues
 * 
 * Environment Variables:
 *   GITHUB_TOKEN - GitHub personal access token
 *   GITHUB_REPO - Repository in format "owner/repo"
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// Milestone tracking data
const milestones = [
  {
    "title": "Milestone 1: Define & Implement Zod Schema for ANS Registration Payload",
    "body": "Define a strict Zod schema for the ANS auto-registration payload, including required fields, qualification metadata, trust score, and signing metadata. Add unit tests to validate acceptance/rejection and document the schema.\n\n**Acceptance Criteria:**\n- [ ] Zod schema covers all ANS registration fields\n- [ ] Unit tests for valid/invalid payloads\n- [ ] Documentation with examples\n- [ ] Integration with existing role agent creation flow\n\n**Definition of Done:**\n- [ ] Code reviewed and approved\n- [ ] Tests passing (unit + integration)\n- [ ] Documentation updated\n- [ ] No security vulnerabilities introduced",
    "labels": ["milestone:1", "backend", "schema", "high-priority"],
    "milestone": "Milestone 1",
    "estimate": "2d"
  },
  {
    "title": "Milestone 1: Implement Signed & Idempotent ANS Registration",
    "body": "Add HMAC or DID-based signing for payloads sent from SCK Platform to knaight.site. Ensure ANS registration is idempotent (upsert behavior) and verify signatures on the registry side. Prevent replay attacks.\n\n**Acceptance Criteria:**\n- [ ] HMAC signing implementation for ANS payloads\n- [ ] Signature verification on knaight.site\n- [ ] Idempotent registration (safe to retry)\n- [ ] Replay attack prevention\n- [ ] Error handling for signature failures\n\n**Definition of Done:**\n- [ ] Security review completed\n- [ ] End-to-end tests for signing flow\n- [ ] Documentation for cross-domain security\n- [ ] Performance impact assessed",
    "labels": ["milestone:1", "security", "integration", "high-priority"],
    "milestone": "Milestone 1",
    "estimate": "3d"
  },
  {
    "title": "Milestone 1: Build Retry Queue for Failed ANS Registrations",
    "body": "Create a persistent retry mechanism with exponential backoff for failed ANS registrations. Surface failures with reason and timestamps. Store status and allow manual re-trigger from UI.\n\n**Acceptance Criteria:**\n- [ ] Persistent queue for failed registrations\n- [ ] Exponential backoff retry logic\n- [ ] Failure reason tracking and storage\n- [ ] Manual retry trigger from admin UI\n- [ ] Queue status monitoring\n\n**Definition of Done:**\n- [ ] Queue resilience tested under load\n- [ ] Admin UI shows queue status\n- [ ] Alerting for persistent failures\n- [ ] Database migration for queue storage",
    "labels": ["milestone:1", "backend", "resilience"],
    "milestone": "Milestone 1",
    "estimate": "2d"
  },
  {
    "title": "Milestone 1: Add Visibility Flag to Role Agents and Respect in ANS Publishing",
    "body": "Introduce `public`/`internal`/`hidden` visibility controls on Role Agents. Update auto-ANS registration logic to skip or hide agents based on this flag. Expose visibility toggles in admin UI.\n\n**Acceptance Criteria:**\n- [ ] Database schema updated with visibility field\n- [ ] ANS registration respects visibility settings\n- [ ] Admin UI toggle for visibility control\n- [ ] Migration script for existing agents\n- [ ] API filtering based on visibility\n\n**Definition of Done:**\n- [ ] Database migration tested\n- [ ] UI components updated\n- [ ] API documentation updated\n- [ ] Backward compatibility maintained",
    "labels": ["milestone:1", "feature", "backend", "frontend"],
    "milestone": "Milestone 1",
    "estimate": "1d"
  },
  {
    "title": "Milestone 1: UI Component - ANS Publish Status with Retry",
    "body": "Build a React component showing current ANS registration status for a Role Agent (published, pending, failed). Provide manual retry and error detail display. Include correlation ID for tracing.\n\n**Acceptance Criteria:**\n- [ ] Status component with published/pending/failed states\n- [ ] Manual retry button with loading state\n- [ ] Error details display with correlation ID\n- [ ] Real-time status updates\n- [ ] Accessible design (WCAG compliance)\n\n**Definition of Done:**\n- [ ] Component tested with Storybook\n- [ ] Integration tests for retry flow\n- [ ] UX review completed\n- [ ] Mobile responsive design",
    "labels": ["milestone:1", "frontend", "ux"],
    "milestone": "Milestone 1",
    "estimate": "2d"
  },
  {
    "title": "Milestone 1: Add Audit Correlation IDs Across Role Agent → ANS Flow",
    "body": "Ensure role agent creation, signal ingestion, ANS registration, and verification all carry and log a shared correlation ID for debugging and traceability. Expose relevant logs in internal admin dashboard.\n\n**Acceptance Criteria:**\n- [ ] Correlation ID generated at role agent creation\n- [ ] ID propagated through entire ANS flow\n- [ ] Structured logging with correlation ID\n- [ ] Admin dashboard log search by correlation ID\n- [ ] API responses include correlation ID\n\n**Definition of Done:**\n- [ ] End-to-end tracing verified\n- [ ] Log aggregation configured\n- [ ] Admin dashboard functional\n- [ ] Documentation for debugging workflow",
    "labels": ["milestone:1", "observability", "backend"],
    "milestone": "Milestone 1",
    "estimate": "1d"
  },
  {
    "title": "Milestone 2: Build Embeddable Verification Widget",
    "body": "Design and implement a lightweight embeddable 'Trust Badge' widget that external sites can drop in to verify a Role Agent by ANS ID. Fetch trust status, show provenance, and degrade gracefully on failure.\n\n**Acceptance Criteria:**\n- [ ] Lightweight JavaScript widget (< 50KB)\n- [ ] Trust badge with ANS ID verification\n- [ ] Provenance display (external signal sources)\n- [ ] Graceful degradation on API failures\n- [ ] Customizable styling options\n\n**Definition of Done:**\n- [ ] Widget tested on multiple sites\n- [ ] Performance benchmarking completed\n- [ ] Integration documentation published\n- [ ] CDN deployment configured",
    "labels": ["milestone:2", "frontend", "integration"],
    "milestone": "Milestone 2",
    "estimate": "3d"
  },
  {
    "title": "Milestone 2: Public Verification API with Rate Limiting & Caching",
    "body": "Expose a public API for third parties to verify Role Agent trust status. Implement rate limiting to protect the endpoint and caching for performance. Support free vs gated access (stub micropayment later).\n\n**Acceptance Criteria:**\n- [ ] Public verification API endpoint\n- [ ] Rate limiting by IP and API key\n- [ ] Response caching for performance\n- [ ] Free tier vs premium access tiers\n- [ ] API key management system\n\n**Definition of Done:**\n- [ ] Load testing completed\n- [ ] API documentation published\n- [ ] Monitoring and alerting configured\n- [ ] Billing integration stubbed",
    "labels": ["milestone:2", "backend", "api", "performance"],
    "milestone": "Milestone 2",
    "estimate": "2d"
  },
  {
    "title": "Milestone 2: Documentation for Embed Widget & Verification Flow",
    "body": "Write clear docs for how to consume the embeddable verification widget and the public verification API. Include example integrations, expected payloads, and failure handling.\n\n**Acceptance Criteria:**\n- [ ] Widget integration guide with examples\n- [ ] API documentation with OpenAPI spec\n- [ ] Error handling best practices\n- [ ] Example implementations (React, vanilla JS)\n- [ ] Troubleshooting guide\n\n**Definition of Done:**\n- [ ] Documentation review by external developer\n- [ ] Examples tested and validated\n- [ ] Published to secure-knaight.org\n- [ ] Developer onboarding flow tested",
    "labels": ["milestone:2", "documentation"],
    "milestone": "Milestone 2",
    "estimate": "1d"
  },
  {
    "title": "Milestone 3: Finalize Minimal External Signal Funnel Schema & Retire Overengineered Version",
    "body": "Lock down the simplified signal schema (external trust score + certification metadata), migrate consumers to it, and archive the previous overengineered signal collection service. Ensure backward compatibility if needed.\n\n**Acceptance Criteria:**\n- [ ] Simplified signal schema finalized\n- [ ] Migration script for existing signals\n- [ ] Overengineered service archived\n- [ ] Backward compatibility layer if needed\n- [ ] Performance improvement metrics\n\n**Definition of Done:**\n- [ ] All consumers migrated successfully\n- [ ] Legacy code moved to /archive\n- [ ] Performance benchmarks met\n- [ ] Schema documentation updated",
    "labels": ["milestone:3", "backend", "cleanup"],
    "milestone": "Milestone 3",
    "estimate": "1d"
  },
  {
    "title": "Milestone 3: Implement Trust Policy Editor UI",
    "body": "Enable admins to define trust thresholds for level assignment (L1–L5) and NFT eligibility. Provide live previews showing how incoming signals would influence level promotions.\n\n**Acceptance Criteria:**\n- [ ] Admin UI for trust threshold configuration\n- [ ] Live preview of level assignments\n- [ ] Validation of threshold logic\n- [ ] Impact analysis for threshold changes\n- [ ] Role-based access control\n\n**Definition of Done:**\n- [ ] UI tested with real data\n- [ ] Admin workflow documented\n- [ ] Access control implemented\n- [ ] Change audit trail functional",
    "labels": ["milestone:3", "frontend", "ux"],
    "milestone": "Milestone 3",
    "estimate": "2d"
  },
  {
    "title": "Milestone 3: Automatic Level Assignment & Promotion Logic",
    "body": "Implement and test `assignLevel` and `canPromoteLevel` logic based solely on external trust scores. Ensure promotions are suggested and surfaced in the UI with explanation.\n\n**Acceptance Criteria:**\n- [ ] Level assignment logic implemented\n- [ ] Promotion suggestions in UI\n- [ ] Explanation of promotion rationale\n- [ ] Batch processing for level updates\n- [ ] Notification system for promotions\n\n**Definition of Done:**\n- [ ] Logic tested with edge cases\n- [ ] UI shows promotion explanations\n- [ ] Batch processing optimized\n- [ ] Audit trail for level changes",
    "labels": ["milestone:3", "business-logic", "backend"],
    "milestone": "Milestone 3",
    "estimate": "1d"
  },
  {
    "title": "Milestone 4: Enforce NFT Minting Eligibility Rules",
    "body": "Ensure backend minting endpoint only allows credential minting for Role Agents meeting NFT eligibility (e.g., L4+ with threshold). Add rejection reasons and audit logging.\n\n**Acceptance Criteria:**\n- [ ] Eligibility validation in minting endpoint\n- [ ] Clear rejection reasons returned\n- [ ] Audit logging for minting attempts\n- [ ] UI shows eligibility status\n- [ ] Gas cost optimization\n\n**Definition of Done:**\n- [ ] Security review of minting logic\n- [ ] Edge cases tested\n- [ ] Audit system functional\n- [ ] Performance benchmarks met",
    "labels": ["milestone:4", "blockchain", "backend", "security"],
    "milestone": "Milestone 4",
    "estimate": "1d"
  },
  {
    "title": "Milestone 4: Role Agent Decoupling / Idle State Management",
    "body": "Support setting Role Agents to idle, decoupling from DID without deletion, and reflecting this in UI and ANS (optionally retracting public listing).\n\n**Acceptance Criteria:**\n- [ ] Idle state in database schema\n- [ ] UI for setting agents idle\n- [ ] ANS retraction on idle state\n- [ ] Re-activation workflow\n- [ ] Audit trail for state changes\n\n**Definition of Done:**\n- [ ] State machine tested\n- [ ] UI workflow validated\n- [ ] ANS integration working\n- [ ] Data integrity maintained",
    "labels": ["milestone:4", "feature", "backend"],
    "milestone": "Milestone 4",
    "estimate": "1d"
  },
  {
    "title": "Milestone 4: Versioned Anchor / Re-mint Workflow",
    "body": "Allow re-anchoring (versioned NFT) when trust state changes significantly. Track prior anchors, show diffs, and enable admin-triggered refresh with audit trail.\n\n**Acceptance Criteria:**\n- [ ] Versioned NFT contract support\n- [ ] Re-mint trigger logic\n- [ ] Version history tracking\n- [ ] Diff visualization in UI\n- [ ] Admin approval workflow\n\n**Definition of Done:**\n- [ ] Contract security audited\n- [ ] Version migration tested\n- [ ] UI shows clear version history\n- [ ] Gas cost analysis completed",
    "labels": ["milestone:4", "blockchain", "frontend"],
    "milestone": "Milestone 4",
    "estimate": "2d"
  },
  {
    "title": "Milestone 5: Archive Legacy Code & Enforce No-Hardcoded-Domain Rule",
    "body": "Move deprecated code (old NFT contract, overengineered signal service, duplicate routes) into `/archive`, add README tags. Add lint/pre-commit rule rejecting hardcoded domain strings in source.\n\n**Acceptance Criteria:**\n- [ ] Legacy code moved to /archive\n- [ ] Archive README documentation\n- [ ] Linting rules for hardcoded domains\n- [ ] Pre-commit hooks configured\n- [ ] CI/CD pipeline updated\n\n**Definition of Done:**\n- [ ] All legacy code archived\n- [ ] Linting rules active\n- [ ] CI pipeline validates rules\n- [ ] Documentation updated",
    "labels": ["milestone:5", "cleanup", "devops"],
    "milestone": "Milestone 5",
    "estimate": "2d"
  },
  {
    "title": "Milestone 5: Health Check Endpoint & Admin Health UI",
    "body": "Expose an aggregated health endpoint summarizing: ANS sync status, signal freshness, NFT anchor validity, domain configuration drift. Build a small admin UI panel displaying these with alerts.\n\n**Acceptance Criteria:**\n- [ ] Health check endpoint with metrics\n- [ ] ANS sync status monitoring\n- [ ] Signal freshness validation\n- [ ] NFT anchor validity checks\n- [ ] Admin UI health dashboard\n\n**Definition of Done:**\n- [ ] Health checks comprehensive\n- [ ] UI shows actionable alerts\n- [ ] Monitoring integration complete\n- [ ] Performance impact minimal",
    "labels": ["milestone:5", "observability", "frontend"],
    "milestone": "Milestone 5",
    "estimate": "2d"
  },
  {
    "title": "Milestone 5: README & Onboarding Update to Reflect Current Reality",
    "body": "Update README, onboarding checklist, and developer docs to match implemented flows (ANS signing, visibility flags, widget usage, role agent naming). Validate that a fresh clone can complete Day 1 setup.\n\n**Acceptance Criteria:**\n- [ ] README reflects current architecture\n- [ ] Onboarding checklist updated\n- [ ] Developer setup guide accurate\n- [ ] Fresh clone validation test\n- [ ] Troubleshooting section updated\n\n**Definition of Done:**\n- [ ] External developer can onboard\n- [ ] Documentation review completed\n- [ ] Setup automation tested\n- [ ] Community feedback incorporated",
    "labels": ["milestone:5", "documentation", "onboarding"],
    "milestone": "Milestone 5",
    "estimate": "1d"
  }
];

const config = {
  // GitHub configuration
  repo: process.env.GITHUB_REPO || 'iov-mexit/sck-plattform',
  token: process.env.GITHUB_TOKEN,

  // Script options
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
  createMilestones: process.argv.includes('--create-milestones'),

  // Rate limiting
  requestDelay: 1000, // 1 second between requests
  maxRetries: 3,

  // Milestone mapping
  milestoneNames: [
    'Milestone 1',
    'Milestone 2',
    'Milestone 3',
    'Milestone 4',
    'Milestone 5'
  ]
};

class GitHubIssuesImporter {
  constructor(options = {}) {
    this.config = { ...config, ...options };
    this.octokit = new Octokit({
      auth: this.config.token,
    });

    this.stats = {
      created: 0,
      errors: 0,
      skipped: 0,
      milestones: new Map()
    };
  }

  async run() {
    this.log('🚀 Starting GitHub Issues import for SCK Platform milestones...');

    if (this.config.dryRun) {
      this.log('🔍 DRY RUN MODE - No issues will be created');
    }

    try {
      // Parse repository
      const [owner, repo] = this.config.repo.split('/');
      if (!owner || !repo) {
        throw new Error('Invalid repository format. Use: owner/repo');
      }

      this.owner = owner;
      this.repo = repo;

      // Create milestones if requested
      if (this.config.createMilestones) {
        await this.createMilestones();
      }

      // Import issues
      await this.importIssues();

      // Report results
      this.reportResults();

    } catch (error) {
      this.log(`❌ Import failed: ${error.message}`);
      process.exit(1);
    }
  }

  async createMilestones() {
    this.log('📝 Creating milestones...');

    for (const milestoneName of this.config.milestoneNames) {
      try {
        if (!this.config.dryRun) {
          const milestone = await this.octokit.issues.createMilestone({
            owner: this.owner,
            repo: this.repo,
            title: milestoneName,
            description: `SCK Platform development milestone: ${milestoneName}`,
            state: 'open'
          });

          this.stats.milestones.set(milestoneName, milestone.data.number);
          this.log(`✅ Created milestone: ${milestoneName} (#${milestone.data.number})`);
        } else {
          this.log(`🔍 Would create milestone: ${milestoneName}`);
        }

        await this.delay();
      } catch (error) {
        if (error.status === 422) {
          this.log(`⚠️  Milestone already exists: ${milestoneName}`);
        } else {
          this.log(`❌ Failed to create milestone ${milestoneName}: ${error.message}`);
        }
      }
    }
  }

  async importIssues() {
    this.log(`📋 Importing ${milestones.length} issues...`);

    for (const issue of milestones) {
      try {
        await this.createIssue(issue);
        await this.delay();
      } catch (error) {
        this.log(`❌ Failed to create issue "${issue.title}": ${error.message}`);
        this.stats.errors++;
      }
    }
  }

  async createIssue(issueData) {
    const { title, body, labels = [], milestone, estimate } = issueData;

    // Add estimate to body if provided
    const enhancedBody = estimate
      ? `${body}\n\n**Estimated Time:** ${estimate}`
      : body;

    const issuePayload = {
      owner: this.owner,
      repo: this.repo,
      title,
      body: enhancedBody,
      labels
    };

    // Add milestone if it exists
    if (milestone && this.stats.milestones.has(milestone)) {
      issuePayload.milestone = this.stats.milestones.get(milestone);
    }

    if (this.config.dryRun) {
      this.log(`🔍 Would create: ${title}`);
      this.log(`   Labels: ${labels.join(', ')}`);
      this.log(`   Milestone: ${milestone || 'None'}`);
      this.stats.created++;
      return;
    }

    const response = await this.octokit.issues.create(issuePayload);

    this.log(`✅ Created issue #${response.data.number}: ${title}`);
    this.stats.created++;

    return response.data;
  }

  reportResults() {
    this.log('\n📊 Import Results:');
    this.log(`✅ Issues created: ${this.stats.created}`);
    this.log(`❌ Errors: ${this.stats.errors}`);
    this.log(`⏭️  Skipped: ${this.stats.skipped}`);

    if (this.stats.milestones.size > 0) {
      this.log(`📝 Milestones created: ${this.stats.milestones.size}`);
    }

    if (this.config.dryRun) {
      this.log('\n🔍 This was a dry run. Use without --dry-run to actually create issues.');
    }
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, this.config.requestDelay));
  }

  log(message) {
    if (this.config.verbose || !message.startsWith('   ')) {
      console.log(message);
    }
  }
}

// CLI argument parsing
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--repo':
        options.repo = args[++i];
        break;
      case '--token':
        options.token = args[++i];
        break;
      case '--help':
        showHelp();
        process.exit(0);
        break;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
GitHub Issues Import Script for SCK Platform

Usage:
  node scripts/github-issues-import.js [options]

Options:
  --repo OWNER/REPO      GitHub repository (default: from GITHUB_REPO env)
  --token TOKEN          GitHub personal access token (default: from GITHUB_TOKEN env)
  --dry-run              Test mode - don't create actual issues
  --verbose              Show detailed output
  --create-milestones    Create milestones before importing issues
  --help                 Show this help

Environment Variables:
  GITHUB_REPO           Repository in format "owner/repo"
  GITHUB_TOKEN          GitHub personal access token with issues:write scope

Examples:
  # Dry run to test
  node scripts/github-issues-import.js --dry-run --verbose

  # Create milestones and import issues
  node scripts/github-issues-import.js --create-milestones --repo myorg/sck-plattform

  # Using environment variables
  export GITHUB_REPO="myorg/sck-plattform"
  export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
  node scripts/github-issues-import.js
`);
}

// Validation
function validateConfig() {
  if (!config.token) {
    console.error('❌ GitHub token required. Set GITHUB_TOKEN environment variable or use --token flag.');
    process.exit(1);
  }

  if (!config.repo || !config.repo.includes('/')) {
    console.error('❌ Repository required in format "owner/repo". Set GITHUB_REPO environment variable or use --repo flag.');
    process.exit(1);
  }
}

// Main execution
async function main() {
  const cliOptions = parseArgs();
  Object.assign(config, cliOptions);

  if (!config.dryRun) {
    validateConfig();
  }

  const importer = new GitHubIssuesImporter(config);
  await importer.run();
}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { GitHubIssuesImporter, milestones }; 