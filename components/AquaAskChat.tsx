'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { DEFAULT_SERVICES, type Service } from '@/lib/services'

interface ChatMessage {
  id: string
  text: string
  fromUser: boolean
}

const WORKING_HOURS = 'Tours run daily from 09:00 to 18:00. Private tours can be customized by request. Customer support is available 08:00-20:00 daily.'

const SERVICE_ALIASES: Record<string, string[]> = {
  balade: ['balade', 'balade en mer', 'mer', 'sea walk', 'sea stroll', 'boat ride', 'family tour', 'couple tour', 'promenade en mer', 'sortie en mer'],
  pack: ['pack', 'pack complet', 'complete pack', 'full experience', 'snorkeling', 'sunset cruise', 'pack complete'],
  excursion: ['excursion', 'excursion privee', 'excursion privée', 'private tour', 'private boat', 'private trip', 'vip boat', 'bateau prive'],
  mariage: ['mariage', 'demande de mariage', 'proposal', 'wedding', 'propose', 'flowers', 'photographer'],
  anniv: ['anniv', 'anniversaire', 'birthday', 'anniversary', 'celebration', 'cake', 'fete'],
  premium: ['premium', 'premium private tour', 'vip', 'luxury', 'champagne', 'personal guide'],
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[_-]/g, ' ')
    .trim()
}

function formatService(service: Service): string {
  const details = [
    `${service.title} - ${service.price} ${service.per}`,
    service.desc,
  ]

  if (service.hourly) {
    details.push('Duration is charged by the hour and can be customized.')
  } else if (service.per === 'full package' || service.per === 'tailored') {
    details.push('Duration is arranged around your event.')
  } else {
    details.push('Available during regular tour hours.')
  }

  if (service.hasFood) {
    details.push('Food is included with this service.')
  }

  return details.join('\n')
}

function listServices(services: Service[]): string {
  const visible = services.length > 0 ? services : DEFAULT_SERVICES.filter(s => s.visible)
  return 'Available services:\n' + visible.map((service, index) => `${index + 1}. ${service.title} - ${service.price} ${service.per}`).join('\n') + '\n\nAsk me for details, prices, booking, or working hours for any service.'
}

function matchesService(service: Service, question: string): boolean {
  const aliases = SERVICE_ALIASES[service.id] ?? []
  const searchable = normalize([service.id, service.title, service.desc, service.price, service.per, ...aliases].join(' '))
  return aliases.some(alias => question.includes(normalize(alias))) || question.includes(normalize(service.title)) || question.includes(service.id) || searchable.split(' ').some(word => word.length > 4 && question.includes(word))
}

function findService(question: string, services: Service[]): Service | undefined {
  const visible = services.length > 0 ? services : DEFAULT_SERVICES.filter(s => s.visible)
  return visible.find(service => matchesService(service, question))
}

