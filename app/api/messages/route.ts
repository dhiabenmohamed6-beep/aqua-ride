import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface ContactMessage {
  id: string
  createdAt: string
  name: string
  phone: string
  email: string
  message: string
  read: boolean
}

const DATA_FILE = join(process.cwd(), 'data', 'messages.json')

function loadMessages(): ContactMessage[] {
  if (!existsSync(DATA_FILE)) return []
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  } catch { return [] }
}

function saveMessages(data: ContactMessage[]) {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true })
  }
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

let messages = loadMessages()

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
  saveMessages(messages)

  return NextResponse.json(msg)
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...updates } = body

  messages = messages.map(m => m.id === id ? { ...m, ...updates } : m)
  saveMessages(messages)

  return NextResponse.json({ success: true })
}