import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signalCollection, SignalSchema } from '@/lib/signal-collection';

const ApiKeyHeaderSchema = z.object({
  key: z.string().min(10),
});

function getApiKeyFromRequest(request: NextRequest): string | null {
  const headerKey = request.headers.get('x-api-key');
  if (headerKey) return headerKey;
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('api_key');
  return queryKey;
}

function isAuthorized(key: string | null): boolean {
  const expected = process.env.SIGNALS_API_KEY || process.env.API_KEY || '';
  if (!expected) return true; // If no key configured, allow (dev)
  if (!key) return false;
  try {
    ApiKeyHeaderSchema.parse({ key });
  } catch {
    return false;
  }
  return key === expected;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = getApiKeyFromRequest(request);
    if (!isAuthorized(apiKey)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Normalize and validate using shared schema
    const normalized = { ...body };
    if (normalized.digitalTwinId && !normalized.roleAgentId) {
      normalized.roleAgentId = normalized.digitalTwinId;
    }

    // This will throw on invalid
    const validated = SignalSchema.parse(normalized);

    const created = await signalCollection.createSignal(validated);

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid signal data', details: error.issues },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : 'Unknown error';
    const code = message.includes('Digital twin not found') ? 404 : 500;
    return NextResponse.json({ success: false, error: message }, { status: code });
  }
}

const ListQuerySchema = z.object({
  roleAgentId: z.string(),
  type: z.enum(['certification', 'activity', 'achievement', 'security_incident', 'training', 'audit', 'compliance', 'collaboration']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = ListQuerySchema.safeParse({
      roleAgentId: searchParams.get('roleAgentId'),
      type: searchParams.get('type') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      offset: searchParams.get('offset') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid query params', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { roleAgentId, type, limit, offset } = parsed.data;

    const data = await signalCollection.getSignalsByRoleAgent(roleAgentId, { type, limit, offset }) as any[];

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


