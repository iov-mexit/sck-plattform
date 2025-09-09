export interface PrivilegeRecommendation {
  teamId: string;
  projectPhaseId?: string;
  recommendedLoA: number;
  rationale: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiredApprovals: string[];
  suggestedControls: string[];
  complianceRequirements: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  trustScore: number;
  skills: string[];
  certifications: any[];
}

export interface PrivilegeRecommendationRequest {
  teamId?: string;
  projectPhaseId?: string;
  teamMembers?: TeamMember[];
  projectSensitivity?: 'low' | 'medium' | 'high' | 'critical';
}

export async function recommendPrivileges(request: PrivilegeRecommendationRequest): Promise<PrivilegeRecommendation> {
  try {
    const { teamMembers = [], projectSensitivity = 'medium' } = request;

    // Calculate team trust metrics
    const avgTrustScore = teamMembers.length > 0
      ? teamMembers.reduce((sum, member) => sum + member.trustScore, 0) / teamMembers.length
      : 0;

    const minTrustScore = teamMembers.length > 0
      ? Math.min(...teamMembers.map(member => member.trustScore))
      : 0;

    // Determine risk level based on project sensitivity and team trust
    const riskLevel = determineRiskLevel(projectSensitivity, avgTrustScore, minTrustScore);

    // Calculate recommended LoA based on risk level and team composition
    const recommendedLoA = calculateRecommendedLoA(riskLevel, avgTrustScore, teamMembers.length);

    // Generate rationale
    const rationale = generatePrivilegeRationale(
      riskLevel,
      recommendedLoA,
      avgTrustScore,
      teamMembers.length,
      projectSensitivity
    );

    // Determine required approvals
    const requiredApprovals = determineRequiredApprovals(recommendedLoA, riskLevel);

    // Suggest security controls
    const suggestedControls = suggestSecurityControls(recommendedLoA, riskLevel, teamMembers);

    // Identify compliance requirements
    const complianceRequirements = identifyComplianceRequirements(projectSensitivity, teamMembers);

    return {
      teamId: request.teamId || 'unknown',
      projectPhaseId: request.projectPhaseId,
      recommendedLoA,
      rationale,
      riskLevel,
      requiredApprovals,
      suggestedControls,
      complianceRequirements
    };
  } catch (error) {
    console.error("Error in recommendPrivileges:", error);
    throw new Error(`Failed to recommend privileges: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function determineRiskLevel(
  projectSensitivity: string,
  avgTrustScore: number,
  minTrustScore: number
): 'low' | 'medium' | 'high' | 'critical' {
  // High sensitivity projects require higher trust
  if (projectSensitivity === 'critical') {
    if (avgTrustScore >= 4.5 && minTrustScore >= 4) return 'low';
    if (avgTrustScore >= 3.5 && minTrustScore >= 3) return 'medium';
    if (avgTrustScore >= 2.5 && minTrustScore >= 2) return 'high';
    return 'critical';
  }

  if (projectSensitivity === 'high') {
    if (avgTrustScore >= 4 && minTrustScore >= 3.5) return 'low';
    if (avgTrustScore >= 3 && minTrustScore >= 2.5) return 'medium';
    if (avgTrustScore >= 2 && minTrustScore >= 1.5) return 'high';
    return 'critical';
  }

  if (projectSensitivity === 'medium') {
    if (avgTrustScore >= 3.5 && minTrustScore >= 3) return 'low';
    if (avgTrustScore >= 2.5 && minTrustScore >= 2) return 'medium';
    if (avgTrustScore >= 1.5 && minTrustScore >= 1) return 'high';
    return 'critical';
  }

  // Low sensitivity
  if (avgTrustScore >= 3 && minTrustScore >= 2.5) return 'low';
  if (avgTrustScore >= 2 && minTrustScore >= 1.5) return 'medium';
  if (avgTrustScore >= 1 && minTrustScore >= 0.5) return 'high';
  return 'critical';
}

function calculateRecommendedLoA(
  riskLevel: string,
  avgTrustScore: number,
  teamSize: number
): number {
  // Base LoA on risk level
  let baseLoA = 1;
  switch (riskLevel) {
    case 'low': baseLoA = 2; break;
    case 'medium': baseLoA = 3; break;
    case 'high': baseLoA = 4; break;
    case 'critical': baseLoA = 5; break;
  }

  // Adjust based on trust score
  if (avgTrustScore >= 4.5) baseLoA = Math.max(1, baseLoA - 1);
  else if (avgTrustScore <= 2) baseLoA = Math.min(5, baseLoA + 1);

  // Adjust based on team size (larger teams need more oversight)
  if (teamSize > 8) baseLoA = Math.min(5, baseLoA + 1);
  else if (teamSize <= 2) baseLoA = Math.max(1, baseLoA - 1);

  return Math.max(1, Math.min(5, baseLoA));
}

function generatePrivilegeRationale(
  riskLevel: string,
  recommendedLoA: number,
  avgTrustScore: number,
  teamSize: number,
  projectSensitivity: string
): string {
  let rationale = `Recommended LoA ${recommendedLoA} based on `;
  
  rationale += `${projectSensitivity} sensitivity project with `;
  rationale += `average trust score ${avgTrustScore.toFixed(1)}/5 and team size ${teamSize}. `;

  if (riskLevel === 'low') {
    rationale += "Low risk profile allows for streamlined access controls.";
  } else if (riskLevel === 'medium') {
    rationale += "Medium risk requires balanced security measures.";
  } else if (riskLevel === 'high') {
    rationale += "High risk necessitates enhanced monitoring and controls.";
  } else {
    rationale += "Critical risk requires maximum security oversight and approval workflows.";
  }

  return rationale;
}

function determineRequiredApprovals(loA: number, riskLevel: string): string[] {
  const approvals: string[] = [];

  if (loA >= 3) {
    approvals.push('Security Team');
  }
  if (loA >= 4) {
    approvals.push('CISO');
  }
  if (loA >= 5 || riskLevel === 'critical') {
    approvals.push('Executive Leadership');
  }
  if (loA >= 2) {
    approvals.push('Project Manager');
  }

  return approvals;
}

function suggestSecurityControls(
  loA: number,
  riskLevel: string,
  teamMembers: TeamMember[]
): string[] {
  const controls: string[] = [];

  // Basic controls for all levels
  controls.push('Multi-factor authentication');
  controls.push('Regular access reviews');

  if (loA >= 2) {
    controls.push('Session monitoring');
    controls.push('Privileged access management');
  }

  if (loA >= 3) {
    controls.push('Behavioral analytics');
    controls.push('Real-time threat detection');
  }

  if (loA >= 4) {
    controls.push('Zero-trust network access');
    controls.push('Continuous compliance monitoring');
  }

  if (loA >= 5 || riskLevel === 'critical') {
    controls.push('Air-gapped environments');
    controls.push('Hardware security modules');
    controls.push('Quantum-resistant encryption');
  }

  // Team-specific controls
  const hasSecuritySkills = teamMembers.some(member =>
    member.skills.some(skill => 
      skill.toLowerCase().includes('security') || 
      skill.toLowerCase().includes('compliance')
    )
  );

  if (!hasSecuritySkills) {
    controls.push('Security training requirement');
    controls.push('Security mentor assignment');
  }

  return controls;
}

function identifyComplianceRequirements(
  projectSensitivity: string,
  teamMembers: TeamMember[]
): string[] {
  const requirements: string[] = [];

  // Base compliance requirements
  requirements.push('GDPR compliance');
  requirements.push('Data retention policies');

  if (projectSensitivity === 'high' || projectSensitivity === 'critical') {
    requirements.push('SOC 2 Type II');
    requirements.push('ISO 27001');
  }

  if (projectSensitivity === 'critical') {
    requirements.push('FedRAMP (if applicable)');
    requirements.push('NIST Cybersecurity Framework');
  }

  // Check for specific certifications
  const hasSecurityCerts = teamMembers.some(member =>
    member.certifications.some(cert =>
      cert.name.toLowerCase().includes('cissp') ||
      cert.name.toLowerCase().includes('cism') ||
      cert.name.toLowerCase().includes('cisa')
    )
  );

  if (!hasSecurityCerts && (projectSensitivity === 'high' || projectSensitivity === 'critical')) {
    requirements.push('Security certification requirement');
  }

  return requirements;
}
