import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_BANNER } from '@/lib/banner'

// Store banner in memory (persists within serverless instance)
let banner = { ...DEFAULT_BANNER, id: 1 }

export async function GET() {
  return NextResponse.json(banner)
}

export async function PUT(req: NextRequest) {
  banner = await req.json()
  return NextResponse.json(banner)
}