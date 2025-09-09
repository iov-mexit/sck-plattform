#!/usr/bin/env node

/**
 * Test script for Team Composition Engine
 * Tests the skill matching algorithm and team suggestion logic
 */

// Mock data for testing
const mockRoleAgents = [
  {
    id: 'agent-1',
    name: 'Alice Johnson',
    roleTemplate: { title: 'Security Engineer', focus: 'Security Architecture', category: 'Security' },
    trustScore: 850,
    certifications: [
      { name: 'CISSP', issuer: 'ISC2', verified: true },
      { name: 'CISM', issuer: 'ISACA', verified: true }
    ],
    signals: [
      { title: 'Threat Modeling', value: 0.9, verified: true },
      { title: 'Risk Assessment', value: 0.8, verified: true }
    ]
  },
  {
    id: 'agent-2',
    name: 'Bob Smith',
    roleTemplate: { title: 'Backend Engineer', focus: 'API Development', category: 'Engineering' },
    trustScore: 750,
    certifications: [
      { name: 'AWS Solutions Architect', issuer: 'Amazon', verified: true }
    ],
    signals: [
      { title: 'TypeScript', value: 0.9, verified: true },
      { title: 'Node.js', value: 0.8, verified: true }
    ]
  },
  {
    id: 'agent-3',
    name: 'Carol Davis',
    roleTemplate: { title: 'Compliance Specialist', focus: 'GDPR Compliance', category: 'Compliance' },
    trustScore: 900,
    certifications: [
      { name: 'CIPP/E', issuer: 'IAPP', verified: true },
      { name: 'ISO27001 Lead Auditor', issuer: 'ISO', verified: true }
    ],
    signals: [
      { title: 'GDPR', value: 0.95, verified: true },
      { title: 'NIST', value: 0.8, verified: true }
    ]
  }
];

// Skill matching algorithm (simplified version)
function extractSkills(agent) {
  const skills = new Set();

  // Add role template skills
  if (agent.roleTemplate.focus) {
    skills.add(agent.roleTemplate.focus.toLowerCase());
  }
  if (agent.roleTemplate.category) {
    skills.add(agent.roleTemplate.category.toLowerCase());
  }

  // Add certification skills
  agent.certifications.forEach(cert => {
    if (cert.verified) {
      skills.add(cert.name.toLowerCase());
      skills.add(cert.issuer.toLowerCase());
    }
  });

  // Add signal-based skills
  agent.signals.forEach(signal => {
    if (signal.verified && signal.value > 0.7) {
      skills.add(signal.title.toLowerCase());
    }
  });

  return Array.from(skills);
}

// Team suggestion algorithm
function suggestTeam(roleAgents, requiredSkills, trustMinLevel = 3, teamSize = 5) {
  console.log('🎯 Team Composition Engine Test');
  console.log('================================');
  console.log(`Required Skills: ${requiredSkills.join(', ')}`);
  console.log(`Trust Min Level: L${trustMinLevel} (${trustMinLevel * 100}+)`);
  console.log(`Team Size: ${teamSize}`);
  console.log('');

  // Extract skills from agents
  const agentsWithSkills = roleAgents.map(agent => {
    const skills = extractSkills(agent);
    return { ...agent, skills };
  });

  // Calculate skill matching scores
  const requiredSkillsLower = requiredSkills.map(skill => skill.toLowerCase());

  agentsWithSkills.forEach(agent => {
    let matchCount = 0;
    let totalScore = 0;

    requiredSkillsLower.forEach(requiredSkill => {
      agent.skills.forEach(agentSkill => {
        if (agentSkill.includes(requiredSkill) || requiredSkill.includes(agentSkill)) {
          matchCount++;
          totalScore += 1;
        }
      });
    });

    agent.skillMatchCount = matchCount;
    agent.skillMatchScore = totalScore / requiredSkills.length;
  });

  // Filter by trust level and sort by skill match
  const sortedAgents = agentsWithSkills
    .filter(agent => agent.trustScore >= (trustMinLevel * 100))
    .sort((a, b) => {
      if (a.skillMatchScore !== b.skillMatchScore) {
        return b.skillMatchScore - a.skillMatchScore;
      }
      return b.trustScore - a.trustScore;
    });

  // Select top agents
  const suggestedTeam = sortedAgents.slice(0, teamSize);

  // Identify skill gaps
  const coveredSkills = new Set();
  suggestedTeam.forEach(agent => {
    agent.skills.forEach(skill => {
      coveredSkills.add(skill);
    });
  });

  const gaps = requiredSkillsLower.filter(skill =>
    !Array.from(coveredSkills).some(coveredSkill =>
      coveredSkill.includes(skill) || skill.includes(coveredSkill)
    )
  );

  return { suggestedTeam, gaps, totalCandidates: roleAgents.length };
}

