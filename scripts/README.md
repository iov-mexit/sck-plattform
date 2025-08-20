# SCK Platform Scripts

This directory contains development and project management scripts for the SCK Platform, designed to streamline milestone tracking, issue management, and cross-platform integration.

## 🚀 Quick Start

```bash
# Install dependencies
cd scripts/
npm install

# Create GitHub Issues (dry run first)
npm run import-issues:dry-run

# Export to your project management tool
npm run export-kanban -- --format linear

# Generate issue templates
node issue-templates.js
```

## 📋 Available Scripts

### 1. GitHub Issues Import (`github-issues-import.js`)

Programmatically creates GitHub Issues from the milestone tracking JSON, with proper labels, milestones, and SCK-specific acceptance criteria.

**Features:**
- ✅ Creates 18 milestone-based issues
- 🏷️ Automatic labeling and milestone assignment  
- 🔄 Retry logic and rate limiting
- 🔍 Dry-run mode for testing
- ⚡ Progress tracking and error reporting

**Usage:**
```bash
# Test first (recommended)
node github-issues-import.js --dry-run --verbose

# Create milestones and import issues
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
export GITHUB_REPO="iov-mexit/sck-plattform"
node github-issues-import.js --create-milestones

# Or use direct flags
node github-issues-import.js --repo iov-mexit/sck-plattform --token ghp_xxx
```

**Required Setup:**
1. GitHub Personal Access Token with `issues:write` scope
2. Repository in format `owner/repo`
3. Set environment variables or use CLI flags

### 2. Kanban Export (`kanban-export.js`)

Converts milestone data into formats compatible with popular project management tools.

**Supported Formats:**
- 📊 **Linear** - Issues with projects and teams
- 📈 **ClickUp** - Tasks with custom fields and folders
- 📝 **Notion** - Database pages with properties
- 🎯 **Jira** - Issues with versions and story points
- 🔷 **Azure DevOps** - Work items with iterations
- 📋 **Trello** - Cards with checklists and labels

**Usage:**
```bash
# Export for Linear
node kanban-export.js --format linear

# Export for ClickUp with custom output
node kanban-export.js --format clickup --output ./my-exports

# Export all formats
for format in linear clickup notion jira azure trello; do
  node kanban-export.js --format $format
done
```

**Output Example:**
```json
{
  "teams": [{"name": "SCK Platform", "key": "SCK"}],
  "projects": [{"name": "Milestone 1: ANS Foundation"}],
  "issues": [{"title": "Define & Implement Zod Schema..."}],
  "metadata": {"exportedAt": "2024-01-15T14:30:00Z"}
}
```

### 3. Issue Templates (`issue-templates.js`)

Generates GitHub issue templates with SCK-specific acceptance criteria and definition-of-done checklists.

**Templates Created:**
- 🎯 **Feature Request** - SCK platform enhancements
- 🐛 **Bug Report** - Issue tracking with external signal context
- 🔐 **Security Issue** - Vulnerability reports and security enhancements
- 🔌 **External Signal Integration** - New signal source integrations
- 🌐 **ANS Integration** - Cross-domain and ANS Registry features
- 🛠️ **Backend Development** - API and database tasks
- 🎨 **Frontend Development** - UI/UX and component tasks

**Usage:**
```bash
# Generate all templates in .github/ISSUE_TEMPLATE/
node issue-templates.js

# Templates will be created:
# - feature_request.md
# - bug_report.md  
# - security_issue.md
# - signal_integration.md
# - ans_integration.md
# - backend_development.md
# - frontend_development.md
# - config.yml
```

**Template Features:**
- ✅ SCK-specific acceptance criteria
- 🚫 No mock data policy enforcement
- 🔗 External signal integration requirements
- 🌐 Cross-domain considerations
- 📋 Comprehensive definition-of-done checklists

## 🎯 SCK Platform Integration

All scripts are designed specifically for SCK Platform development principles:

### External Signal Funneling
- 📊 All milestones focus on real external signal processing
- 🔍 No mock data policy enforcement in templates
- 📈 Signal source attribution requirements
- ⚡ Real-time external signal processing emphasis

### ANS Integration
- 🌐 Cross-domain communication testing
- 🔗 Auto-registration workflow validation
- 📋 Public verification API requirements
- 🎯 Level-based naming convention support

### Organization-Controlled Backend
- 🔑 Traditional UX patterns (no wallet requirements)
- 🏢 Organization admin controls emphasis
- 🛡️ Backend-controlled blockchain operations
- 📱 Magic Link authentication flows

## 📊 Milestone Overview

The scripts manage **5 major milestones** with **18 total issues**:

| Milestone | Issues | Focus Area | Estimated Time |
|-----------|---------|------------|----------------|
| **Milestone 1** | 6 issues | ANS Foundation & Security | 11 days |
| **Milestone 2** | 3 issues | Public Verification Infrastructure | 6 days |
| **Milestone 3** | 3 issues | Signal Processing & Trust Policy | 4 days |
| **Milestone 4** | 3 issues | Advanced NFT Integration | 4 days |
| **Milestone 5** | 3 issues | Platform Stability & Documentation | 5 days |

