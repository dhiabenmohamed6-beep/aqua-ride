export interface BannerSettings {
  imageUrl: string
  title: string
  subtitle: string
  description: string
  btnPrimary: string
  btnSecondary: string
}

export const DEFAULT_BANNER: BannerSettings = {
   imageUrl:     '/bunner.png',
   title:        'Discover',
   subtitle:     'the Sea',
   description:  'Hidden caves, crystal-clear waters, private tours, and unforgettable luxury moments on the Mediterranean.',
   btnPrimary:   'Book Now',
   btnSecondary: 'Explore Services',
 }

const KEY = 'aqua_banner'

export function getBanner(): BannerSettings {
  if (typeof window === 'undefined') return DEFAULT_BANNER
  try {
    const s = localStorage.getItem(KEY)
    return s ? { ...DEFAULT_BANNER, ...JSON.parse(s) } : DEFAULT_BANNER
  } catch { return DEFAULT_BANNER }
}

export function saveBanner(b: BannerSettings): void {
  localStorage.setItem(KEY, JSON.stringify(b))
}
