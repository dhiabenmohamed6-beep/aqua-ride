import { NextRequest, NextResponse } from 'next/server'
import { type ContactMessage } from '@/lib/contact'
import { getStoredMessages, saveStoredMessages } from '@/lib/data-store'

export async function GET() {
  const messages = await getStoredMessages()
  const sorted = [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json(sorted)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const messages = await getStoredMessages()
  const msg: ContactMessage = {
    id: 'MSG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
    createdAt: new Date().toISOString(),
    read: false,
    ...body,
  }

  messages.unshift(msg)
  await saveStoredMessages(messages)
  return NextResponse.json(msg)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body
  const messages = await getStoredMessages()

  const updated = messages.map(m => m.id === id ? { ...m, ...updates } : m)
  await saveStoredMessages(updated)
  return NextResponse.json({ success: true })
}