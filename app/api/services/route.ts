import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_SERVICES, type Service } from '@/lib/services'
import { getStoredServices, saveStoredServices } from '@/lib/data-store'

export async function GET() {
  try {
    const services = await getStoredServices()
    return NextResponse.json(services.length > 0 ? services : DEFAULT_SERVICES)
  } catch {
    return NextResponse.json(DEFAULT_SERVICES)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const services = await req.json()
    await saveStoredServices(services)
    return NextResponse.json(services)
  } catch {
    return NextResponse.json(DEFAULT_SERVICES)
  }
}