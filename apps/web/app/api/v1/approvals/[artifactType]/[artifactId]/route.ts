import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/database';

// GET /api/v1/approvals/:artifactType/:artifactId
export async function GET(request: NextRequest, ctx: { params: Promise<{ artifactType: string; artifactId: string }> }) {
  try {
    const { artifactType, artifactId } = await ctx.params;
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || undefined;

    if (!artifactType || !artifactId) {
      return NextResponse.json({ success: false, error: 'INVALID_PARAMS' }, { status: 400 });
    }

    // Cast artifactType to the proper enum type
    const artifactTypeEnum = artifactType as 'RoleAgent' | 'MCP';

    const approvals = await prisma.approval.findMany({
      where: {
        artifactType: artifactTypeEnum,
        artifactId,
        ...(organizationId ? { organizationId } : {}),
      },
      orderBy: { createdAt: 'asc' },
    });

    // Derive status based on decisions and facets
    const requiredFacets = new Set<string>();
    const approvedFacets = new Set<string>();
    const rejected = approvals.some((a: any) => a.decision === 'reject');

    // Optional: fetch LoA policy to determine required facets/min reviewers if org provided
    if (organizationId) {
      const policy = await prisma.loaPolicy.findFirst({
        where: { organizationId, artifactType: artifactTypeEnum },
        orderBy: { createdAt: 'desc' },
      });
      if (policy?.requiredFacets) {
        for (const f of policy.requiredFacets) requiredFacets.add(f);
      }
      const approvalsByFacet = new Map<string, number>();
      approvals.forEach((a: any) => {
        if (a.decision === 'approve') {
          approvedFacets.add(a.facet);
          approvalsByFacet.set(a.facet, (approvalsByFacet.get(a.facet) || 0) + 1);
        }
      });

      const minReviewers = policy?.minReviewers || 1;
      const facetsSatisfied = [...(requiredFacets.size ? requiredFacets : approvedFacets)].every(f => (approvals.filter((a: any) => a.facet === f && a.decision === 'approve').length) >= minReviewers);
      const isApproved = !rejected && facetsSatisfied && approvals.length > 0;

      return NextResponse.json({ success: true, data: { approvals, status: isApproved ? 'approved' : 'pending', requiredFacets: [...requiredFacets], approvedFacets: [...approvedFacets], minReviewers } });
    }

    // Fallback without org policy: approved if at least one approval and no rejections
    const isApproved = !rejected && approvals.length > 0;
    return NextResponse.json({ success: true, data: { approvals, status: isApproved ? 'approved' : 'pending' } });
  } catch (error) {
    console.error('GET /approvals/:artifactType/:artifactId error', error);
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}


