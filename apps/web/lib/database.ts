import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
declare global {
  var __prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client instance
const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Store the client in global scope to prevent multiple instances in development
if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma;
}

export { prisma };

// =============================================================================
// DATABASE SERVICE CLASSES
// =============================================================================

export class OrganizationService {
  /**
   * Get organization by domain
   */
  static async getByDomain(domain: string) {
    try {
      return await prisma.organization.findUnique({
        where: { domain },
        include: {
          roleTemplates: true,
          digitalTwins: {
            include: {
              roleTemplate: true,
              assignedTo: true,
              signals: true,
              certifications: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw new Error('Failed to fetch organization');
    }
  }

  /**
   * Create a new organization
   */
  static async create(data: {
    name: string;
    description?: string;
    domain: string;
  }) {
    try {
      return await prisma.organization.create({
        data,
        include: {
          roleTemplates: true,
        },
      });
    } catch (error) {
      console.error('Error creating organization:', error);
      throw new Error('Failed to create organization');
    }
  }
}

export class RoleTemplateService {
  /**
   * Get all role templates for an organization
   */
  static async getByOrganization(organizationId: string) {
    try {
      return await prisma.roleTemplate.findMany({
        where: { organizationId },
        orderBy: [
          { category: 'asc' },
          { subCategory: 'asc' },
          { title: 'asc' },
        ],
      });
    } catch (error) {
      console.error('Error fetching role templates:', error);
      throw new Error('Failed to fetch role templates');
    }
  }

  /**
   * Get role template by ID
   */
  static async getById(id: string) {
    try {
      return await prisma.roleTemplate.findUnique({
        where: { id },
        include: {
          organization: true,
        },
      });
    } catch (error) {
      console.error('Error fetching role template:', error);
      throw new Error('Failed to fetch role template');
    }
  }
}

export class DigitalTwinService {
  /**
   * Create a new digital twin
   */
  static async create(data: {
    name: string;
    description?: string;
    organizationId: string;
    roleTemplateId: string;
    assignedToDid: string;
    blockchainAddress?: string;
    blockchainNetwork?: string;
  }) {
    try {
      return await prisma.digitalTwin.create({
        data,
        include: {
          organization: true,
          roleTemplate: true,
          assignedTo: true,
          signals: true,
          certifications: true,
        },
      });
    } catch (error) {
      console.error('Error creating digital twin:', error);
      throw new Error('Failed to create digital twin');
    }
  }

  /**
   * Get digital twin by ID
   */
  static async getById(id: string) {
    try {
      return await prisma.digitalTwin.findUnique({
        where: { id },
        include: {
          organization: true,
          roleTemplate: true,
          assignedTo: true,
          signals: {
            orderBy: { createdAt: 'desc' },
          },
          certifications: {
            orderBy: { issuedAt: 'desc' },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching digital twin:', error);
      throw new Error('Failed to fetch digital twin');
    }
  }

  /**
   * Get digital twins by organization
   */
  static async getByOrganization(organizationId: string) {
    try {
      return await prisma.digitalTwin.findMany({
        where: { organizationId },
        include: {
          roleTemplate: true,
          assignedTo: true,
          signals: true,
          certifications: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching digital twins:', error);
      throw new Error('Failed to fetch digital twins');
    }
  }

  /**
   * Update digital twin
   */
  static async update(id: string, data: Partial<{
    name: string;
    description: string;
    status: string;
    level: number;
    blockchainAddress: string;
    blockchainNetwork: string;
    soulboundTokenId: string;
  }>) {
    try {
      return await prisma.digitalTwin.update({
        where: { id },
        data,
        include: {
          organization: true,
          roleTemplate: true,
          assignedTo: true,
          signals: true,
          certifications: true,
        },
      });
    } catch (error) {
      console.error('Error updating digital twin:', error);
      throw new Error('Failed to update digital twin');
    }
  }
}

export class SignalService {
  /**
   * Add a signal to a digital twin
   */
  static async create(data: {
    type: string;
    title: string;
    description?: string;
    value?: number;
    source: string;
    verified?: boolean;
    metadata?: any;
    digitalTwinId: string;
  }) {
    try {
      return await prisma.signal.create({
        data,
        include: {
          digitalTwin: true,
        },
      });
    } catch (error) {
      console.error('Error creating signal:', error);
      throw new Error('Failed to create signal');
    }
  }

  /**
   * Get signals for a digital twin
   */
  static async getByDigitalTwin(digitalTwinId: string) {
    try {
      return await prisma.signal.findMany({
        where: { digitalTwinId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw new Error('Failed to fetch signals');
    }
  }
}

export class CertificationService {
  /**
   * Add a certification to a digital twin
   */
  static async create(data: {
    name: string;
    issuer: string;
    issuedAt: Date;
    expiresAt?: Date;
    credentialUrl?: string;
    verified?: boolean;
    digitalTwinId: string;
  }) {
    try {
      return await prisma.certification.create({
        data,
        include: {
          digitalTwin: true,
        },
      });
    } catch (error) {
      console.error('Error creating certification:', error);
      throw new Error('Failed to create certification');
    }
  }

  /**
   * Get certifications for a digital twin
   */
  static async getByDigitalTwin(digitalTwinId: string) {
    try {
      return await prisma.certification.findMany({
        where: { digitalTwinId },
        orderBy: { issuedAt: 'desc' },
      });
    } catch (error) {
      console.error('Error fetching certifications:', error);
      throw new Error('Failed to fetch certifications');
    }
  }
}

export class HumanService {
  /**
   * Create or update a human
   */
  static async upsert(data: {
    name: string;
    email: string;
    did?: string;
  }) {
    try {
      return await prisma.human.upsert({
        where: { email: data.email },
        update: data,
        create: data,
        include: {
          digitalTwins: {
            include: {
              organization: true,
              roleTemplate: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error upserting human:', error);
      throw new Error('Failed to upsert human');
    }
  }

  /**
   * Get human by email
   */
  static async getByEmail(email: string) {
    try {
      return await prisma.human.findUnique({
        where: { email },
        include: {
          digitalTwins: {
            include: {
              organization: true,
              roleTemplate: true,
              signals: true,
              certifications: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching human:', error);
      throw new Error('Failed to fetch human');
    }
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Disconnect from the database
 */
export async function disconnect() {
  await prisma.$disconnect();
}

/**
 * Health check for database connection
 */
export async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
} 