'use client'

import { useState, useEffect } from 'react'
import { getServices, type Service } from '@/lib/services'
import { generateId } from '@/lib/reservations'

export default function Booking() {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    people: 1,
    hours: 1,
    message: '',
    payment: 'cash',
  })

  useEffect(() => {
    setServices(getServices().filter(s => s.visible))
  }, [])

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  const selectedService = services.find(s => s.id === form.service)
  const calculatedPrice = selectedService 
    ? selectedService.hourly 
      ? selectedService.basePrice * form.hours 
      : selectedService.perPerson 
        ? selectedService.basePrice * form.people 
        : selectedService.basePrice
    : 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: name === 'people' || name === 'hours' ? Number(value) : value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedService) return

    const reservation = {
      ...form,
      id: generateId(),
      createdAt: new Date().toISOString(),
      serviceLabel: selectedService.title,
      total: calculatedPrice,
      status: 'pending',
      adminNote: '',
      discount: 0,
    }

    await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation),
    })

    setForm({ ...form, name: '', phone: '', email: '', message: '' })
    alert(`Reservation submitted! Total: ${calculatedPrice} DT`)
  }

  return (
    <section id="booking" className="bg-[#062B37] relative">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 md:h-20 block -mb-1 rotate-180">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,40 L1440,0 L0,0 Z" fill="#f7f4ef" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-8 sm:gap-12 items-start">
          <div>
            <p className="uppercase tracking-[3px] sm:tracking-[5px] text-cyan-500 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">Reserve Your Experience</p>
            <h2 className="text-[clamp(2rem,5vw,5rem)] font-black text-white mb-4 sm:mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Book Now
            </h2>
            <p className="text-slate-400 text-sm sm:text-lg leading-relaxed mb-8 sm:mb-10 hidden sm:block">
              Fill the form below to reserve your perfect sea adventure. We'll confirm your booking within hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="sm:col-span-2 w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
                required
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
                required
              />
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full border border-white/20 bg-white/10 text-white rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
                required
              >
                <option value="" className="bg-[#062B37]">Select Service</option>
                {services.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#062B37]">{s.title}</option>
                ))}
              </select>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-white/20 bg-white/10 text-white rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
                required
              />
              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full border border-white/20 bg-white/10 text-white rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
                required
              >
                <option value="" className="bg-[#062B37]">Select Time</option>
                {timeSlots.map(t => (
                  <option key={t} value={t} className="bg-[#062B37]">{t}</option>
                ))}
              </select>
              <input
                name="people"
                type="number"
                min={1}
                value={form.people}
                onChange={handleChange}
                placeholder="Number of People"
                className="w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
              />
              {selectedService?.hourly && (
                <input
                  name="hours"
                  type="number"
                  min={1}
                  value={form.hours}
                  onChange={handleChange}
                  placeholder="Number of Hours"
                  className="w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
                />
              )}
              <select
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className="w-full border border-white/20 bg-white/10 text-white rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 text-sm sm:text-base"
              >
                <option value="cash" className="bg-[#062B37]">Cash</option>
                <option value="transfer" className="bg-[#062B37]">Bank Transfer</option>
                <option value="edinar" className="bg-[#062B37]">E-Dinar</option>
              </select>
            </div>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Special requests..."
              rows={3}
              className="w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 resize-none mb-4 sm:mb-6 text-sm sm:text-base"
            />
            {selectedService && (
              <div className="mb-4 p-4 bg-cyan-500/20 rounded-xl border border-cyan-400/30">
                <p className="text-cyan-300 text-xs uppercase tracking-wider mb-1">Total Price</p>
                <p className="text-white text-2xl font-black">{calculatedPrice} DT</p>
                <p className="text-white/60 text-xs">{selectedService.perPerson && '× ' + form.people + ' person' + (form.people > 1 ? 's' : '')}{selectedService.hourly && '× ' + form.hours + ' hour' + (form.hours > 1 ? 's' : '')}</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-white text-base sm:text-lg transition-all hover:scale-[1.02] active:scale-[.98]"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)', boxShadow: '0 8px 32px rgba(6,182,212,.35)' }}
            >
              Submit Booking →
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}