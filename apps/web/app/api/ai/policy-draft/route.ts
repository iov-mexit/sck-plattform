import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqftrdxexmsdvhbbyjff.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZnRyZHhleG1zZHZoYmJ5amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTgwNzUsImV4cCI6MjA3MTQzNDA3NX0.-AMvB0s5UQrAM9d6GKwxPoKJymcCSlymLUGhirTeEWs';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { framework, reference, source, highlights, query } = body;

    if (!framework || !reference) {
      return NextResponse.json({
        error: "Framework and reference are required"
      }, { status: 400 });
    }

    console.log(`📝 Policy draft request:`, {
      framework,
      reference: reference.substring(0, 100) + '...',
      source: source || 'Unknown'
    });

    // Create policy draft record
    const { data, error } = await supabase
      .from('policy_drafts')
      .insert([{
        framework,
        reference: reference.substring(0, 1000), // Limit length
        source: source || 'RAG Search',
        highlights: highlights || reference.substring(0, 200),
        query: query || '',
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Failed to store policy draft:', error);
      return NextResponse.json({
        error: "Failed to store policy draft",
        details: error.message
      }, { status: 500 });
    }

    console.log(`✅ Policy draft stored successfully:`, data[0]?.id);

    return NextResponse.json({
      message: "Policy draft stored for approval",
      draftId: data[0]?.id,
      status: 'pending',
      framework,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("💥 Policy draft API error:", error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to process policy draft request"
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get all policy drafts (for admin dashboard)
    const { data, error } = await supabase
      .from('policy_drafts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Failed to fetch policy drafts:', error);
      return NextResponse.json({
        error: "Failed to fetch policy drafts",
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      drafts: data || [],
      total: data?.length || 0
    });

  } catch (error: any) {
    console.error("💥 Policy draft GET error:", error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to fetch policy drafts"
    }, { status: 500 });
  }
}
