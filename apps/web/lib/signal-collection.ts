import prisma from './database';
import { z } from 'zod';

// =============================================================================
// MINIMAL SIGNAL COLLECTION SYSTEM (V1)
// =============================================================================

// Minimal signal schema for V1
export const SignalSchema = z.object({
  type: z.enum(['certification', 'activity']),
  title: z.string(),
  value: z.number().optional(),
  source: z.enum(['securecodewarrior', 'certification_provider', 'manual']),
  url: z.string().optional(),
  metadata: z.unknown().optional(), // dump raw API data
  digitalTwinId: z.string()
});

export type Signal = z.infer<typeof SignalSchema>;

// =============================================================================
// MINIMAL SIGNAL COLLECTION SERVICE
// =============================================================================

export class SignalCollectionService {
  private static instance: SignalCollectionService;

  private constructor() { }

  public static getInstance(): SignalCollectionService {
    if (!SignalCollectionService.instance) {
      SignalCollectionService.instance = new SignalCollectionService();
    }
    return SignalCollectionService.instance;
  }

  // Create a new signal
  async createSignal(data: Signal): Promise<unknown> {
    try {
      // Validate the signal data
      const validatedData = SignalSchema.parse(data);

      // Check if role agent exists
      const roleAgent = await prisma.role_agents.findUnique({
        where: { id: validatedData.digitalTwinId },
        include: { organizations: true, role_templates: true }
      });

      if (!roleAgent) {
        throw new Error(`Role agent not found: ${validatedData.digitalTwinId}`);
      }

      // Create the signal
      const signal = await prisma.signals.create({
        data: {
          type: validatedData.type,
          title: validatedData.title,
          value: validatedData.value,
          source: validatedData.source,
          url: validatedData.url,
          metadata: validatedData.metadata as import('@prisma/client').Prisma.InputJsonValue,
          roleAgentId: validatedData.digitalTwinId,
        },
        include: {
          role_agents: {
            include: {
              organizations: true,
              role_templates: true
            }
          }
        }
      });

      return signal;
    } catch (error: unknown) {
      console.error('Error creating signal:', error);
      throw error;
    }
  }

  // Get signals for a role agent
  async getSignalsByRoleAgent(roleAgentId: string, options?: {
    type?: 'certification' | 'activity';
    limit?: number;
    offset?: number;
  }): Promise<unknown[]> {
    try {
      const where: Record<string, unknown> = { roleAgentId };

      if (options?.type) {
        where.type = options.type;
      }

      const signals = await prisma.signals.findMany({
        where,
        include: {
          role_agents: {
            include: {
              organizations: true,
              role_templates: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0
      });

      return signals;
    } catch (error: unknown) {
      console.error('Error fetching signals:', error);
      throw error;
    }
  }

  // Get signal count for a role agent
  async getSignalCount(roleAgentId: string): Promise<number> {
    try {
      return await prisma.signals.count({
        where: { roleAgentId }
      });
    } catch (error: unknown) {
      console.error('Error counting signals:', error);
      throw error;
    }
  }

  // Get recent signals for a role agent
  async getRecentSignals(roleAgentId: string, limit: number = 5): Promise<unknown[]> {
    try {
      return await prisma.signals.findMany({
        where: { roleAgentId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          role_agents: {
            include: {
              organizations: true,
              role_templates: true
            }
          }
        }
      });
    } catch (error: unknown) {
      console.error('Error fetching recent signals:', error);
      throw error;
    }
  }

  // Bulk import signals (for external integrations)
  async bulkImportSignals(signals: Signal[]): Promise<{
    success: number;
    failed: number;
    errors: Array<{ signal: Signal; message: string }>;
  }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ signal: Signal; message: string }>
    };

    for (const signalData of signals) {
      try {
        await this.createSignal(signalData);
        results.success++;
      } catch (error: unknown) {
        results.failed++;
        results.errors.push({
          signal: signalData,
          message: (error as Error).message
        });
      }
    }

    return results;
  }
}

// Export singleton instance
export const signalCollection = SignalCollectionService.getInstance(); 