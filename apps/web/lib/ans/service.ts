/**
 * ANS (Agent Name Service) Integration Service
 * 
 * Handles automatic registration of role agents to the ANS Registry
 * with retry logic, error handling, and status tracking.
 */

import prisma from '@/lib/database';
import { buildANSRegistrationPayload, registerToANS, getDomainConfig } from '@/lib/domains';
import { assignLevel, getQualificationLevel, getTrustLevel } from '@/lib/domains';

export interface ANSRegistrationResult {
  success: boolean;
  ansId?: string;
  error?: string;
  correlationId: string;
}

export class AnsService {
  /**
   * Register a role agent to ANS Registry
   */
  static async registerAgent(roleAgentId: string): Promise<ANSRegistrationResult> {
    const config = getDomainConfig();

    if (!config.autoRegisterANS) {
      return {
        success: false,
        error: 'ANS auto-registration disabled for this domain',
        correlationId: `disabled-${Date.now()}`
      };
    }

    try {
      // Fetch role agent with related data
      const roleAgent = await prisma.roleAgent.findUnique({
        where: { id: roleAgentId },
        include: {
          organization: true,
          roleTemplate: true,
          certifications: true
        }
      });

      if (!roleAgent) {
        return {
          success: false,
          error: 'Role agent not found',
          correlationId: `not-found-${Date.now()}`
        };
      }

      // Skip if already registered
      if (roleAgent.ansRegistrationStatus === 'SYNCED' && roleAgent.ansIdentifier) {
        return {
          success: true,
          ansId: roleAgent.ansIdentifier,
          correlationId: `already-synced-${Date.now()}`
        };
      }

      // Update status to PENDING
      await prisma.roleAgent.update({
        where: { id: roleAgentId },
        data: { ansRegistrationStatus: 'PENDING' }
      });

      // Calculate level and qualification
      const level = assignLevel(roleAgent.trustScore || 0);
      const qualificationLevel = getQualificationLevel(roleAgent.trustScore || 0, level);

      // Build ANS registration payload
      const ansPayload = buildANSRegistrationPayload({
        id: roleAgent.id,
        name: roleAgent.name,
        level,
        trustScore: roleAgent.trustScore || 0,
        assignedToDid: roleAgent.assignedToDid || `did:web:${roleAgent.organization.domain}:${roleAgent.id}`,
        organization: {
          name: roleAgent.organization.name,
          domain: roleAgent.organization.domain
        },
        roleTemplate: {
          title: roleAgent.roleTemplate.title
        },
        certifications: roleAgent.certifications.map(c => c.name)
      });

      console.log(`🔗 ANS Auto-Registration [${ansPayload.ansId}]:`, {
        roleAgentId,
        level,
        qualificationLevel,
        organization: roleAgent.organization.name,
        trustScore: roleAgent.trustScore
      });

      // Register to ANS Registry
      const ansResult = await registerToANS(ansPayload);

      if (ansResult.success) {
        // Update role agent with successful registration
        await prisma.roleAgent.update({
          where: { id: roleAgentId },
          data: {
            ansIdentifier: ansPayload.ansId,
            ansRegistrationStatus: 'SYNCED',
            ansVerificationUrl: `https://knaight.site/api/v1/verify/${ansPayload.ansId}`,
            ansRegistrationError: null
          }
        });

        console.log(`✅ ANS Registration successful [${ansResult.correlationId}]:`, ansPayload.ansId);

        return {
          success: true,
          ansId: ansPayload.ansId,
          correlationId: ansResult.correlationId
        };
      } else {
        // Update role agent with failed registration
        await prisma.roleAgent.update({
          where: { id: roleAgentId },
          data: {
            ansRegistrationStatus: 'ERROR',
            ansRegistrationError: ansResult.error || 'Unknown error'
          }
        });

        console.error(`❌ ANS Registration failed [${ansResult.correlationId}]:`, ansResult.error);

        return {
          success: false,
          error: ansResult.error,
          correlationId: ansResult.correlationId
        };
      }

    } catch (error) {
      console.error(`❌ ANS Service error for role agent ${roleAgentId}:`, error);

      // Update role agent with error status
      try {
        await prisma.roleAgent.update({
          where: { id: roleAgentId },
          data: {
            ansRegistrationStatus: 'ERROR',
            ansRegistrationError: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      } catch (updateError) {
        console.error('Failed to update role agent error status:', updateError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        correlationId: `error-${Date.now()}`
      };
    }
  }

  /**
   * Retry failed ANS registrations
   */
  static async retryFailedRegistrations(): Promise<number> {
    try {
      const failedAgents = await prisma.roleAgent.findMany({
        where: { ansRegistrationStatus: 'ERROR' },
        include: {
          organization: true,
          roleTemplate: true
        }
      });

      let retryCount = 0;
      const retryPromises = failedAgents.map(async (agent) => {
        try {
          const result = await this.registerAgent(agent.id);
          if (result.success) {
            retryCount++;
            console.log(`🔄 Retry successful for agent ${agent.id}`);
          }
        } catch (error) {
          console.error(`🔄 Retry failed for agent ${agent.id}:`, error);
        }
      });

      await Promise.allSettled(retryPromises);
      return retryCount;
    } catch (error) {
      console.error('Error retrying failed ANS registrations:', error);
      return 0;
    }
  }

  /**
   * Get ANS registration statistics
   */
  static async getRegistrationStats(): Promise<{
    total: number;
    synced: number;
    pending: number;
    error: number;
    syncRate: number;
  }> {
    try {
      const [total, synced, pending, error] = await Promise.all([
        prisma.roleAgent.count(),
        prisma.roleAgent.count({ where: { ansRegistrationStatus: 'SYNCED' } }),
        prisma.roleAgent.count({ where: { ansRegistrationStatus: 'PENDING' } }),
        prisma.roleAgent.count({ where: { ansRegistrationStatus: 'ERROR' } })
      ]);

      return {
        total,
        synced,
        pending,
        error,
        syncRate: total > 0 ? (synced / total) * 100 : 0
      };
    } catch (error) {
      console.error('Error getting ANS registration stats:', error);
      return { total: 0, synced: 0, pending: 0, error: 0, syncRate: 0 };
    }
  }
}
