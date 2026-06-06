import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_SERVICES } from '@/lib/services'

const DATA_FILE = process.env.VERCEL ? '/tmp/services.json' : './data/services.json'

function readServices() {
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = process.env.VERCEL ? '/tmp/services.json' : path.join(process.cwd(), 'data', 'services.json')
    if (!fs.existsSync(filePath)) return null
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch { return null }
}

function writeServices(services: typeof DEFAULT_SERVICES) {
  const fs = require('fs')
  const path = require('path')
  const filePath = process.env.VERCEL ? '/tmp/services.json' : path.join(process.cwd(), 'data', 'services.json')
  const dir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(services, null, 2))
}

export async function GET() {
  const data = readServices()
  if (!data) {
    writeServices(DEFAULT_SERVICES)
    return NextResponse.json(DEFAULT_SERVICES)
  }
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const services = await req.json()
  writeServices(services)
  return NextResponse.json(services)
}