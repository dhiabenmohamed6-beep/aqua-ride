'use client'

export default function Contact() {
  return (
    <section id="contact" className="bg-[#f7f4ef] relative">

      {/* Top torn wave from booking section */}
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 md:h-20 block -mb-1">
        <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,40 L1440,0 L0,0 Z"
          fill="#062B37" />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-24">

        {/* Heading */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-start mb-12 sm:mb-20">
          <div>
            <p className="uppercase tracking-[3px] sm:tracking-[5px] text-cyan-500 text-xs sm:text-sm font-semibold mb-2 sm:mb-4">Get In Touch</p>
            <h2 className="text-[clamp(2rem,5vw,5rem)] font-black text-[#062B37] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Contact<br />Us
            </h2>
          </div>
          <p className="text-slate-500 text-sm sm:text-lg leading-relaxed hidden sm:block md:text-right">
            Ready to book your luxury sea experience?<br />
            Reach out and we'll get back to you right away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10 items-start">

          {/* ── Contact cards (2 cols) ── */}
          <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-5">

            {[
              { icon: '📞', color: 'bg-cyan-500',    label: 'Phone',     value: '+216 23 251 023', sub: 'Available 8:00 – 20:00 daily', href: 'tel:+21600000000' },
              { icon: '💬', color: 'bg-green-500',   label: 'WhatsApp',  value: '+216 93 003 251', sub: 'Message us anytime',           href: 'https://wa.me/21600000000' },
              { icon: '✉️', color: 'bg-[#062B37]',   label: 'Email',     value: 'aquaride@gmail.com', sub: 'We reply within 1 hour',  href: 'mailto:contact@aquaride.tn' },
              { icon: '📍', color: 'bg-cyan-500',    label: 'Location',  value: 'El Haouaria,Nabeul,Tunisia',         sub: 'Mediterranean Sea',           href: 'https://maps.google.com/?q=Tunisia' },
            ].map((c, i) => (
              <a key={i} href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex items-center gap-3 sm:gap-5 bg-white hover:bg-cyan-50 border border-slate-100 hover:border-cyan-200 rounded-xl sm:rounded-[24px] p-3 sm:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${c.color} flex items-center justify-center text-white text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  {c.icon}
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{c.label}</p>
                  <p className="text-sm sm:text-lg font-black text-[#062B37]">{c.value}</p>
                  <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5">{c.sub}</p>
                </div>
              </a>
            ))}

            {/* Social row */}
            <div className="flex gap-2 sm:gap-4 pt-1 sm:pt-2">
              {[
                { label: 'Instagram', color: 'hover:bg-pink-500',   href: '#' },
                { label: 'Facebook',  color: 'hover:bg-blue-600',   href: '#' },
                { label: 'TikTok',    color: 'hover:bg-slate-800',  href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className={`flex-1 text-center text-xs sm:text-sm font-bold text-slate-500 bg-white border border-slate-100 py-2 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 ${s.color} hover:text-white hover:border-transparent hover:shadow-lg`}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Message form (3 cols) ── */}
          <div className="lg:col-span-3 relative">
            <div
              className="relative rounded-[24px] sm:rounded-[35px] p-5 sm:p-10 shadow-2xl"
              style={{ background: 'linear-gradient(135deg,#062B37 0%,#0a3d4f 100%)' }}
            >
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                Send a Message
              </h3>
              <p className="text-white/50 text-[10px] sm:text-sm mb-4 sm:mb-8">We'll get back to you within the hour.</p>

              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input type="text" placeholder="Your Name"
                    className="bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 transition-colors text-sm" />
                  <input type="tel" placeholder="Phone Number"
                    className="bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 transition-colors text-sm" />
                </div>
                <input type="email" placeholder="Email Address"
                  className="bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 transition-colors text-sm" />
                <textarea rows={3} placeholder="Your message…"
                  className="bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:border-cyan-400 transition-colors resize-none text-sm" />
                <a href="mailto:contact@aquaride.tn"
                  className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-white text-center transition-all hover:scale-[1.02] active:scale-[.98] text-sm sm:text-lg"
                  style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)', boxShadow: '0 8px 32px rgba(6,182,212,.35)' }}>
                  Send Message →
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Footer ── */}
      <div
        className="relative mt-6 sm:mt-10"
        style={{ background: 'linear-gradient(135deg,#062B37,#0a3d4f)' }}
      >
        {/* torn wave top */}
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-10 sm:h-12 md:h-16 block -mt-1">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,20 1440,40 L1440,0 L0,0 Z"
            fill="#f7f4ef" />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <img src="/logo.png" alt="AQUA RIDE" className="h-8 sm:h-12 w-auto brightness-0 invert opacity-90" />
          <p className="text-white/40 text-[10px] sm:text-sm text-center">
            © {new Date().getFullYear()} AQUA RIDE · Luxury Sea Experiences · Tunisia
          </p>
          <div className="flex gap-4 text-white/40 text-[10px] sm:text-sm">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">TikTok</a>
          </div>
        </div>
      </div>

    </section>
  )
}
