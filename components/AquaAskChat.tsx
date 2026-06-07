'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface ChatMessage {
  id: string
  text: string
  fromUser: boolean
}

const FAQ_RESPONSES: Record<string, string> = {
  'balade|sea ride|sea walk|relaxing': 'Balade en Mer is a relaxing sea stroll along the Tunisian coastline - perfect for families and couples. Price: 30 DT per person.',
  'pack|complete|full experience': 'Pack Complet includes the full experience - sea tour, snorkeling, and sunset cruise. Price: 90 DT per person.',
  'excursion|private tour|private boat': 'Excursion Privée gives you your own private boat on your schedule to explore hidden coves and secret beaches. Price: 300 DT per hour.',
  'mariage|marriage|proposal|wedding|proposal on sea': 'Demande de Mariage lets you propose on the open sea with luxury setup, flowers, and photographer. Price: 500 DT for full package.',
  'anniversary|anniv|birthday|celebration': 'Anniversaire celebration on the water with custom decoration and cake. Price starts at 200 DT.',
  'premium|vip|luxury|champagne': 'Premium Private Tour is the ultimate luxury experience - VIP boat, champagne, and personal guide. Price: 1000 DT per hour.',
  'price|cost|dt|payment|cash|expensive|cheap': 'Prices: Balade 30 DT, Pack 90 DT, Excursion 300 DT/h, Anniversaire 200 DT, Mariage 500 DT, Premium 1000 DT/h. Payment: Cash, Bank Transfer, E-Dinar.',
  'booking|reserve|book|availability|schedule': 'Book via the form above. We respond within hours. For immediate booking, call +216 23 251 023.',
  'time|hour|duration|when|open|departure': 'Tours run 09:00-18:00. Private tours customizable. Bookings available daily.',
  'location|where|address|el haouaria|nabeul|tunisia|marina|port': 'Located in El Haouaria, Nabeul, Tunisia on the Mediterranean Sea. We meet at the main marina.',
  'contact|phone|email|whatsapp|call': 'Call +216 23 251 023, WhatsApp +216 93 003 251, or email aquaride@gmail.com. Available 8:00-20:00 daily.',
  'safety|life jacket|equipment|secure|safe': 'All tours include safety equipment, life jackets for all sizes. Our boats are certified and captains are licensed professionals.',
  'snorkeling|snorkel|swim|fish|fish viewing': 'Snorkeling gear provided for sea tours. Crystal clear waters with abundant marine life.',
  'what to bring|towel|sunscreen|clothes': 'Bring swimwear, towel, sunscreen, and water. We provide safety equipment and refreshments.',
  'cancellation|refund|change|modify': 'Free cancellation up to 24 hours before. Contact us to modify your booking.',
  'group|family|couple|friends|party': 'Balade and Pack perfect for families/couples. Private tours accommodate 2-12 people. Large groups contact us directly.',
  'photo|photography|camera|underwater': 'Bring your camera! We also provide professional photography for special events (wedding proposals, anniversaries).',
  'hello|hi|hey|greetings|good morning|good evening': 'Hello! 🌊 I\'m AQUA ASK, your virtual assistant. Ask me about our services, prices, booking, or anything else!',
  'thank|thanks|appreciate': 'You\'re welcome! Need more help? Feel free to ask or contact us directly.',
  'default': 'I can help with our services, pricing, booking, location, safety, what to bring, and more. For special requests, contact us at +216 23 251 023 or use the booking form!'
}

export default function AquaAskChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Hello! I\'m AQUA ASK 🌊 How can I help you today?', fromUser: false }
  ])
  const [input, setInput] = useState('')

  function getResponse(question: string): string {
    const lower = question.toLowerCase()
    for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
      if (key !== 'default' && new RegExp(key, 'i').test(lower)) {
        return response
      }
    }
    return FAQ_RESPONSES.default
  }

  function handleSend() {
    if (!input.trim()) return

    const userMsg = { id: Date.now().toString(), text: input, fromUser: true }
    const response = getResponse(input)
    const botMsg = { id: (Date.now() + 1).toString(), text: response, fromUser: false }

    setMessages([...messages, userMsg, botMsg])
    setInput('')
  }

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-cyan-500 hover:bg-cyan-400 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden max-h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-black text-lg">AQUA ASK</p>
              <p className="text-cyan-100 text-xs">Your virtual assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50" style={{ maxHeight: '300px' }}>
            <div className="flex flex-col gap-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.fromUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.fromUser 
                      ? 'bg-cyan-500 text-white rounded-br-sm' 
                      : 'bg-white border border-slate-200 text-slate-600 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-cyan-400 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center hover:bg-cyan-400 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}