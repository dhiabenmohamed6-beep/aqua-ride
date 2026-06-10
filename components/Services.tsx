'use client'

import { useState, useEffect } from 'react'
import { DEFAULT_SERVICES, type Service } from '@/lib/services'

export default function Services() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services')
        const data = await res.json()
        setServices(data.filter((s: Service) => s.visible))
      } catch {
        setServices(DEFAULT_SERVICES.filter(s => s.visible))
      }
    }
    loadServices()
  }, [])

  return (
    <section id="services" className="bg-[#f7f4ef] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-start md:items-end mb-12 sm:mb-20">
          <div>
            <p className="uppercase tracking-[3px] sm:tracking-[5px] text-cyan-500 text-xs sm:text-sm font-semibold mb-2 sm:mb-4">What We Offer</p>
            <h2 className="text-[clamp(2rem,5vw,5rem)] font-black text-[#062B37] leading-tight" style={{ fontFamily:'Georgia,serif' }}>
              Premium<br />Services
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed hidden sm:block md:text-right">
            From romantic proposals to adrenaline-filled private tours —
            every experience is crafted for the extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {services.map((svc, i) => (
            <div key={svc.id || i}
              className="group bg-white rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 flex flex-col h-full">
              <div className="relative h-44 sm:h-56 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage:`url('${svc.img}')` }} />
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/20 transition-all duration-500" />
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl px-2 sm:px-4 py-1 sm:py-2 text-center">
                  <p className="text-lg sm:text-xl font-black text-cyan-500 leading-none">{svc.price}</p>
                  <p className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{svc.per}</p>
                </div>
              </div>
              <div className="p-4 sm:p-7 flex flex-col flex-1">
                <h3 className="text-xl sm:text-2xl font-black text-[#062B37] mb-2 sm:mb-3" style={{ fontFamily:'Georgia,serif' }}>{svc.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3">{svc.desc}</p>
                <a href={`/booking?service=${svc.id}`}
                  className="inline-flex items-center gap-1 sm:gap-2 bg-[#062B37] hover:bg-cyan-500 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm transition-all duration-300 hover:scale-105 mt-auto">
                  Book Experience <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-6 sm:mt-10">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12 sm:h-16 md:h-24 block">
          <path d="M0,50 C200,100 400,0 600,50 C800,100 1080,10 1200,55 C1320,80 1400,30 1440,50 L1440,0 L0,0 Z" fill="#f7f4ef" />
        </svg>
        <div className="relative py-16 sm:py-28 px-4 sm:px-6 text-center"
          style={{ background:'linear-gradient(135deg,#0a3d4f 0%,#06b6d4 50%,#0a3d4f 100%)' }}>
          <p className="uppercase tracking-[2px] sm:tracking-[5px] text-cyan-200 text-[10px] sm:text-sm mb-3 sm:mb-4">The Mediterranean Awaits</p>
          <h2 className="text-[clamp(1.8rem,5vw,5rem)] font-black text-white mb-4 sm:mb-6" style={{ fontFamily:'Georgia,serif' }}>Sea, Sun & Luxury!</h2>
          <p className="text-white/70 text-sm sm:text-lg max-w-xl mx-auto mb-6 sm:mb-10 px-2 sm:px-0">Every trip is a story. Let us write yours on the crystal-clear waters of Tunisia.</p>
          <a href="/booking" className="inline-block border-2 border-white text-white font-bold px-6 sm:px-10 py-2 sm:py-4 rounded-full hover:bg-white hover:text-cyan-600 transition-all duration-300 hover:scale-105 text-sm sm:text-base">
            Reserve Your Experience
          </a>
        </div>
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12 sm:h-16 md:h-24 block">
          <path d="M0,50 C180,0 360,100 540,50 C720,0 900,90 1080,45 C1260,0 1380,70 1440,50 L1440,100 L0,100 Z" fill="#f7f4ef" />
        </svg>
      </div>
    </section>
  )
}
