import { NextRequest, NextResponse } from 'next/server'
import { buildConfirmationHtml, sendCustomerConfirmation } from '@/lib/mail'

const PAYMENT_LABELS: Record<string, string> = {
  cash:     'Cash',
  transfer: 'Bank Transfer',
  edinar:   'E-Dinar',
}

function buildEmailHtml(data: {
  name: string
  email: string
  serviceLabel: string
  date: string
  time: string
  people: number
  hours: number
  payment: string
  total: number
  discount: number
  id: string
  adminNote?: string
}) {
  return buildConfirmationHtml(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, serviceLabel, date, time, people, hours, payment, total, discount, id, adminNote } = body

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await sendCustomerConfirmation({ id, name, email, serviceLabel, date, time, people, hours, payment, total, discount, adminNote })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Email error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
