'use client'

import { useState, useEffect, useRef } from 'react'
import { getServices, type Service } from '@/lib/services'

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const svc = services.find(s => s.id === form.service)
    if (!svc) return

    const price = svc.hourly ? svc.basePrice * form.hours : svc.perPerson ? svc.basePrice * form.people : svc.basePrice

    await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        serviceLabel: svc.title,
        total: price,
        status: 'pending',
        adminNote: '',
        discount: 0,
      }),
    })

    setForm({ ...form, name: '', phone: '', email: '', message: '' })
    alert('Reservation submitted!')
  }

  return (
    <section id="booking" className="bg-[#062B37] relative">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 md:h-20 block -mb-1 rotate-180">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,40 L1440,0 L0,0 Z" fill="#f7f4ef" />
      </svg>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="uppercase tracking-[5px] text-cyan-500 text-sm font-semibold mb-4">Reserve Your Experience</p>
            <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Book Now
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Fill the form below to reserve your perfect sea adventure. We'll confirm your booking within hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-sm rounded-[32px] p-8 border border-white/10">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="md:col-span-2 w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
                required
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
                required
              />
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full border border-white/20 bg-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
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
                className="w-full border border-white/20 bg-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
                required
              />
              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full border border-white/20 bg-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
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
                className="w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
              />
              <select
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className="w-full border border-white/20 bg-white/10 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400"
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
              className="w-full border border-white/20 bg-white/10 text-white placeholder-white/40 rounded-2xl px-5 py-4 focus:outline-none focus:border-cyan-400 resize-none mb-6"
            />
            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.02] active:scale-[.98]"
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