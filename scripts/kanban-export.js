#!/usr/bin/env node

/**
 * Kanban Export Script for SCK Platform Milestones
 * 
 * Converts GitHub Issues JSON into formats suitable for:
 * - Linear
 * - ClickUp  
 * - Notion
 * - Jira
 * - Azure DevOps
 * 
 * Usage:
 *   node scripts/kanban-export.js --format linear
 *   node scripts/kanban-export.js --format clickup --output ./exports/
 */

const fs = require('fs');
const path = require('path');
const { milestones } = require('./github-issues-import.js');

const FORMATS = {
  linear: 'Linear',
  clickup: 'ClickUp',
  notion: 'Notion',
  jira: 'Jira',
  azure: 'Azure DevOps',
  trello: 'Trello'
};

class KanbanExporter {
  constructor(options = {}) {
    this.format = options.format || 'linear';
    this.outputDir = options.outputDir || './exports';
    this.verbose = options.verbose || false;

    if (!FORMATS[this.format]) {
      throw new Error(`Unsupported format: ${this.format}. Supported: ${Object.keys(FORMATS).join(', ')}`);
    }
  }

  async export() {
    this.log(`📤 Exporting SCK milestones to ${FORMATS[this.format]} format...`);

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    const exportData = this.convertToFormat();
    const filename = this.writeToFile(exportData);

    this.log(`✅ Export complete: ${filename}`);
    this.logStats(exportData);

    return filename;
  }

  convertToFormat() {
    switch (this.format) {
      case 'linear':
        return this.toLinear();
      case 'clickup':
        return this.toClickUp();
      case 'notion':
        return this.toNotion();
      case 'jira':
        return this.toJira();
      case 'azure':
        return this.toAzureDevOps();
      case 'trello':
        return this.toTrello();
      default:
        throw new Error(`Format ${this.format} not implemented`);
    }
  }

