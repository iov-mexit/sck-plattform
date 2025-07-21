import { NextRequest, NextResponse } from 'next/server';
import { signalCollection } from '@/lib/signal-collection';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const digitalTwinId = searchParams.get('digitalTwinId');

    if (!digitalTwinId) {
      return NextResponse.json(
        {
          success: false,
          error: 'digitalTwinId is required'
        },
        { status: 400 }
      );
    }

    // Get basic statistics for the digital twin
    const totalSignals = await signalCollection.getSignalCount(digitalTwinId);
    const recentSignals = await signalCollection.getRecentSignals(digitalTwinId, 5);

    const statistics = {
      total: totalSignals,
      recent: recentSignals.length,
      recentSignals: recentSignals.map((signal: Record<string, unknown>) => ({
        id: signal.id,
        type: signal.type,
        title: signal.title,
        createdAt: signal.createdAt
      }))
    };

    return NextResponse.json({
      success: true,
      data: statistics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching signal statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch signal statistics',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 