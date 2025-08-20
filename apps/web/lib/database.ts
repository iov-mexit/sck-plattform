import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Organization operations
export async function createOrganization(data: {
  name: string;
  domain: string;
  description?: string;
}) {
  try {
    const organization = await prisma.organizations.create({
      data: {
        id: `org-${Date.now()}`,
        name: data.name,
        domain: data.domain,
        description: data.description,
        isActive: true,
        onboardingComplete: false,
        updatedAt: new Date(),
      },
    });
    return { success: true, data: organization };
  } catch (error) {
    console.error('Error creating organization:', error);
    return { success: false, error: 'Failed to create organization' };
  }
}

export async function getOrganizations() {
  try {
    const organizations = await prisma.organizations.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: organizations };
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return { success: false, error: 'Failed to fetch organizations' };
  }
}

export async function getOrganizationByDomain(domain: string) {
  try {
    const organization = await prisma.organizations.findUnique({
      where: { domain },
    });
    return { success: true, data: organization };
  } catch (error) {
    console.error('Error fetching organization:', error);
    return { success: false, error: 'Failed to fetch organization' };
  }
}

// Role agent operations
export async function getRoleAgents(organizationId?: string) {
  try {
    const where = organizationId ? { organizationId } : {};

    const roleAgents = await prisma.role_agents.findMany({
      where,
      include: {
        role_templates: true,
        organizations: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: roleAgents };
  } catch (error) {
    console.error('Error fetching role agents:', error);
    return { success: false, error: 'Failed to fetch role agents' };
  }
}

export async function getRoleAgentById(id: string) {
  try {
    const roleAgent = await prisma.role_agents.findUnique({
      where: { id },
      include: {
        role_templates: true,
        organizations: true,
        signals: true,
        certifications: true,
      },
    });
    return { success: true, data: roleAgent };
  } catch (error) {
    console.error('Error fetching role agent:', error);
    return { success: false, error: 'Failed to fetch role agent' };
  }
}

export async function getRoleAgentByDid(assignedToDid: string) {
  try {
    const roleAgent = await prisma.role_agents.findFirst({
      where: { assignedToDid },
      include: {
        role_templates: true,
        organizations: true,
      },
    });
    return { success: true, data: roleAgent };
  } catch (error) {
    console.error('Error fetching role agent by DID:', error);
    return { success: false, error: 'Failed to fetch role agent' };
  }
}

// Create a new role agent
export async function createRoleAgent(data: {
  organizationId: string;
  roleTemplateId: string;
  assignedToDid: string;
  name: string;
  description?: string;
  trustScore?: number;
}) {
  try {
    // Check if DID already exists
    const existingAgent = await prisma.role_agents.findFirst({
      where: { assignedToDid: data.assignedToDid },
    });

    if (existingAgent) {
      return {
        success: false,
        error: 'DUPLICATE_DID',
        message: 'A role agent with this DID already exists',
        existingRoleAgent: existingAgent
      };
    }

    const roleAgent = await prisma.role_agents.create({
      data: {
        id: `agent-${Date.now()}`,
        name: data.name,
        description: data.description,
        assignedToDid: data.assignedToDid,
        organizationId: data.organizationId,
        roleTemplateId: data.roleTemplateId,
        trustScore: data.trustScore || 0,
        isEligibleForMint: (data.trustScore || 0) >= 750,
        status: 'active',
        level: 1,
        updatedAt: new Date(),
      },
      include: {
        role_templates: true,
        organizations: true,
      },
    });

    return { success: true, data: roleAgent };
  } catch (error) {
    console.error('Error creating role agent:', error);
    return { success: false, error: 'Failed to create role agent' };
  }
}

// Add a signal to a role agent
export async function addSignal(data: {
  roleAgentId: string;
  type: string;
  title: string;
  description?: string;
  value?: number;
  source?: string;
  url?: string;
}) {
  try {
    const signal = await prisma.signals.create({
      data: {
        id: `signal-${Date.now()}`,
        type: data.type,
        title: data.title,
        description: data.description,
        value: data.value || 0,
        source: data.source || 'Unknown',
        url: data.url,
        verified: false,
        roleAgentId: data.roleAgentId,
        updatedAt: new Date(),
      },
    });
    return { success: true, data: signal };
  } catch (error) {
    console.error('Error adding signal:', error);
    return { success: false, error: 'Failed to add signal' };
  }
}

// Get signals for a role agent
export async function getSignalsForRoleAgent(roleAgentId: string) {
  try {
    const signals = await prisma.signals.findMany({
      where: { roleAgentId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: signals };
  } catch (error) {
    console.error('Error fetching signals:', error);
    return { success: false, error: 'Failed to fetch signals' };
  }
}

// Get signal count for a role agent
export async function getSignalCount(roleAgentId: string) {
  try {
    const count = await prisma.signals.count({
      where: { roleAgentId },
    });
    return { success: true, data: count };
  } catch (error) {
    console.error('Error counting signals:', error);
    return { success: false, error: 'Failed to count signals' };
  }
}

// Get recent signals for a role agent
export async function getRecentSignals(roleAgentId: string, limit: number = 10) {
  try {
    const signals = await prisma.signals.findMany({
      where: { roleAgentId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { success: true, data: signals };
  } catch (error) {
    console.error('Error fetching recent signals:', error);
    return { success: false, error: 'Failed to fetch recent signals' };
  }
}

// Role template operations
export async function getRoleTemplates(organizationId?: string) {
  try {
    const where = organizationId ? { organizationId } : {};

    const templates = await prisma.role_templates.findMany({
      where: { ...where, selectable: true },
      orderBy: { category: 'asc' },
    });

    return { success: true, data: templates };
  } catch (error) {
    console.error('Error fetching role templates:', error);
    return { success: false, error: 'Failed to fetch role templates' };
  }
}

export async function getRoleTemplateById(id: string) {
  try {
    const template = await prisma.role_templates.findUnique({
      where: { id },
    });
    return { success: true, data: template };
  } catch (error) {
    console.error('Error fetching role template:', error);
    return { success: false, error: 'Failed to fetch role template' };
  }
}

export default prisma; 