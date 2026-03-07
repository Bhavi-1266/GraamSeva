import { useState } from 'react'
import { PAGES } from '../constants/appConfig'
import voiceService from '../services/voiceService'

export default function HomePage({ tr, onNavigate, uiLanguage, profile }) {
  const openText = tr.pages.home === "होम" ? "खोलें" : "Open"
  const [newOffers, setNewOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNewOffers()
  }, [uiLanguage])

  const loadNewOffers = async () => {
    try {
      setLoading(true)
      const result = await newSchemesOffersService.getNewSchemes(uiLanguage)
      setNewOffers(result.data)
      console.log(`New offers loaded from ${result.source}:`, result.data)
    } catch (err) {
      console.error("Failed to load new offers:", err)
    } finally {
      setLoading(false)
    }
  }

  const [isListening, setIsListening] = useState(false)
  const [voiceResult, setVoiceResult] = useState(null)

  const handleVoiceAssistant = async () => {
    try {
      setIsListening(true)
      setVoiceResult(null)
      // Translate from user language (uiLanguage) to English
      const result = await voiceService.recognizeAndTranslate(uiLanguage || 'hi')
      setVoiceResult(result)
    } catch (error) {
      console.error(error)
      setVoiceResult({ error: error.message })
    } finally {
      setIsListening(false)
    }
  }

  return (
    <div>
      {/* New Schemes & Offers Section */}
      <div className="bg-white p-4 rounded-lg mb-6 overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500">
            {uiLanguage === 'hi' ? 'नई योजनाएं लोड हो रही हैं...' : 'Loading new schemes...'}
          </p>
        ) : (
          <div className="flex gap-4 min-w-max">
            {newOffers.map((offer) => (
              <div
                key={offer.id}
                className="min-w-[220px] bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col gap-1"
              >
                <h4 className="font-semibold text-sm">
                  {offer.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {offer.desc}
                </p>
                <span className="text-[10px] bg-green-200 w-fit px-2 py-1 rounded">
                  {offer.badge}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card rustic-card top-gap voice-assistant-card" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div className="card-content">
          <span className="card-title" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            {tr.voiceAssistant || 'Voice AI Assistant'}
          </span>

          <button
            className={`btn-floating btn-large waves-effect waves-light ${isListening ? 'red pulse' : 'green'}`}
            onClick={handleVoiceAssistant}
            disabled={isListening}
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', backgroundColor: isListening ? '#f44336' : '#4CAF50' }}
          >
            <span className="material-icons" style={{ color: 'white', fontSize: '32px' }}>mic</span>
          </button>

          <p style={{ marginTop: '10px', color: isListening ? '#f44336' : 'inherit', fontWeight: '500' }}>
            {isListening ? (tr.listening || 'Listening... Speak now') : (tr.tapToSpeak || 'Tap to speak in your language')}
          </p>

          {voiceResult && voiceResult.text && (
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f1f8e9', borderRadius: '8px', textAlign: 'left', border: '1px solid #c5e1a5' }}>
              <p style={{ margin: '0 0 8px 0', color: '#33691e' }}><strong>Recognized:</strong> {voiceResult.text}</p>
              {voiceResult.translatedText && (
                <p style={{ margin: 0, color: '#1565c0' }}><strong>AI Translation:</strong> {voiceResult.translatedText}</p>
              )}
            </div>
          )}
          {voiceResult && voiceResult.error && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '8px', fontSize: '0.9rem' }}>
              <p style={{ margin: 0 }}>{voiceResult.error}</p>
              <p style={{ marginTop: '5px', fontSize: '0.8rem' }}>Try using Chrome or Edge for voice features</p>
            </div>
          )}
        </div>
      </div>

      <div className="service-grid">
        {PAGES.filter((p) => p.id !== "history").map((page) => (
          <button
            key={page.id}
            className="card service-card"
            onClick={() => onNavigate(page.id)}
          >
            <div className="card-content">
              <span className="material-icons">{page.icon}</span>
              <h6>{tr.pages[page.id]}</h6>
              <p>
                {tr.pages[page.id]} {openText}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
