'use client'

import { useState, useEffect } from 'react'
import { DEFAULT_BANNER, type BannerSettings } from '@/lib/banner'

export default function Hero() {
  const [banner, setBanner] = useState<BannerSettings>(DEFAULT_BANNER)

  useEffect(() => {
    async function loadBanner() {
      try {
        const res = await fetch('/api/banner')
        const data = await res.json()
        setBanner(data)
      } catch {
        setBanner(DEFAULT_BANNER)
      }
    }
    loadBanner()
  }, [])

  return (
    <section id="home" className="relative min-h-[85vh] sm:min-h-screen flex flex-col">

      <div className="relative flex-1 min-h-[85vh] sm:min-h-screen">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url('${banner.imageUrl}')` }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(6,43,55,.65) 0%, rgba(6,43,55,.3) 60%, rgba(6,43,55,.0) 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 md:pt-48 pb-12 sm:pb-20 md:pb-32">
          <p className="uppercase tracking-[3px] sm:tracking-[6px] text-cyan-300 text-xs sm:text-sm mb-3 sm:mb-6 anim-up" style={{ animationDelay:'.1s' }}>
            Luxury Sea Experiences · Tunisia
          </p>
          <h1 className="text-[clamp(2.5rem,7vw,8rem)] font-black text-white leading-tight sm:leading-none mb-6 sm:mb-8 anim-up"
            style={{ animationDelay:'.2s', fontFamily:'Georgia, serif' }}>
            {banner.title}<br />
            <span className="text-cyan-400">{banner.subtitle}</span>
          </h1>
          <p className="text-white/80 text-base sm:text-xl max-w-lg leading-relaxed mb-6 sm:mb-10 anim-up" style={{ animationDelay:'.3s' }}>
            {banner.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 anim-up" style={{ animationDelay:'.4s' }}>
            <a href="#booking"
              className="bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30 text-center text-sm sm:text-base">
              {banner.btnPrimary}
            </a>
            <a href="#services"
              className="glass text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/25 transition-all text-center text-sm sm:text-base">
              {banner.btnSecondary}
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-20 md:h-28" style={{ display:'block' }}>
            <path d="M0,60 C180,120 360,0 540,60 C720,120 900,20 1080,70 C1260,120 1380,40 1440,60 L1440,120 L0,120 Z"
              fill="#f7f4ef" />
          </svg>
        </div>
      </div>

      <div className="bg-[#f7f4ef] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { num:'6+',   label:'Unique Experiences' },
              { num:'500+', label:'Happy Clients'      },
              { num:'100%', label:'Luxury Service'     },
              { num:'5★',   label:'Average Rating'     },
            ].map((s, i) => (
              <div key={i} className="text-center anim-up" style={{ animationDelay:`${.1+i*.1}s` }}>
                <p className="text-3xl sm:text-5xl font-black text-cyan-500 mb-1">{s.num}</p>
                <p className="text-slate-500 text-[10px] sm:text-sm uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
