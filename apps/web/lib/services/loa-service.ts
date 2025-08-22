import { PrismaClient, ArtifactType, LoALevel, ApprovalFacet, ApprovalDecision } from '@prisma/client';

// Create a new Prisma instance for this service
const prisma = new PrismaClient();

export interface LoAPolicy {
  id: string;
  organizationId: string;
  artifactType: ArtifactType;
  level: LoALevel;
  minReviewers: number;
  requiredFacets: ApprovalFacet[];
  externalRequired: boolean;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalTask {
  id: string;
  artifactId: string;
  artifactType: ArtifactType;
  loaLevel: LoALevel;
  facet: ApprovalFacet;
  reviewerId?: string;
  decision: ApprovalDecision;
  comment?: string | null;
  reviewedAt?: Date | null;
  createdAt: Date;
}

export interface ApprovalResult {
  status: 'pending' | 'approved' | 'rejected';
  requiredFacets: ApprovalFacet[];
  completedFacets: ApprovalFacet[];
  missingFacets: ApprovalFacet[];
  totalReviewers: number;
  requiredReviewers: number;
}

/**
 * Generic approval service for handling LoA across all artifact types
 */
export class LoAService {
  /**
   * Submit an artifact for LoA approval
   */
  static async submitForApproval(
    artifactType: ArtifactType,
    artifactId: string,
    loaLevel: LoALevel,
    organizationId: string
  ): Promise<{ status: string; requiredFacets: ApprovalFacet[] }> {
    try {
      // 1. Load LoA policy
      const policy = await prisma.loaPolicy.findFirst({
        where: {
          organizationId,
          artifactType,
          level: loaLevel,
          isActive: true
        }
      });

      if (!policy) {
        throw new Error(`No LoA policy found for ${artifactType} at level ${loaLevel}`);
      }

      // 2. Generate approval tasks
      const facets = policy.requiredFacets;
      const approvalTasks = [];

      for (const facet of facets) {
        const approval = await prisma.approval.create({
          data: {
            organizationId,
            artifactId,
            artifactType,
            loaLevel,
            reviewerId: '', // Will be assigned when reviewer accepts
            facet,
            decision: 'pending',
          }
        });
        approvalTasks.push(approval);
      }

      // 3. Update artifact approval status
      await this.updateArtifactApprovalStatus(artifactType, artifactId, 'pending');

      // 4. Register audit log
      await prisma.auditLog.create({
        data: {
          action: 'LOA_TASKS_CREATED',
          entity: artifactType,
          entityId: artifactId,
          organizationId,
          metadata: {
            loaLevel,
            facets,
            policyId: policy.id,
            minReviewers: policy.minReviewers
          }
        }
      });

      return {
        status: 'pending',
        requiredFacets: facets
      };
    } catch (error) {
      console.error('Error submitting artifact for approval:', error);
      throw error;
    }
  }

