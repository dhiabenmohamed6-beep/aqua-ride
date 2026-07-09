import { NextRequest, NextResponse } from 'next/server'
import { generateId, type Reservation } from '@/lib/reservations'
import { getStoredReservations, upsertReservation, deleteStoredReservation } from '@/lib/data-store'
import { sendOwnerNotification, sendCustomerConfirmation, sendOwnerConfirmationCopy } from '@/lib/mail'

export async function GET() {
  const reservations = await getStoredReservations()
  return NextResponse.json(reservations)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const reservation: Reservation = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    ...body
  }
  
  await upsertReservation(reservation)

  try {
    await sendOwnerNotification(reservation)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Owner notification email failed:', msg)
  }

  return NextResponse.json(reservation)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const updated: Reservation = {
    ...body,
    serviceLabel: body.service_label ?? body.serviceLabel,
    adminNote: body.admin_note ?? body.adminNote,
    createdAt: body.created_at ?? body.createdAt,
  }

  await upsertReservation(updated)

  let emailSent = false
  let emailError = ''
  if (updated.status === 'confirmed') {
    try {
      await sendCustomerConfirmation(updated)
      await sendOwnerConfirmationCopy(updated)
      emailSent = true
    } catch (err: unknown) {
      emailError = err instanceof Error ? err.message : String(err)
      console.error('Confirmation email failed:', emailError)
    }
  }

  return NextResponse.json({ ...updated, emailSent, emailError })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  
  await deleteStoredReservation(id)
  return NextResponse.json({ success: true })
}