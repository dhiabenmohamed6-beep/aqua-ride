import { type Reservation } from '@/lib/reservations'
import { type Service } from '@/lib/services'
import { type BannerSettings, DEFAULT_BANNER } from '@/lib/banner'
import { type ContactMessage } from '@/lib/contact'
import { promises as fs } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')
const RESERVATIONS_FILE = join(DATA_DIR, 'reservations.json')
const SERVICES_FILE = join(DATA_DIR, 'services.json')
const MESSAGES_FILE = join(DATA_DIR, 'messages.json')
const BANNER_FILE = join(DATA_DIR, 'banner.json')

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {}
}

async function readJson<T>(file: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(file, 'utf-8')
    return JSON.parse(data) as T
  } catch {
    return defaultValue
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf-8')
}

// Reservations
export async function getStoredReservations(): Promise<Reservation[]> {
  return readJson<Reservation[]>(RESERVATIONS_FILE, [])
}

export async function saveStoredReservations(reservations: Reservation[]): Promise<void> {
  await writeJson(RESERVATIONS_FILE, reservations)
}

// Services
export async function getStoredServices(): Promise<Service[]> {
  return readJson<Service[]>(SERVICES_FILE, [])
}

export async function saveStoredServices(services: Service[]): Promise<void> {
  await writeJson(SERVICES_FILE, services)
}

// Messages
export async function getStoredMessages(): Promise<ContactMessage[]> {
  return readJson<ContactMessage[]>(MESSAGES_FILE, [])
}

export async function saveStoredMessages(messages: ContactMessage[]): Promise<void> {
  await writeJson(MESSAGES_FILE, messages)
}

// Banner
export async function getStoredBanner(): Promise<BannerSettings | null> {
  return readJson<BannerSettings | null>(BANNER_FILE, null)
}

export async function saveStoredBanner(banner: BannerSettings): Promise<void> {
  await writeJson(BANNER_FILE, banner)
}