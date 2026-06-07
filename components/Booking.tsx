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
  const [showSuccess, setShowSuccess] = useState(false)
  const [submittedPrice, setSubmittedPrice] = useState(0)

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

    setSubmittedPrice(calculatedPrice)
    setForm({ ...form, name: '', phone: '', email: '', message: '' })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 5000)
  }

  return (
    <section id="booking" className="bg-gradient-to-b from-[#062B37] to-[#0a3d4f] relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
      </div>

      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12 md:h-20 block -mb-1">
        <path d="M0,60 C180,120 360,0 540,60 C720,120 900,20 1080,70 C1260,120 1380,40 1440,60 L1440,0 L0,0 Z" fill="#f7f4ef" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="text-center mb-8 sm:mb-12">
          <p className="uppercase tracking-[5px] text-cyan-400 text-xs sm:text-sm font-semibold mb-3">Reserve Your Experience</p>
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Book Now
          </h2>
          <p className="text-white/70 text-sm sm:text-lg max-w-2xl mx-auto">
            Fill the form below to reserve your perfect sea adventure. We'll contact you soon to confirm your booking.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative bg-white/10 backdrop-blur-xl rounded-[32px] p-8 sm:p-12 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div className="md:col-span-2">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full h-14 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-6 focus:outline-none focus:border-cyan-400 text-base font-medium"
                  required
                />
              </div>
              
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full h-14 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-6 focus:outline-none focus:border-cyan-400 text-base font-medium"
                required
              />
              
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full h-14 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-6 focus:outline-none focus:border-cyan-400 text-base font-medium"
                required
              />

              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full h-14 bg-white/10 border border-white/20 text-white rounded-2xl px-6 focus:outline-none focus:border-cyan-400 text-base font-medium"
                required
              >
                <option value="" className="bg-[#062B37]">Select Service</option>
                {services.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#062B37]">{s.title} - {s.price}</option>
                ))}
              </select>

              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full h-14 bg-white/10 border border-white/20 text-white rounded-2xl px-6 focus:outline-none focus:border-cyan-400 text-base font-medium"
                required
              />

              <select
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full h-14 bg-white/10 border border-white/20 text-white rounded-2xl px-6 focus:outline-none focus:border-cyan-400 text-base font-medium"
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
                className="w-full h-14 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-6 focus:outline-none focus:border-cyan-400 text-base font-medium"
              />

              {selectedService?.hourly && (
                <input
                  name="hours"
                  type="number"
                  min={1}
                  value={form.hours}
                  onChange={handleChange}
                  placeholder="Number of Hours"
                  className="w-full h-14 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-6 focus:outline-none focus:border-cyan-400 text-base font-medium"
                />
              )}

              <select
                name="payment"
                value={form.payment}
                onChange={handleChange}
                className="w-full h-14 bg-white/10 border border-white/20 text-white rounded-2xl px-6 focus:outline-none focus:border-cyan-400 text-base font-medium"
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
              className="w-full h-32 bg-white/10 border border-white/20 text-white placeholder-white/50 rounded-2xl px-6 py-4 focus:outline-none focus:border-cyan-400 resize-none mb-6 text-base"
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 p-6 bg-cyan-500/20 rounded-2xl border border-cyan-400/30">
              <div>
                <p className="text-cyan-300 text-xs uppercase tracking-widest mb-1">Total Price</p>
                <p className="text-white text-3xl font-black">{calculatedPrice} DT</p>
                {selectedService && (
                  <p className="text-white/60 text-sm mt-1">
                    {selectedService.perPerson && `× ${form.people} person${form.people > 1 ? 's' : ''}`}
                    {selectedService.hourly && `× ${form.hours} hour${form.hours > 1 ? 's' : ''}`}
                  </p>
                )}
              </div>
              {selectedService && (
                <div className="text-right mt-3 sm:mt-0">
                  <p className="text-white/50 text-xs">{selectedService.title}</p>
                  <p className="text-cyan-300 font-semibold">{selectedService.price}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-14 rounded-2xl font-black text-white text-lg transition-all hover:scale-[1.02] active:scale-[.98] shadow-lg shadow-cyan-500/25"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)' }}
            >
              Confirm Booking
            </button>
          </form>

          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
              <div className="bg-white rounded-3xl p-10 text-center max-w-md w-full shadow-2xl transform animate-bounce-in">
                <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-white">✓</span>
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-3">Booking Confirmed!</h3>
                <p className="text-slate-500 mb-2">Total: <strong className="text-cyan-600">{submittedPrice} DT</strong></p>
                <p className="text-slate-500 text-sm">We'll contact you soon to confirm your reservation.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12 md:h-20 block -mt-1 rotate-180">
        <path d="M0,60 C180,0 360,120 540,60 C720,0 900,100 1080,50 C1260,0 1380,80 1440,60 L1440,100 L0,100 Z" fill="#f7f4ef" />
      </svg>

      <style jsx>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out; }
      `}</style>
    </section>
  )
}