### Key Features by Milestone

**Milestone 1: ANS Foundation**
- Zod schema for ANS registration payload
- Signed & idempotent ANS registration
- Retry queue for failed registrations
- Visibility flags for role agents
- ANS publish status UI component
- Audit correlation IDs

**Milestone 2: Public Verification**
- Embeddable verification widget
- Public verification API with rate limiting
- Developer documentation and guides

**Milestone 3: Signal Processing**
- Simplified external signal schema
- Trust policy editor UI
- Automatic level assignment logic

**Milestone 4: NFT Integration**
- NFT minting eligibility enforcement
- Role agent idle state management
- Versioned anchor/re-mint workflow

**Milestone 5: Platform Stability**
- Legacy code archival
- Health check endpoints
- Updated documentation and onboarding

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ 
- GitHub Personal Access Token
- SCK Platform repository access

### Installation
```bash
# Clone repository
git clone https://github.com/iov-mexit/sck-plattform.git
cd sck-plattform/scripts/

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your GitHub token and repo
```

### Environment Variables
```bash
# Required for GitHub Issues import
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_REPO=iov-mexit/sck-plattform

# Optional configuration
SCRIPTS_OUTPUT_DIR=./exports
SCRIPTS_VERBOSE=true
```

## 📈 Usage Examples

### Complete Workflow
```bash
# 1. Generate issue templates
node issue-templates.js

# 2. Test GitHub import
npm run import-issues:dry-run

# 3. Create actual issues
npm run import-issues

# 4. Export to project management tool
npm run export-kanban -- --format linear

# 5. Import into Linear/ClickUp/etc using generated JSON
```

### Development Workflow
```bash
# Test changes to milestone data
node github-issues-import.js --dry-run --verbose

# Update a specific export format
node kanban-export.js --format notion --verbose

# Regenerate templates after changes
node issue-templates.js
```

### CI/CD Integration
```bash
# Add to your CI pipeline
name: Update Project Tracking
on:
  push:
    paths: ['scripts/github-issues-import.js']
jobs:
  update-tracking:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update Issues
        run: |
          cd scripts/
          npm install
          node github-issues-import.js
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          GITHUB_REPO: ${{ github.repository }}
```

## 🛠️ Customization

### Adding New Milestones
```javascript
// In github-issues-import.js, add to milestones array:
{
  "title": "Milestone 6: Your New Milestone",
  "body": "Description with acceptance criteria...",
  "labels": ["milestone:6", "your-labels"],
  "milestone": "Milestone 6",
  "estimate": "3d"
}
```

### Adding New Export Formats
```javascript
// In kanban-export.js, add to FORMATS object:
FORMATS.yourformat = 'Your Format Name';

// Add conversion method:
toYourFormat() {
  return {
    // Your format structure
  };
}
```

### Customizing Issue Templates
```javascript
// In issue-templates.js, modify getTemplateContent():
getYourTemplate() {
  return `## Your Template
**Custom fields for your workflow**
- [ ] Your checklist items
`;
}
```

## 🔍 Troubleshooting

### Common Issues

**GitHub API Rate Limiting:**
```bash
# Error: API rate limit exceeded
# Solution: Wait or use authenticated requests
export GITHUB_TOKEN="your-token-here"
```

**CORS Issues in Development:**
```bash
# Error: Cross-origin requests blocked
# Solution: Check domain configuration
# Verify NEXT_PUBLIC_ANS_REGISTRY_URL in .env.local
```

**Permission Errors:**
```bash
# Error: Permission denied creating issues
# Solution: Check token scopes
# Ensure token has 'issues:write' permission
```

### Debug Mode
```bash
# Enable verbose logging
node github-issues-import.js --dry-run --verbose

# Check export format output
node kanban-export.js --format linear --verbose
```

### Health Checks
```bash
# Test GitHub connection
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$GITHUB_REPO

# Test issue creation permissions
node github-issues-import.js --dry-run
```

## 📚 Related Documentation

- [DOMAIN_STRATEGY.md](../DOMAIN_STRATEGY.md) - Cross-domain architecture
- [README.md](../README.md) - SCK Platform overview  
- [SCK_TASK_LIST.md](../SCK_TASK_LIST.md) - Development task tracking
- [ROLE_AGENT_SYSTEM.md](../ROLE_AGENT_SYSTEM.md) - Role agent architecture

## 🤝 Contributing

1. **Test First**: Always run dry-run mode before creating real issues
2. **Follow SCK Principles**: Ensure all changes align with external signal funneling
3. **Update Documentation**: Keep this README current with script changes
4. **Validate Exports**: Test generated JSON with target project management tools

## 📞 Support

- **Issues**: Create issue using generated templates
- **Security**: Report to security@secure-knaight.io  
- **Documentation**: Check secure-knaight.org
- **Community**: GitHub Discussions

---

**🎯 These scripts embody SCK's composable trust economy architecture - external signal funneling, organization-controlled backend, and traditional UX patterns.** 