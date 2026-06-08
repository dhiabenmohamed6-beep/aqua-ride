import { NextRequest, NextResponse } from 'next/server'
import { type ContactMessage } from '@/lib/contact'

let messages: ContactMessage[] = []

export async function GET() {
  const sorted = [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json(sorted)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const msg: ContactMessage = {
    id: 'MSG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
    createdAt: new Date().toISOString(),
    read: false,
    ...body,
  }

  messages.unshift(msg)
  return NextResponse.json(msg)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body

  messages = messages.map(m => m.id === id ? { ...m, ...updates } : m)
  return NextResponse.json({ success: true })
}