  toLinear() {
    const teams = [{
      name: "SCK Platform",
      key: "SCK",
      description: "SCK Platform Development Team"
    }];

    const projects = [
      { name: "Milestone 1: ANS Foundation", key: "M1", description: "Core ANS integration and security" },
      { name: "Milestone 2: Public Verification", key: "M2", description: "External verification APIs and widgets" },
      { name: "Milestone 3: Signal Processing", key: "M3", description: "Trust policy and external signal funnel" },
      { name: "Milestone 4: NFT Integration", key: "M4", description: "Advanced NFT minting and versioning" },
      { name: "Milestone 5: Platform Stability", key: "M5", description: "Documentation and health monitoring" }
    ];

    const issues = milestones.map((milestone, index) => ({
      title: milestone.title,
      description: milestone.body,
      priority: milestone.labels.includes('high-priority') ? 1 : 2,
      estimate: this.parseEstimate(milestone.estimate),
      labels: milestone.labels,
      projectId: this.getMilestoneNumber(milestone.milestone),
      teamId: "SCK",
      state: "backlog",
      identifier: `SCK-${index + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return {
      teams,
      projects,
      issues,
      metadata: {
        exportedAt: new Date().toISOString(),
        format: 'linear',
        totalIssues: issues.length,
        source: 'SCK Platform Milestones'
      }
    };
  }

  toClickUp() {
    const spaces = [{
      name: "SCK Platform Development",
      color: "#7B68EE",
      features: {
        dueDate: true,
        timeTracking: true,
        tags: true,
        timeEstimates: true
      }
    }];

    const folders = [
      { name: "Milestone 1: ANS Foundation", color: "#FF6B6B" },
      { name: "Milestone 2: Public Verification", color: "#4ECDC4" },
      { name: "Milestone 3: Signal Processing", color: "#45B7D1" },
      { name: "Milestone 4: NFT Integration", color: "#FFA07A" },
      { name: "Milestone 5: Platform Stability", color: "#98D8C8" }
    ];

    const lists = [{
      name: "Backlog",
      color: "#d3d3d3"
    }, {
      name: "In Progress",
      color: "#ffeb3b"
    }, {
      name: "Review",
      color: "#ff9800"
    }, {
      name: "Done",
      color: "#4caf50"
    }];

    const tasks = milestones.map((milestone, index) => ({
      name: milestone.title,
      description: milestone.body,
      status: "backlog",
      priority: milestone.labels.includes('high-priority') ? 1 : 3,
      timeEstimate: this.parseEstimateHours(milestone.estimate),
      tags: milestone.labels,
      folderId: this.getMilestoneNumber(milestone.milestone),
      assignees: [],
      customFields: {
        milestone: milestone.milestone,
        estimate: milestone.estimate,
        complexity: this.getComplexity(milestone.labels)
      }
    }));

    return {
      spaces,
      folders,
      lists,
      tasks,
      metadata: {
        exportedAt: new Date().toISOString(),
        format: 'clickup',
        totalTasks: tasks.length
      }
    };
  }

  toNotion() {
    const database = {
      title: "SCK Platform Milestones",
      properties: {
        Name: { type: "title" },
        Status: {
          type: "select",
          options: [
            { name: "Not Started", color: "default" },
            { name: "In Progress", color: "yellow" },
            { name: "Review", color: "orange" },
            { name: "Done", color: "green" }
          ]
        },
        Priority: {
          type: "select",
          options: [
            { name: "High", color: "red" },
            { name: "Medium", color: "yellow" },
            { name: "Low", color: "gray" }
          ]
        },
        Labels: { type: "multi_select" },
        Milestone: { type: "select" },
        Estimate: { type: "rich_text" },
        Description: { type: "rich_text" }
      }
    };

    const pages = milestones.map(milestone => ({
      properties: {
        Name: {
          title: [{ text: { content: milestone.title } }]
        },
        Status: {
          select: { name: "Not Started" }
        },
        Priority: {
          select: {
            name: milestone.labels.includes('high-priority') ? "High" : "Medium"
          }
        },
        Labels: {
          multi_select: milestone.labels.map(label => ({ name: label }))
        },
        Milestone: {
          select: { name: milestone.milestone }
        },
        Estimate: {
          rich_text: [{ text: { content: milestone.estimate || "TBD" } }]
        },
        Description: {
          rich_text: [{ text: { content: milestone.body } }]
        }
      }
    }));

    return {
      database,
      pages,
      metadata: {
        exportedAt: new Date().toISOString(),
        format: 'notion',
        totalPages: pages.length
      }
    };
  }

  toJira() {
    const project = {
      key: "SCK",
      name: "SCK Platform",
      projectTypeKey: "software",
      lead: "admin"
    };

    const versions = [
      { name: "Milestone 1", description: "ANS Foundation & Security" },
      { name: "Milestone 2", description: "Public Verification Infrastructure" },
      { name: "Milestone 3", description: "Signal Processing & Trust Policy" },
      { name: "Milestone 4", description: "Advanced NFT Integration" },
      { name: "Milestone 5", description: "Platform Stability & Documentation" }
    ];

    const issues = milestones.map((milestone, index) => ({
      fields: {
        project: { key: "SCK" },
        summary: milestone.title,
        description: milestone.body,
        issuetype: { name: "Task" },
        priority: {
          name: milestone.labels.includes('high-priority') ? "High" : "Medium"
        },
        labels: milestone.labels,
        fixVersions: [{ name: milestone.milestone }],
        timeoriginalestimate: this.parseEstimateSeconds(milestone.estimate),
        customfield_10001: milestone.estimate // Story Points
      }
    }));

    return {
      project,
      versions,
      issues,
      metadata: {
        exportedAt: new Date().toISOString(),
        format: 'jira',
        totalIssues: issues.length
      }
    };
  }

  toAzureDevOps() {
    const project = {
      name: "SCK Platform",
      description: "Secure Code KnAIght Platform Development",
      visibility: "private",
      capabilities: {
        versioncontrol: { sourceControlType: "Git" },
        processTemplate: { templateTypeId: "adcc42ab-9882-485e-a3ed-7678f01f66bc" }
      }
    };

    const iterations = [
      { name: "Milestone 1 Sprint", path: "\\SCK Platform\\Milestone 1" },
      { name: "Milestone 2 Sprint", path: "\\SCK Platform\\Milestone 2" },
      { name: "Milestone 3 Sprint", path: "\\SCK Platform\\Milestone 3" },
      { name: "Milestone 4 Sprint", path: "\\SCK Platform\\Milestone 4" },
      { name: "Milestone 5 Sprint", path: "\\SCK Platform\\Milestone 5" }
    ];

    const workItems = milestones.map((milestone, index) => ({
      op: "add",
      path: "/fields/System.WorkItemType",
      value: "Task",
      fields: {
        "System.Title": milestone.title,
        "System.Description": milestone.body,
        "System.State": "New",
        "System.Priority": milestone.labels.includes('high-priority') ? 1 : 2,
        "System.Tags": milestone.labels.join("; "),
        "System.IterationPath": `\\SCK Platform\\${milestone.milestone}`,
        "Microsoft.VSTS.Scheduling.OriginalEstimate": this.parseEstimateHours(milestone.estimate)
      }
    }));

    return {
      project,
      iterations,
      workItems,
      metadata: {
        exportedAt: new Date().toISOString(),
        format: 'azure-devops',
        totalWorkItems: workItems.length
      }
    };
  }

  toTrello() {
    const board = {
      name: "SCK Platform Milestones",
      desc: "SCK Platform development tracking board"
    };

    const lists = [
      { name: "Milestone 1: ANS Foundation" },
      { name: "Milestone 2: Public Verification" },
      { name: "Milestone 3: Signal Processing" },
      { name: "Milestone 4: NFT Integration" },
      { name: "Milestone 5: Platform Stability" }
    ];

    const cards = milestones.map(milestone => ({
      name: milestone.title,
      desc: milestone.body,
      listName: milestone.milestone,
      labels: milestone.labels.map(label => ({
        name: label,
        color: this.getLabelColor(label)
      })),
      due: null, // Can be set based on milestone dates
      checklists: this.extractChecklistFromBody(milestone.body)
    }));

    return {
      board,
      lists,
      cards,
      metadata: {
        exportedAt: new Date().toISOString(),
        format: 'trello',
        totalCards: cards.length
      }
    };
  }

  // Helper methods
  parseEstimate(estimate) {
    if (!estimate) return 0;
    const match = estimate.match(/(\d+)([dhw])/);
    if (!match) return 0;

    const [, value, unit] = match;
    const num = parseInt(value);

    switch (unit) {
      case 'd': return num; // days
      case 'h': return num / 8; // hours to days
      case 'w': return num * 5; // weeks to days
      default: return num;
    }
  }

  parseEstimateHours(estimate) {
    if (!estimate) return 0;
    const days = this.parseEstimate(estimate);
    return days * 8; // 8 hours per day
  }

  parseEstimateSeconds(estimate) {
    const hours = this.parseEstimateHours(estimate);
    return hours * 3600; // 3600 seconds per hour
  }

  getMilestoneNumber(milestone) {
    return parseInt(milestone.match(/Milestone (\d+)/)?.[1] || '1');
  }

  getComplexity(labels) {
    if (labels.includes('high-priority')) return 'High';
    if (labels.includes('security')) return 'High';
    if (labels.includes('frontend')) return 'Medium';
    return 'Low';
  }

  getLabelColor(label) {
    const colorMap = {
      'high-priority': 'red',
      'security': 'red',
      'backend': 'blue',
      'frontend': 'green',
      'documentation': 'yellow',
      'cleanup': 'gray'
    };
    return colorMap[label] || 'blue';
  }

  extractChecklistFromBody(body) {
    const lines = body.split('\n');
    const checklists = [];
    let currentChecklist = null;

    for (const line of lines) {
      if (line.includes('**Acceptance Criteria:**') || line.includes('**Definition of Done:**')) {
        if (currentChecklist) {
          checklists.push(currentChecklist);
        }
        currentChecklist = {
          name: line.replace(/\*\*/g, '').replace(':', ''),
          items: []
        };
      } else if (line.trim().startsWith('- [ ]') && currentChecklist) {
        currentChecklist.items.push({
          name: line.trim().substring(5),
          checked: false
        });
      }
    }

    if (currentChecklist) {
      checklists.push(currentChecklist);
    }

    return checklists;
  }

  writeToFile(data) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = path.join(this.outputDir, `sck-milestones-${this.format}-${timestamp}.json`);

    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
    return filename;
  }

  logStats(data) {
    this.log(`📊 Export Statistics:`);

    switch (this.format) {
      case 'linear':
        this.log(`   Teams: ${data.teams.length}`);
        this.log(`   Projects: ${data.projects.length}`);
        this.log(`   Issues: ${data.issues.length}`);
        break;
      case 'clickup':
        this.log(`   Spaces: ${data.spaces.length}`);
        this.log(`   Folders: ${data.folders.length}`);
        this.log(`   Tasks: ${data.tasks.length}`);
        break;
      case 'notion':
        this.log(`   Database: ${data.database.title}`);
        this.log(`   Pages: ${data.pages.length}`);
        break;
      default:
        this.log(`   Items: ${Object.keys(data).length - 1}`); // -1 for metadata
    }
  }

  log(message) {
    if (this.verbose || !message.startsWith('   ')) {
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
      case '--format':
        options.format = args[++i];
        break;
      case '--output':
        options.outputDir = args[++i];
        break;
      case '--verbose':
        options.verbose = true;
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
Kanban Export Script for SCK Platform

Usage:
  node scripts/kanban-export.js [options]

Options:
  --format FORMAT        Export format (${Object.keys(FORMATS).join(', ')})
  --output DIR           Output directory (default: ./exports)
  --verbose              Show detailed output
  --help                 Show this help

Examples:
  # Export for Linear
  node scripts/kanban-export.js --format linear

  # Export for ClickUp with custom output
  node scripts/kanban-export.js --format clickup --output ./my-exports

  # Export all formats
  ${Object.keys(FORMATS).map(f => `node scripts/kanban-export.js --format ${f}`).join('\n  ')}
`);
}

// Main execution
async function main() {
  const options = parseArgs();

  try {
    const exporter = new KanbanExporter(options);
    await exporter.export();
  } catch (error) {
    console.error(`❌ Export failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { KanbanExporter, FORMATS }; 