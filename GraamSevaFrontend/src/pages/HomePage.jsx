import { useState } from 'react'
import { PAGES } from '../constants/appConfig'
import voiceService from '../services/voiceService'

export default function HomePage({ tr, onNavigate, locationState, onRequestLocation, uiLanguage }) {
  const openText = tr.pages.home === 'होम' ? 'खोलें' : 'Open'
  const actionText = locationState.data ? tr.locationRefresh : tr.locationEnable

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
      {/* <div className="card rustic-card">
        <div className="card-content">
          <span className="card-title">{tr.homeTitle}</span>
          <p>{tr.homeSubtitle}</p>
        </div>
      </div> */}

      {/* <div className="card rustic-card top-gap">
        <div className="card-content">
          <span className="card-title">{tr.locationTitle}</span>
          {locationState.status === 'requesting' && <p>{tr.locationPending}</p>}
          {locationState.error && <p className="location-error">{tr.locationError}</p>}
          {!locationState.data && locationState.status !== 'requesting' && !locationState.error && (
            <p>{tr.locationUnknown}</p>
          )}
          {locationState.data && (
            <p>
              {tr.locationUsing} <strong>{locationState.data.displayName || locationState.data.district || locationState.data.state}</strong>
            </p>
          )}
          <button className="btn waves-effect amber darken-3 top-gap" onClick={onRequestLocation}>
            {actionText}
          </button>
          
        </div>
      </div> */}

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
        {PAGES.filter((p) => p.id !== 'history').map((page) => (
          <button key={page.id} className="card service-card" onClick={() => onNavigate(page.id)}>
            <div className="card-content">
              <span className="material-icons">{page.icon}</span>
              <h6>{tr.pages[page.id]}</h6>
              <p>{tr.pages[page.id]} {openText}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
