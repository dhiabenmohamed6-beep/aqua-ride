import { type Reservation } from '@/lib/reservations'
import { type Service } from '@/lib/services'
import { type BannerSettings } from '@/lib/banner'
import { type ContactMessage } from '@/lib/contact'

let supabase: any = null

function getSupabase() {
  if (!supabase && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return supabase
}

// Reservations
export async function getStoredReservations(): Promise<Reservation[]> {
  const sb = getSupabase()
  if (!sb) return []
  try {
    const { data, error } = await sb.from('reservations').select('*').order('created_at', { ascending: false })
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export async function upsertReservation(reservation: Reservation): Promise<void> {
  const sb = getSupabase()
  if (!sb) return
  try {
    await sb.from('reservations').upsert(reservation)
  } catch {}
}

export async function deleteStoredReservation(id: string): Promise<void> {
  const sb = getSupabase()
  if (!sb) return
  try {
    await sb.from('reservations').delete().eq('id', id)
  } catch {}
}

// Services
export async function getStoredServices(): Promise<Service[]> {
  const sb = getSupabase()
  if (!sb) return []
  try {
    const { data, error } = await sb.from('services').select('*')
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

export async function saveStoredServices(services: Service[]): Promise<void> {
  const sb = getSupabase()
  if (!sb) return
  for (const service of services) {
    try {
      await sb.from('services').upsert(service)
    } catch {}
  }
}

// Messages
export async function getStoredMessages(): Promise<ContactMessage[]> {
  const sb = getSupabase()
  if (!sb) return []
  try {
    const { data, error } = await sb.from('messages').select('*').order('created_at', { ascending: false })
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export async function upsertMessage(message: ContactMessage): Promise<void> {
  const sb = getSupabase()
  if (!sb) return
  try {
    await sb.from('messages').upsert(message)
  } catch {}
}

// Banner
export async function getStoredBanner(): Promise<BannerSettings | null> {
  const sb = getSupabase()
  if (!sb) return null
  try {
    const { data, error } = await sb.from('banner').select('*').single()
    if (error || !data) return null
    return data
  } catch {
    return null
  }
}

export async function saveStoredBanner(banner: BannerSettings): Promise<void> {
  const sb = getSupabase()
  if (!sb) return
  try {
    await sb.from('banner').upsert(banner)
  } catch {}
}