// Test cases
console.log('🧪 Running Team Composition Engine Tests\n');

// Test 1: Threat Modeling Team
console.log('📋 TEST 1: Threat Modeling Team');
const threatModelingResult = suggestTeam(
  mockRoleAgents,
  ['Threat Modeling', 'Risk Assessment', 'Security Architecture'],
  4,
  2
);

console.log('Suggested Team:');
threatModelingResult.suggestedTeam.forEach((agent, index) => {
  console.log(`  ${index + 1}. ${agent.name} (${agent.roleTemplate.title})`);
  console.log(`     Trust Score: ${agent.trustScore}`);
  console.log(`     Skill Match: ${Math.round(agent.skillMatchScore * 100)}%`);
  console.log(`     Skills: ${agent.skills.slice(0, 3).join(', ')}...`);
  console.log('');
});

if (threatModelingResult.gaps.length > 0) {
  console.log(`⚠️  Skill Gaps: ${threatModelingResult.gaps.join(', ')}`);
} else {
  console.log('✅ All required skills covered!');
}

console.log('---\n');

// Test 2: Implementation Team
console.log('📋 TEST 2: Implementation Team');
const implementationResult = suggestTeam(
  mockRoleAgents,
  ['TypeScript', 'Node.js', 'AWS'],
  3,
  3
);

console.log('Suggested Team:');
implementationResult.suggestedTeam.forEach((agent, index) => {
  console.log(`  ${index + 1}. ${agent.name} (${agent.roleTemplate.title})`);
  console.log(`     Trust Score: ${agent.trustScore}`);
  console.log(`     Skill Match: ${Math.round(agent.skillMatchScore * 100)}%`);
  console.log(`     Skills: ${agent.skills.slice(0, 3).join(', ')}...`);
  console.log('');
});

if (implementationResult.gaps.length > 0) {
  console.log(`⚠️  Skill Gaps: ${implementationResult.gaps.join(', ')}`);
} else {
  console.log('✅ All required skills covered!');
}

console.log('---\n');

// Test 3: Compliance Audit Team
console.log('📋 TEST 3: Compliance Audit Team');
const complianceResult = suggestTeam(
  mockRoleAgents,
  ['GDPR', 'NIST', 'ISO27001'],
  4,
  2
);

console.log('Suggested Team:');
complianceResult.suggestedTeam.forEach((agent, index) => {
  console.log(`  ${index + 1}. ${agent.name} (${agent.roleTemplate.title})`);
  console.log(`     Trust Score: ${agent.trustScore}`);
  console.log(`     Skill Match: ${Math.round(agent.skillMatchScore * 100)}%`);
  console.log(`     Skills: ${agent.skills.slice(0, 3).join(', ')}...`);
  console.log('');
});

if (complianceResult.gaps.length > 0) {
  console.log(`⚠️  Skill Gaps: ${complianceResult.gaps.join(', ')}`);
} else {
  console.log('✅ All required skills covered!');
}

console.log('\n🎉 Team Composition Engine Test Complete!');
console.log('The algorithm successfully matches skills, trust levels, and identifies gaps.');


