import { PrismaClient, ArtifactType, LoALevel, ApprovalFacet } from '@prisma/client';

const prisma = new PrismaClient();

const defaultLoAPolicies = [
  // RoleAgent LoA Policies
  {
    artifactType: 'RoleAgent' as ArtifactType,
    level: 'L1' as LoALevel,
    minReviewers: 1,
    requiredFacets: ['security'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Low-risk role agent onboarding - basic security review required'
  },
  {
    artifactType: 'RoleAgent' as ArtifactType,
    level: 'L2' as LoALevel,
    minReviewers: 2,
    requiredFacets: ['security', 'compliance'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Standard role agent onboarding - security and compliance review required'
  },
  {
    artifactType: 'RoleAgent' as ArtifactType,
    level: 'L3' as LoALevel,
    minReviewers: 3,
    requiredFacets: ['security', 'compliance', 'policy'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Intermediate role agent - comprehensive review with policy considerations'
  },
  {
    artifactType: 'RoleAgent' as ArtifactType,
    level: 'L4' as LoALevel,
    minReviewers: 4,
    requiredFacets: ['security', 'compliance', 'policy', 'risk'] as ApprovalFacet[],
    externalRequired: true,
    description: 'Advanced role agent - full review with external validation required'
  },
  {
    artifactType: 'RoleAgent' as ArtifactType,
    level: 'L5' as LoALevel,
    minReviewers: 5,
    requiredFacets: ['security', 'compliance', 'policy', 'risk'] as ApprovalFacet[],
    externalRequired: true,
    description: 'Critical role agent - maximum review with independent external validation'
  },

  // MCP Policy LoA Policies
  {
    artifactType: 'MCP' as ArtifactType,
    level: 'L1' as LoALevel,
    minReviewers: 1,
    requiredFacets: ['security'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Basic MCP policy - security review required'
  },
  {
    artifactType: 'MCP' as ArtifactType,
    level: 'L2' as LoALevel,
    minReviewers: 2,
    requiredFacets: ['security', 'compliance'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Standard MCP policy - security and compliance review required'
  },
  {
    artifactType: 'MCP' as ArtifactType,
    level: 'L3' as LoALevel,
    minReviewers: 3,
    requiredFacets: ['security', 'compliance', 'policy'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Intermediate MCP policy - comprehensive review required'
  },
  {
    artifactType: 'MCP' as ArtifactType,
    level: 'L4' as LoALevel,
    minReviewers: 4,
    requiredFacets: ['security', 'compliance', 'policy', 'risk'] as ApprovalFacet[],
    externalRequired: true,
    description: 'Advanced MCP policy - full review with external validation'
  },
  {
    artifactType: 'MCP' as ArtifactType,
    level: 'L5' as LoALevel,
    minReviewers: 5,
    requiredFacets: ['security', 'compliance', 'policy', 'risk'] as ApprovalFacet[],
    externalRequired: true,
    description: 'Critical MCP policy - maximum review with independent validation'
  },

  // Signal LoA Policies
  {
    artifactType: 'Signal' as ArtifactType,
    level: 'L1' as LoALevel,
    minReviewers: 1,
    requiredFacets: ['security'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Low-risk signal - basic security validation'
  },
  {
    artifactType: 'Signal' as ArtifactType,
    level: 'L2' as LoALevel,
    minReviewers: 2,
    requiredFacets: ['security', 'compliance'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Standard signal - security and compliance validation'
  },
  {
    artifactType: 'Signal' as ArtifactType,
    level: 'L3' as LoALevel,
    minReviewers: 3,
    requiredFacets: ['security', 'compliance', 'policy'] as ApprovalFacet[],
    externalRequired: false,
    description: 'High-value signal - comprehensive validation required'
  },

  // ANS Registration LoA Policies
  {
    artifactType: 'ANS' as ArtifactType,
    level: 'L1' as LoALevel,
    minReviewers: 1,
    requiredFacets: ['security'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Basic ANS registration - security review required'
  },
  {
    artifactType: 'ANS' as ArtifactType,
    level: 'L2' as LoALevel,
    minReviewers: 2,
    requiredFacets: ['security', 'compliance'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Standard ANS registration - security and compliance review'
  },
  {
    artifactType: 'ANS' as ArtifactType,
    level: 'L3' as LoALevel,
    minReviewers: 3,
    requiredFacets: ['security', 'compliance', 'policy'] as ApprovalFacet[],
    externalRequired: false,
    description: 'Advanced ANS registration - comprehensive review required'
  },
  {
    artifactType: 'ANS' as ArtifactType,
    level: 'L4' as LoALevel,
    minReviewers: 4,
    requiredFacets: ['security', 'compliance', 'policy', 'risk'] as ApprovalFacet[],
    externalRequired: true,
    description: 'Critical ANS registration - full review with external validation'
  },
  {
    artifactType: 'ANS' as ArtifactType,
    level: 'L5' as LoALevel,
    minReviewers: 5,
    requiredFacets: ['security', 'compliance', 'policy', 'risk'] as ApprovalFacet[],
    externalRequired: true,
    description: 'Root ANS registration - maximum review with independent validation'
  }
];

async function seedLoAPolicies() {
  try {
    console.log('🌱 Starting LoA policies seeding...');

    // Get the first organization (or create one if none exists)
    let organization = await prisma.organization.findFirst({
      where: { isActive: true }
    });

    if (!organization) {
      console.log('No organization found, creating default organization...');
      organization = await prisma.organization.create({
        data: {
          name: 'Default Organization',
          domain: 'default.local',
          description: 'Default organization for LoA policies',
          isActive: true,
          onboardingComplete: true
        }
      });
      console.log(`✅ Created default organization: ${organization.name} (${organization.id})`);
    } else {
      console.log(`✅ Using existing organization: ${organization.name} (${organization.id})`);
    }

    // Clear existing LoA policies for this organization
    console.log('🗑️  Clearing existing LoA policies...');
    await prisma.loaPolicy.deleteMany({
      where: { organizationId: organization.id }
    });

    // Create new LoA policies
    console.log('📝 Creating LoA policies...');
    const createdPolicies = [];

    for (const policyData of defaultLoAPolicies) {
      const policy = await prisma.loaPolicy.create({
        data: {
          organizationId: organization.id,
          ...policyData
        }
      });
      createdPolicies.push(policy);
      console.log(`✅ Created ${policy.artifactType} L${policy.level} policy`);
    }

    console.log(`🎉 Successfully seeded ${createdPolicies.length} LoA policies!`);
    console.log(`📊 Summary:`);
    console.log(`   - RoleAgent: ${createdPolicies.filter(p => p.artifactType === 'RoleAgent').length} policies`);
    console.log(`   - MCP: ${createdPolicies.filter(p => p.artifactType === 'MCP').length} policies`);
    console.log(`   - Signal: ${createdPolicies.filter(p => p.artifactType === 'Signal').length} policies`);
    console.log(`   - ANS: ${createdPolicies.filter(p => p.artifactType === 'ANS').length} policies`);

    return { success: true, policies: createdPolicies };
  } catch (error) {
    console.error('❌ Error seeding LoA policies:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedLoAPolicies()
    .then((result) => {
      if (result.success) {
        console.log('🎯 LoA policies seeding completed successfully!');
        process.exit(0);
      } else {
        console.error('💥 LoA policies seeding failed!');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Unexpected error during seeding:', error);
      process.exit(1);
    });
}

export default seedLoAPolicies;
