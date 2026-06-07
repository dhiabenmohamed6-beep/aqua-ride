import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_BANNER, type BannerSettings } from '@/lib/banner'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_FILE = join(process.cwd(), 'data', 'banner.json')

function loadBanner(): BannerSettings {
  if (!existsSync(DATA_FILE)) return { ...DEFAULT_BANNER }
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  } catch { return { ...DEFAULT_BANNER } }
}

function saveBanner(data: BannerSettings) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true })
  }
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

let banner = loadBanner()

export async function GET() {
  return NextResponse.json(banner)
}

export async function PUT(req: NextRequest) {
  banner = await req.json()
  saveBanner(banner)
  return NextResponse.json(banner)
}