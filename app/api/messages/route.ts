import { NextRequest, NextResponse } from 'next/server'
import { type ContactMessage } from '@/lib/contact'
import { getStoredMessages, upsertMessage } from '@/lib/data-store'

export async function GET() {
  const messages = await getStoredMessages()
  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const msg: ContactMessage = {
    id: 'MSG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
    createdAt: new Date().toISOString(),
    read: false,
    ...body,
  }

  await upsertMessage(msg)
  return NextResponse.json(msg)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const updated: ContactMessage = body
  
  await upsertMessage(updated)
  return NextResponse.json({ success: true })
}