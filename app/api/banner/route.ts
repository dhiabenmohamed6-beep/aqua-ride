import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_BANNER, type BannerSettings } from '@/lib/banner'

let banner = { ...DEFAULT_BANNER }

export async function GET() {
  return NextResponse.json(banner)
}

export async function PUT(req: NextRequest) {
  banner = await req.json()
  return NextResponse.json(banner)
}