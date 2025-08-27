import { NextRequest, NextResponse } from "next/server";
import { retrieveHybrid } from "@/lib/rag/retrieval";

export async function POST(req: NextRequest) {
  try {
    console.log("🔍 Advanced RAG API called");
    
    const body = await req.json();
    const { query, organizationId } = body;
    
    console.log("📤 Request data:", { query, organizationId });
    
    console.log("🚀 Calling retrieveHybrid...");
    const result = await retrieveHybrid({ query, organizationId });
    
    console.log("✅ retrieveHybrid completed:", {
      usedMode: result.usedMode,
      snippetsCount: result.snippets?.length || 0,
      citationsCount: result.citations?.length || 0
    });
    
    return NextResponse.json(result);
  } catch (e: any) {
    console.error("💥 Advanced RAG API error:", e);
    console.error("💥 Error details:", {
      name: e.name,
      message: e.message,
      stack: e.stack
    });
    
    return NextResponse.json({ 
      error: e.message,
      details: process.env.NODE_ENV === 'development' ? e.stack : undefined
    }, { status: 500 });
  }
}