function getResponse(question: string, services: Service[]): string {
  const lower = normalize(question)
  const service = findService(lower, services)

  if (service) {
    const answer = formatService(service)
    if (/(time|times|hour|hours|duration|how long|open|schedule|horaires|horaire|heure|ouvert|dispo|disponible|available|when|quand|duree|durée|combien de temps|working)/.test(lower)) {
      return answer + '\n\nWorking time: ' + WORKING_HOURS
    }
    return answer
  }

  if (/(working|hours|hour|duration|how long|open|schedule|horaires|horaire|heure|ouvert|dispo|disponible|available|time|times|when|quand|duree|durée|combien de temps|daily)/.test(lower)) {
    return 'Working time: ' + WORKING_HOURS
  }

  if (/(all services|services|offer|options|activities|what do you have|choisir|activité|prestation|service)/.test(lower)) {
    return listServices(services)
  }

  if (/(price|prices|cost|tarif|prix|dt|dinar|payment|pay|cash|bank|e-dinar)/.test(lower)) {
    return 'Prices: Balade en Mer 30 DT per person, Pack Complet 90 DT per person, Excursion Privée 300 DT per hour, Demande de Mariage 500 DT full package, Anniversaire from 200 DT tailored, Premium Private Tour 1000 DT per hour. Payment options include Cash, Bank Transfer, and E-Dinar.'
  }

  if (/(food|meal|snack|lunch|repas|manger|déjeuner|dejeuner)/.test(lower)) {
    return 'Pack Complet includes food. Other services can be customized for refreshments or catering on request.'
  }

  if (/(book|reserve|booking|reservation|réserver|reserver|disponible|availability)/.test(lower)) {
    return 'You can book with the form on the site. We usually respond within hours. For immediate booking, call +216 23 251 023 or WhatsApp +216 93 003 251.'
  }

  if (/(group|family|couple|friends|party|capacity|people|personnes|groupe)/.test(lower)) {
    return 'Balade en Mer and Pack Complet are great for families and couples. Private tours are best for 2-12 people. Larger groups can contact us directly to arrange a boat.'
  }

  if (/(location|where|address|el haouaria|nabeul|tunisia|marina|port|lieu|adresse)/.test(lower)) {
    return 'Located in El Haouaria, Nabeul, Tunisia on the Mediterranean Sea. We meet at the main marina.'
  }

  if (/(contact|phone|email|whatsapp|call|telephone|tel)/.test(lower)) {
    return 'Call +216 23 251 023, WhatsApp +216 93 003 251, or email aquaride@gmail.com. Customer support is available 08:00-20:00 daily.'
  }

  if (/(safety|life jacket|equipment|secure|safe|security|gilet|securite|sécurité)/.test(lower)) {
    return 'All tours include safety equipment and life jackets for all sizes. Our boats are certified and captains are licensed professionals.'
  }

  if (/(bring|towel|sunscreen|clothes|swimwear|water|apporter|serviette|crème|creme)/.test(lower)) {
    return 'Bring swimwear, a towel, sunscreen, and water. We provide safety equipment, and Pack Complet includes refreshments.'
  }

  if (/(cancellation|refund|change|modify|annuler|remboursement|modifier)/.test(lower)) {
    return 'Free cancellation up to 24 hours before your trip. Contact us by phone or WhatsApp if you need to modify your booking.'
  }

  if (/(photo|photography|camera|underwater|picture|photo)/.test(lower)) {
    return 'Bring your camera. Professional photography is available for special events such as marriage proposals and anniversaries.'
  }

  if (/(hello|hi|hey|greetings|good morning|good evening|bonjour|salut)/.test(lower)) {
    return "Hello! I'm AQUA ASK. Ask me about our services, prices, booking, or working hours."
  }

  if (/(thank|thanks|appreciate|merci)/.test(lower)) {
    return "You're welcome! Need more help? Ask about any service, price, booking, or working time."
  }

  return 'I can answer questions about all services, prices, booking, and working hours. Working time: ' + WORKING_HOURS + ' Ask me, for example, "What services do you offer?" or "What time are you open?"'
}

export default function AquaAskChat() {
  const [open, setOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', text: 'Hello! I\'m AQUA ASK. Ask me about services, prices, booking, or working hours.', fromUser: false }
  ])
  const [input, setInput] = useState('')

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch('/api/services?cache=' + Date.now())
        const data = await res.json()
        setServices(data.filter((service: Service) => service.visible))
      } catch {
        setServices(DEFAULT_SERVICES.filter(service => service.visible))
      }
    }

    loadServices()
    const interval = setInterval(loadServices, 30000)
    return () => clearInterval(interval)
  }, [])

  async function handleSend() {
    if (!input.trim()) return

    const userMsg = { id: Date.now().toString(), text: input, fromUser: true }
    const response = getResponse(input, services)
    const botMsg = { id: (Date.now() + 1).toString(), text: response, fromUser: false }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-cyan-500 hover:bg-cyan-400 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="w-8 h-8 text-white" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden max-h-[500px]">
          <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-black text-lg">AQUA ASK</p>
              <p className="text-cyan-100 text-xs">Services and working hours assistant</p>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

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

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about a service or working hours..."
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
