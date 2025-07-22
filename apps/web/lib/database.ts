import { PrismaClient } from '@prisma/client';

// Create a global Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database service class
export class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = prisma;
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Test database connection
  async testConnection() {
    try {
      const result = await this.prisma.$queryRaw`SELECT 1 as test`;
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  // Get all organizations
  async getOrganizations() {
    try {
      return await this.prisma.organization.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }
  }

  // Get all role templates
  async getRoleTemplates() {
    try {
      return await this.prisma.roleTemplate.findMany({
        where: { selectable: true },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching role templates:', error);
      return [];
    }
  }

  // Get digital twins
  async getDigitalTwins() {
    try {
      return await this.prisma.digitalTwin.findMany({
        include: {
          organization: true,
          roleTemplate: true,
          signals: true,
          certifications: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching digital twins:', error);
      return [];
    }
  }

  // Create a new organization
  async createOrganization(data: {
    name: string;
    description?: string;
    domain: string;
  }) {
    try {
      return await this.prisma.organization.create({
        data: {
          name: data.name,
          description: data.description,
          domain: data.domain,
        }
      });
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  }

  // Create a new role template
  async createRoleTemplate(data: {
    title: string;
    focus: string;
    category: string;
    responsibilities: unknown;
    securityContributions: unknown;
    organizationId?: string;
  }) {
    try {
      return await this.prisma.roleTemplate.create({
        data: {
          title: data.title,
          focus: data.focus,
          category: data.category,
          responsibilities: data.responsibilities as import('@prisma/client').Prisma.InputJsonValue,
          securityContributions: data.securityContributions as import('@prisma/client').Prisma.InputJsonValue,
          organizationId: data.organizationId,
        }
      });
    } catch (error) {
      console.error('Error creating role template:', error);
      throw error;
    }
  }

  // Create a new digital twin
  async createDigitalTwin(data: {
    name: string;
    description?: string;
    organizationId: string;
    roleTemplateId: string;
    assignedToDid: string;
    blockchainAddress?: string;
    blockchainNetwork?: string;
  }) {
    try {
      return await this.prisma.digitalTwin.create({
        data: {
          name: data.name,
          description: data.description,
          organizationId: data.organizationId,
          roleTemplateId: data.roleTemplateId,
          assignedToDid: data.assignedToDid,
          blockchainAddress: data.blockchainAddress,
          blockchainNetwork: data.blockchainNetwork,
        }
      });
    } catch (error) {
      console.error('Error creating digital twin:', error);
      throw error;
    }
  }

  // Add a signal to a digital twin
  async addSignal(data: {
    type: string;
    title: string;
    description?: string;
    value?: number;
    source: string;
    verified?: boolean;
    metadata?: unknown;
    digitalTwinId: string;
  }) {
    try {
      return await this.prisma.signal.create({
        data: {
          type: data.type,
          title: data.title,
          description: data.description,
          value: data.value,
          source: data.source,
          verified: data.verified || false,
          metadata: data.metadata as import('@prisma/client').Prisma.InputJsonValue,
          digitalTwinId: data.digitalTwinId,
        }
      });
    } catch (error) {
      console.error('Error adding signal:', error);
      throw error;
    }
  }

  // Disconnect from database
  async disconnect() {
    await this.prisma.$disconnect();
  }
}

// Export a singleton instance
export const db = DatabaseService.getInstance(); 