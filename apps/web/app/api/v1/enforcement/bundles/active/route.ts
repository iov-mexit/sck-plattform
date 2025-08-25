import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    // Get active policy bundles for OPA
    const activeBundles = await prisma.policyBundle.findMany({
      where: { 
        status: 'ACTIVE' 
      },
      orderBy: { 
        activatedAt: 'desc' 
      },
      select: {
        id: true,
        bundleHash: true,
        storageUrl: true,
        bundleSize: true,
        version: true,
        activatedAt: true
      }
    });

    // Return in OPA bundle format
    return NextResponse.json({
      bundles: activeBundles.map(bundle => ({
        url: bundle.storageUrl,
        size: bundle.bundleSize,
        hash: bundle.bundleHash,
        version: bundle.version,
        activated: bundle.activatedAt
      }))
    });

  } catch (error) {
    console.error('Error fetching active bundles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active bundles' },
      { status: 500 }
    );
  }
}
