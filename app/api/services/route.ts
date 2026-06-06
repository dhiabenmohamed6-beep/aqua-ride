import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_SERVICES } from '@/lib/services'

// Store services in memory (persists within serverless instance)
let services = [...DEFAULT_SERVICES]

export async function GET() {
  return NextResponse.json(services)
}

export async function PUT(req: NextRequest) {
  services = await req.json()
  return NextResponse.json(services)
}