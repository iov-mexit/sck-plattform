import { NextRequest, NextResponse } from 'next/server';
import { signalCollection, SignalSchema } from '@/lib/signal-collection';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const digitalTwinId = searchParams.get('digitalTwinId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!digitalTwinId) {
      return NextResponse.json(
        {
          success: false,
          error: 'digitalTwinId is required'
        },
        { status: 400 }
      );
    }

    // Get signals for the digital twin
    const signals = await signalCollection.getSignalsByDigitalTwin(digitalTwinId, {
      type: type as 'certification' | 'activity' | undefined,
      limit,
      offset
    });

    return NextResponse.json({
      success: true,
      data: signals,
      count: signals.length,
      pagination: {
        limit,
        offset,
        hasMore: signals.length === limit
      }
    });
  } catch (error: any) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch signals',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the signal data
    const validatedData = SignalSchema.parse(body);

    // Create the signal
    const signal = await signalCollection.createSignal(validatedData);

    return NextResponse.json({
      success: true,
      data: signal,
      message: 'Signal created successfully'
    });
  } catch (error: any) {
    console.error('Error creating signal:', error);

    // Handle validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create signal',
        details: error.message
      },
      { status: 500 }
    );
  }
} 