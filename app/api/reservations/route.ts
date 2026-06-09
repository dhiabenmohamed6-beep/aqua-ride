import { NextRequest, NextResponse } from 'next/server'
import { generateId, type Reservation } from '@/lib/reservations'

// In-memory storage (resets on Vercel cold start)
let reservations: Reservation[] = []

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
  return NextResponse.json(reservation)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body
  reservations = reservations.map(r => r.id === id ? { ...r, ...updates } : r)
  const updated = reservations.find(r => r.id === id)
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  
  reservations = reservations.filter(r => r.id !== id)
  return NextResponse.json({ success: true })
}