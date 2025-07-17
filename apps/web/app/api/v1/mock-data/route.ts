import { NextResponse } from 'next/server';
import { MOCK_CUSTOMER } from '@/lib/mock-customer';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        organization: MOCK_CUSTOMER.organization,
        roleTemplates: MOCK_CUSTOMER.roleTemplates,
        sampleDigitalTwins: MOCK_CUSTOMER.sampleDigitalTwins,
      },
    });
  } catch (error) {
    console.error('Error fetching mock data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch mock data',
      },
      { status: 500 }
    );
  }
} 