  /**
   * Submit a reviewer decision for a specific facet
   */
  static async submitReview(
    approvalId: string,
    reviewerId: string,
    decision: ApprovalDecision,
    comment?: string
  ): Promise<ApprovalResult> {
    try {
      // Update the approval
      const approval = await prisma.approval.update({
        where: { id: approvalId },
        data: {
          reviewerId,
          decision,
          comment,
          reviewedAt: new Date()
        }
      });

      // Check if all approvals are complete
      const result = await this.resolveApprovals(approval.artifactType, approval.artifactId);

      // Log the review
      await prisma.auditLog.create({
        data: {
          action: 'LOA_REVIEW_SUBMITTED',
          entity: approval.artifactType,
          entityId: approval.artifactId,
          userId: reviewerId,
          metadata: {
            approvalId,
            facet: approval.facet,
            decision,
            comment
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  /**
   * Resolve all approvals for an artifact and determine final status
   */
  static async resolveApprovals(
    artifactType: ArtifactType,
    artifactId: string
  ): Promise<ApprovalResult> {
    try {
      const approvals = await prisma.approval.findMany({
        where: { artifactId, artifactType }
      });

      if (approvals.length === 0) {
        throw new Error('No approvals found for artifact');
      }

      // Get the LoA policy
      const firstApproval = approvals[0];
      const policy = await prisma.loaPolicy.findFirst({
        where: {
          artifactType,
          level: firstApproval.loaLevel
        }
      });

      if (!policy) {
        throw new Error('No LoA policy found');
      }

      // Calculate approval status
      const approvedFacets = approvals
        .filter(a => a.decision === 'approve')
        .map(a => a.facet);
      
      const rejectedFacets = approvals
        .filter(a => a.decision === 'reject')
        .map(a => a.facet);

      const pendingFacets = approvals
        .filter(a => a.decision === 'pending')
        .map(a => a.facet);

      // Check if requirements are met
      const allRequiredFacetsApproved = policy.requiredFacets.every(f => 
        approvedFacets.includes(f)
      );
      
      const hasRejections = rejectedFacets.length > 0;
      const meetsThreshold = allRequiredFacetsApproved && !hasRejections;

      // Determine final status
      let finalStatus: 'pending' | 'approved' | 'rejected';
      if (hasRejections) {
        finalStatus = 'rejected';
      } else if (meetsThreshold) {
        finalStatus = 'approved';
      } else {
        finalStatus = 'pending';
      }

      // Update artifact status
      await this.updateArtifactApprovalStatus(artifactType, artifactId, finalStatus);

      // Log the resolution
      await prisma.auditLog.create({
        data: {
          action: 'LOA_RESOLVED',
          entity: artifactType,
          entityId: artifactId,
          metadata: {
            status: finalStatus,
            approvedFacets,
            rejectedFacets,
            pendingFacets,
            policyId: policy.id
          }
        }
      });

      return {
        status: finalStatus,
        requiredFacets: policy.requiredFacets,
        completedFacets: approvedFacets,
        missingFacets: pendingFacets,
        totalReviewers: approvals.length,
        requiredReviewers: policy.minReviewers
      };
    } catch (error) {
      console.error('Error resolving approvals:', error);
      throw error;
    }
  }

  /**
   * Get all pending approval tasks for an organization
   */
  static async getPendingApprovals(organizationId: string): Promise<ApprovalTask[]> {
    try {
      const approvals = await prisma.approval.findMany({
        where: {
          organizationId,
          decision: 'pending'
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      return approvals.map(approval => ({
        id: approval.id,
        artifactId: approval.artifactId,
        artifactType: approval.artifactType,
        loaLevel: approval.loaLevel,
        facet: approval.facet,
        reviewerId: approval.reviewerId || undefined,
        decision: approval.decision,
        comment: approval.comment || undefined
      }));
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  }

  /**
   * Get LoA policies for an organization
   */
  static async getLoAPolicies(organizationId: string): Promise<LoAPolicy[]> {
    try {
      const policies = await prisma.loaPolicy.findMany({
        where: {
          organizationId,
          isActive: true
        },
        orderBy: [
          { artifactType: 'asc' },
          { level: 'asc' }
        ]
      });

      return policies;
    } catch (error) {
      console.error('Error fetching LoA policies:', error);
      throw error;
    }
  }

  /**
   * Create or update an LoA policy
   */
  static async upsertLoAPolicy(
    organizationId: string,
    artifactType: ArtifactType,
    level: LoALevel,
    data: {
      minReviewers: number;
      requiredFacets: ApprovalFacet[];
      externalRequired?: boolean;
      description?: string;
      isActive?: boolean;
    }
  ): Promise<LoAPolicy> {
    try {
      const policy = await prisma.loaPolicy.upsert({
        where: {
          organizationId_artifactType_level: {
            organizationId,
            artifactType,
            level
          }
        },
        update: {
          minReviewers: data.minReviewers,
          requiredFacets: data.requiredFacets,
          externalRequired: data.externalRequired ?? false,
          description: data.description,
          isActive: data.isActive ?? true,
          updatedAt: new Date()
        },
        create: {
          organizationId,
          artifactType,
          level,
          minReviewers: data.minReviewers,
          requiredFacets: data.requiredFacets,
          externalRequired: data.externalRequired ?? false,
          description: data.description,
          isActive: data.isActive ?? true
        }
      });

      // Log policy creation/update
      await prisma.auditLog.create({
        data: {
          action: 'LOA_POLICY_UPDATED',
          entity: 'LoAPolicy',
          entityId: policy.id,
          organizationId,
          metadata: {
            artifactType,
            level,
            minReviewers: data.minReviewers,
            requiredFacets: data.requiredFacets
          }
        }
      });

      return policy;
    } catch (error) {
      console.error('Error upserting LoA policy:', error);
      throw error;
    }
  }

  /**
   * Helper method to update artifact approval status
   */
  private static async updateArtifactApprovalStatus(
    artifactType: ArtifactType,
    artifactId: string,
    status: string
  ): Promise<void> {
    try {
      switch (artifactType) {
        case 'RoleAgent':
          await prisma.roleAgent.update({
            where: { id: artifactId },
            data: { approvalStatus: status as ApprovalDecision }
          });
          break;
        case 'MCP':
          await prisma.mcpPolicy.update({
            where: { id: artifactId },
            data: { approvalStatus: status as ApprovalDecision }
          });
          break;
        // Add other artifact types as needed
        default:
          console.warn(`Unknown artifact type: ${artifactType}`);
      }
    } catch (error) {
      console.error('Error updating artifact approval status:', error);
      throw error;
    }
  }
}

export default LoAService;
