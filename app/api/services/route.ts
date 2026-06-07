import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_SERVICES, type Service } from '@/lib/services'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_FILE = join(process.cwd(), 'data', 'services.json')

function loadServices(): Service[] {
  if (!existsSync(DATA_FILE)) return [...DEFAULT_SERVICES]
  try {
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
    return Array.isArray(data) ? data : [...DEFAULT_SERVICES]
  } catch { return [...DEFAULT_SERVICES] }
}

function saveServices(data: Service[]) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true })
  }
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

let services = loadServices()

export async function GET() {
  return NextResponse.json(services)
}

export async function PUT(req: NextRequest) {
  services = await req.json()
  saveServices(services)
  return NextResponse.json(services)
}