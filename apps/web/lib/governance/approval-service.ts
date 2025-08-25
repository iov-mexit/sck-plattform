import prisma from '../database';

export interface ApprovalRequestData {
  artifactId: string;
  artifactType: string;
  loaLevel: number;
  organizationId?: string;
  requestorId?: string;
  requestorType?: 'USER' | 'SYSTEM' | 'AI_AGENT';
  requestReason?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate?: Date;
  reviewers?: any[];
  metadata?: any;
}

export interface LoAPolicy {
  level: number;
  minReviewers: number;
  requiredFacets: string[];
  externalRequired: boolean;
  description?: string;
}

/**
 * Unified approval service for all artifact types
 * Integrates with existing LoA policies and blockchain audit
 */
export class ApprovalService {

  /**
   * Create an approval request for any artifact type
   */
  static async createApprovalRequest(data: ApprovalRequestData) {
    try {
      // 1. Validate LoA level
      if (data.loaLevel < 1 || data.loaLevel > 5) {
        throw new Error(`Invalid LoA level: ${data.loaLevel}. Must be 1-5.`);
      }

      // 2. Check if LoA policy exists for this organization and artifact type
      if (data.organizationId) {
        const loaPolicy = await prisma.loaPolicy.findFirst({
          where: {
            organizationId: data.organizationId,
            artifactType: data.artifactType as any, // Cast to existing enum
            level: `L${data.loaLevel}` as any, // Cast to existing enum
            isActive: true
          }
        });

        if (loaPolicy) {
          // Use existing LoA policy requirements
          data.metadata = {
            ...data.metadata,
            loaPolicyId: loaPolicy.id,
            minReviewers: loaPolicy.minReviewers,
            requiredFacets: loaPolicy.requiredFacets,
            externalRequired: loaPolicy.externalRequired
          };
        }
      }

      // 3. Create the approval request
      const approvalRequest = await prisma.approvalRequest.create({
        data: {
          artifactId: data.artifactId,
          artifactType: data.artifactType,
          loaLevel: data.loaLevel,
          organizationId: data.organizationId,
          requestorId: data.requestorId,
          requestorType: data.requestorType || 'SYSTEM',
          requestReason: data.requestReason,
          priority: data.priority || 'MEDIUM',
          dueDate: data.dueDate,
          reviewers: data.reviewers || [],
          metadata: data.metadata || {},
          status: 'PENDING'
        },
        include: {
          organization: {
            select: { name: true, domain: true }
          }
        }
      });

      // 4. Create trust ledger entry
      await prisma.trust_ledger.create({
        data: {
          eventType: 'APPROVAL_REQUEST_CREATED',
          payloadHash: `approval-${approvalRequest.id}-${Date.now()}`,
          payload: {
            approvalRequestId: approvalRequest.id,
            artifactType: data.artifactType,
            artifactId: data.artifactId,
            loaLevel: data.loaLevel,
            requestorId: data.requestorId,
            priority: data.priority,
            timestamp: new Date().toISOString()
          }
        }
      });

      return approvalRequest;

    } catch (error) {
      console.error('Error creating approval request:', error);
      throw error;
    }
  }

  /**
   * Get approval requests for a specific artifact
   */
  static async getArtifactApprovals(artifactId: string, artifactType: string) {
    return await prisma.approvalRequest.findMany({
      where: {
        artifactId,
        artifactType
      },
      include: {
        votes: {
          orderBy: { createdAt: 'desc' }
        },
        blockchainTransactions: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Check if an artifact has pending approvals
   */
  static async hasPendingApprovals(artifactId: string, artifactType: string): Promise<boolean> {
    const count = await prisma.approvalRequest.count({
      where: {
        artifactId,
        artifactType,
        status: 'PENDING'
      }
    });
    return count > 0;
  }

  /**
   * Get approval statistics for an organization
   */
  static async getOrganizationApprovalStats(organizationId: string) {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.approvalRequest.count({ where: { organizationId } }),
      prisma.approvalRequest.count({ where: { organizationId, status: 'PENDING' } }),
      prisma.approvalRequest.count({ where: { organizationId, status: 'APPROVED' } }),
      prisma.approvalRequest.count({ where: { organizationId, status: 'REJECTED' } })
    ]);

    return { total, pending, approved, rejected };
  }

  /**
   * Create approval request for MCP Policy
   */
  static async createMCPPolicyApproval(
    policyId: string,
    organizationId: string,
    loaLevel: number,
    requestorId?: string
  ) {
    return await this.createApprovalRequest({
      artifactId: policyId,
      artifactType: 'MCP_POLICY',
      loaLevel,
      organizationId,
      requestorId,
      requestReason: 'MCP Policy requires LoA approval',
      priority: 'HIGH',
      metadata: {
        policyType: 'MCP',
        requiresApproval: true
      }
    });
  }

  /**
   * Create approval request for Role Agent
   */
  static async createRoleAgentApproval(
    agentId: string,
    organizationId: string,
    loaLevel: number,
    requestorId?: string
  ) {
    return await this.createApprovalRequest({
      artifactId: agentId,
      artifactType: 'ROLE_AGENT',
      loaLevel,
      organizationId,
      requestorId,
      requestReason: 'Role Agent requires LoA approval',
      priority: 'MEDIUM',
      metadata: {
        agentType: 'ROLE_AGENT',
        requiresApproval: true
      }
    });
  }

  /**
   * Create approval request for AI Recommendation
   */
  static async createAIRecommendationApproval(
    recommendationId: string,
    organizationId: string,
    loaLevel: number,
    requestorId?: string
  ) {
    return await this.createApprovalRequest({
      artifactId: recommendationId,
      artifactType: 'AI_RECOMMENDATION',
      loaLevel,
      organizationId,
      requestorId,
      requestReason: 'AI Recommendation requires LoA approval',
      priority: 'MEDIUM',
      metadata: {
        recommendationType: 'AI',
        requiresApproval: true
      }
    });
  }

  /**
   * Create approval request for ANS Entry
   */
  static async createANSEntryApproval(
    entryId: string,
    organizationId: string,
    loaLevel: number,
    requestorId?: string
  ) {
    return await this.createApprovalRequest({
      artifactId: entryId,
      artifactType: 'ANS_ENTRY',
      loaLevel,
      organizationId,
      requestorId,
      requestReason: 'ANS Entry requires LoA approval',
      priority: 'HIGH',
      metadata: {
        entryType: 'ANS',
        requiresApproval: true
      }
    });
  }
}

/**
 * Utility function to create approval requests from anywhere in the system
 */
export async function approveArtifact(
  artifactType: string,
  artifactId: string,
  loaLevel: number,
  options: Partial<ApprovalRequestData> = {}
) {
  return await ApprovalService.createApprovalRequest({
    artifactId,
    artifactType,
    loaLevel,
    ...options
  });
}
