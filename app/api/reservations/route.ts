import { NextRequest, NextResponse } from 'next/server'
import { generateId, type Reservation } from '@/lib/reservations'

const DATA_FILE = process.env.VERCEL ? '/tmp/reservations.json' : './data/reservations.json'

function readReservations(): Reservation[] {
  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = process.env.VERCEL ? '/tmp/reservations.json' : path.join(process.cwd(), 'data', 'reservations.json')
    if (!fs.existsSync(filePath)) return []
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch { return [] }
}

function writeReservations(reservations: Reservation[]) {
  const fs = require('fs')
  const path = require('path')
  const filePath = process.env.VERCEL ? '/tmp/reservations.json' : path.join(process.cwd(), 'data', 'reservations.json')
  const dir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(reservations, null, 2))
}

export async function GET() {
  const reservations = readReservations().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json(reservations)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const reservation: Reservation = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...body
  }
  
  const all = readReservations()
  all.unshift(reservation)
  writeReservations(all)
  
  return NextResponse.json(reservation)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body
  
  const all = readReservations().map(r => r.id === id ? { ...r, ...updates } : r)
  writeReservations(all)
  
  const updated = all.find(r => r.id === id)
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  
  const all = readReservations().filter(r => r.id !== id)
  writeReservations(all)
  
  return NextResponse.json({ success: true })
}