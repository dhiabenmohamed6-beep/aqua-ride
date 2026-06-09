import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_BANNER, type BannerSettings } from '@/lib/banner'
import { getStoredBanner, saveStoredBanner } from '@/lib/data-store'

export async function GET() {
  const banner = await getStoredBanner()
  return NextResponse.json(banner ?? DEFAULT_BANNER)
}

export async function PUT(req: NextRequest) {
  const banner: BannerSettings = await req.json()
  await saveStoredBanner(banner)
  return NextResponse.json(banner)
}