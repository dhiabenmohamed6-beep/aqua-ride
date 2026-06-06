import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_BANNER } from '@/lib/banner'

const BANNER_FILE = process.env.VERCEL ? '/tmp/banner.json' : './data/banner.json'

function readBanner() {
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = process.env.VERCEL ? '/tmp/banner.json' : path.join(process.cwd(), 'data', 'banner.json')
    if (!fs.existsSync(filePath)) return null
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch { return null }
}

function writeBanner(banner: typeof DEFAULT_BANNER) {
  const fs = require('fs')
  const path = require('path')
  const filePath = process.env.VERCEL ? '/tmp/banner.json' : path.join(process.cwd(), 'data', 'banner.json')
  const dir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(banner, null, 2))
}

export async function GET() {
  const data = readBanner()
  if (!data) {
    writeBanner(DEFAULT_BANNER)
    return NextResponse.json(DEFAULT_BANNER)
  }
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const banner = await req.json()
  writeBanner(banner)
  return NextResponse.json(banner)
}