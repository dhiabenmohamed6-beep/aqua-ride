import { NextRequest, NextResponse } from 'next/server'
import { generateId, type Reservation } from '@/lib/reservations'
import { getStoredReservations, saveStoredReservations } from '@/lib/data-store'

export async function GET() {
  const reservations = await getStoredReservations()
  const sorted = [...reservations].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json(sorted)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const reservations = await getStoredReservations()
  const reservation: Reservation = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...body
  }
  
  reservations.unshift(reservation)
  await saveStoredReservations(reservations)
  return NextResponse.json(reservation)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body
  const reservations = await getStoredReservations()
  
  const updated = reservations.map(r => r.id === id ? { ...r, ...updates } : r)
  await saveStoredReservations(updated)
  const result = updated.find(r => r.id === id)
  return NextResponse.json(result)
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  
  const reservations = await getStoredReservations()
  const filtered = reservations.filter(r => r.id !== id)
  await saveStoredReservations(filtered)
  return NextResponse.json({ success: true })
}