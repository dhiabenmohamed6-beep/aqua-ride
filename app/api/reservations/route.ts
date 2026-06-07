import { NextRequest, NextResponse } from 'next/server'
import { generateId, type Reservation } from '@/lib/reservations'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_FILE = join(process.cwd(), 'data', 'reservations.json')

function loadReservations(): Reservation[] {
  if (!existsSync(DATA_FILE)) return []
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  } catch { return [] }
}

function saveReservations(data: Reservation[]) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true })
  }
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

let reservations: Reservation[] = loadReservations()

export async function GET() {
  const sorted = [...reservations].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json(sorted)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const reservation: Reservation = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...body
  }
  
  reservations.unshift(reservation)
  saveReservations(reservations)
  
  return NextResponse.json(reservation)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body
  
  reservations = reservations.map(r => r.id === id ? { ...r, ...updates } : r)
  saveReservations(reservations)
  
  const updated = reservations.find(r => r.id === id)
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  
  reservations = reservations.filter(r => r.id !== id)
  saveReservations(reservations)
  
  return NextResponse.json({ success: true })
}