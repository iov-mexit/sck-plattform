const fs = require('fs');
const path = require('path');

const roleTemplates = ['security_engineer', 'devops', 'qa', 'sre', 'release_manager', 'security_analyst'];
const endpoints = [
  '/secrets/rotate', '/deploy/service', '/scan/run', '/config/update', 
  '/access/grant', '/firewall/rule', '/backup/create', '/monitoring/alert'
];
const environments = ['dev', 'staging', 'prod'];
const signalSources = ['SCW', 'GitHub', 'ISACA', 'SOC2', 'ISO_AUDIT'];
const urgencyLevels = ['low', 'medium', 'high', 'critical'];

// Security framework snippets
const securitySnippets = [
  { id: 'iso27001:A.12.6.1', text: 'Key rotation guidance: cryptographic keys shall be rotated according to risk assessment and organizational policy.' },
  { id: 'iso27001:A.12.1', text: 'Change management: production deployments require formal approval process and risk assessment.' },
  { id: 'iso27001:A.12.4.1', text: 'Regular monitoring: security scans on non-production environments are permitted for qualified agents.' },
  { id: 'iso42001:AI.4.1', text: 'AI system deployment requires risk assessment and human oversight for high-impact decisions.' },
  { id: 'soc2:CC6.1', text: 'Access control: system access shall be granted based on business need and least privilege principles.' },
  { id: 'eu_ai_act:Art.6', text: 'High-risk AI systems require conformity assessment and human oversight before deployment.' }
];

function sample(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateSample() {
  const role = sample(roleTemplates);
  const env = sample(environments);
  const level = randomInt(1, 5);
  const endpoint = sample(endpoints);
  const signal = sample(signalSources);
  const snippet = sample(securitySnippets);
  const recentScore = randomInt(600, 999);
  const urgency = sample(urgencyLevels);

  // Decision logic
  let requiresApproval = false;
  let approvalsNeeded = [];
  let action = '';
  let arguments_ = {};
  let riskAssessment = 'LOW';

  // Determine action and approval requirements
  if (endpoint.includes('rotate') || endpoint.includes('secrets')) {
    action = 'rotate_key';
    arguments_ = { keyId: `k-${randomInt(100, 999)}` };
    requiresApproval = (env === 'prod' && level < 4) || level < 3;
    riskAssessment = 'HIGH';
  } else if (endpoint.includes('deploy')) {
    action = 'request_deploy';
    arguments_ = { 
      service: `service-${randomInt(1, 5)}`, 
      version: `v${randomInt(1, 9)}.${randomInt(0, 9)}.${randomInt(0, 9)}` 
    };
    requiresApproval = env === 'prod' || level < 4;
    riskAssessment = env === 'prod' ? 'HIGH' : 'MEDIUM';
  } else if (endpoint.includes('scan')) {
    action = 'run_security_scan';
    arguments_ = { target: `${env}-${randomInt(1, 10)}` };
    requiresApproval = false;
    riskAssessment = 'LOW';
  } else if (endpoint.includes('access')) {
    action = 'grant_access';
    arguments_ = { userId: `user-${randomInt(100, 999)}`, role: 'developer' };
    requiresApproval = level < 4;
    riskAssessment = 'MEDIUM';
  } else {
    action = 'update_config';
    arguments_ = { configKey: 'setting', value: 'updated' };
    requiresApproval = env === 'prod' && level < 3;
    riskAssessment = 'LOW';
  }

  // Set approval requirements
  if (requiresApproval) {
    if (env === 'prod') {
      approvalsNeeded.push('role-release-manager');
    }
    if (level < 4) {
      approvalsNeeded.push('role-secgov-approver');
    }
    if (endpoint.includes('secrets') || endpoint.includes('access')) {
      approvalsNeeded.push('role-security-admin');
    }
  }

  // Generate justification
  const justification = `${action.replace('_', ' ')} for ${endpoint} in ${env} environment. ` +
    `Trust level ${level} ${requiresApproval ? 'requires approval' : 'allows direct action'} ` +
    `per ${snippet.id} and organizational policy.`;

  const output = {
    action,
    endpoint,
    arguments: arguments_,
    requiresApproval,
    approvalsNeeded,
    justification,
    sources: [{ id: snippet.id, score: 0.85 + Math.random() * 0.1 }],
    confidence: 0.7 + Math.random() * 0.25,
    riskAssessment,
    complianceNotes: [snippet.id.replace(':', '_')]
  };

  return {
    input: {
      role_template: role,
      agent_trust_level: level,
      endpoint,
      environment: env,
      context_snippets: [snippet],
      recent_signals: [{ source: signal, score: recentScore }],
      urgency
    },
    output: JSON.stringify(output)
  };
}

// Generate dataset
const OUT_FILE = path.join(__dirname, '../data/train_generated.jsonl');
const out = fs.createWriteStream(OUT_FILE);

console.log('Generating SML training dataset...');

for (let i = 0; i < 10000; i++) {
  const sample = generateSample();
  out.write(JSON.stringify(sample) + '\n');
  
  if (i % 1000 === 0) {
    console.log(`Generated ${i} samples...`);
  }
}

out.end();
console.log(`✅ Generated ${OUT_FILE} with 10,000 training samples`);
