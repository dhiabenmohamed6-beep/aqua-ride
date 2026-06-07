'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface ChatMessage {
  id: string
  text: string
  fromUser: boolean
}

const FAQ_RESPONSES: Record<string, string> = {
  'service|offering|offer': 'We offer premium sea experiences including: Balade en Mer, Pack Complet, Excursion Privée, Demande de Mariage, Anniversaire, and Premium Private Tour.',
  'price|cost|dt|payment|cash': 'Our prices start from 30 DT per person. Payment options include Cash, Bank Transfer, and E-Dinar. Full pricing is shown when you select a service in the booking form.',
  'booking|reserve|book|availability': 'You can book directly through our booking form. We typically respond within hours to confirm your reservation.',
  'time|hour|duration': 'Tours typically run from 09:00 to 18:00. Private tours can be customized to your schedule.',
  'location|where|address|el haouaria|nabeul|tunisia': 'We are located in El Haouaria, Nabeul, Tunisia - right on the Mediterranean Sea.',
  'contact|phone|email|whatsapp': 'Call us at +216 23 251 023 or WhatsApp +216 93 003 251. Email: aquaride@gmail.com',
  'image|photo|picture': 'You can see our services and experiences in the Services section above with beautiful photos.',
  'hello|hi|hey|greetings': 'Hello! I\'m AQUA ASK, your virtual assistant. How can I help you today?',
  'default': 'I can help with bookings, services, pricing, and general questions. For more details, check our website sections above or contact us directly!'
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