import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_SERVICES, type Service } from '@/lib/services'

// Store in memory (resets on cold start - for production use Supabase)
let services = [...DEFAULT_SERVICES]

export async function GET() {
  return NextResponse.json(services)
}

export async function PUT(req: NextRequest) {
  services = await req.json()
  return NextResponse.json(services)
}