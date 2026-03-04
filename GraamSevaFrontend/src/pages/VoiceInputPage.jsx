import { useState } from 'react'
import '../styles/VoiceInputPage.css'

const LANGUAGE_NAMES = {
  hi: 'हिन्दी',
  bhoj: 'भोजपुरी',
  awa: 'अवधी',
  odi: 'ଓଡିଆ',
  mar: 'मराठी',
  mai: 'मैथिली',
}

export default function VoiceInputPage({ language, onComplete, onBack }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [name, setName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [step, setStep] = useState('info') // 'info' or 'recording'
  const [isProcessing, setIsProcessing] = useState(false)

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    const interval = setInterval(() => {
      setRecordingTime((t) => {
        if (t >= 60) {
          setIsRecording(false)
          clearInterval(interval)
          return t
        }
        return t + 1
      })
    }, 1000)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    // Simulate transcript from voice
    const mockTranscripts = {
      hi: 'मुझे PM-KISAN योजना के बारे में जानकारी चाहिए',
      bhoj: 'हम फसल बीमा के लिए आवेदन करना चाहते हैं',
      awa: 'मिट्टी स्वास्थ्य कार्ड योजना की जानकारी दीजिए',
      odi: 'ମୁଁ MGNREGA ରେଜିଷ୍ଟ୍ରେସନ ସମ୍ପର୍କରେ ଜାଣିବାକୁ ଚାହୁଁ',
      mar: 'मला सरकारी योजनांचा माहिती हवा',
      mai: 'हम PMAW योजनाकेँ बारेमे जानकारी चाहै छी',
    }
    setTranscript(mockTranscripts[language] || 'Query recorded')
  }

  const handleContinue = () => {
    if (!name.trim() || !mobileNumber.trim()) {
      alert('कृपया नाम और मोबाइल नंबर भरें')
      return
    }
    setStep('recording')
  }

  const handleSubmit = async () => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onComplete({
      name,
      mobileNumber,
      language,
      transcript,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div className="voice-input-page">
      <div className="voice-header">
        <button className="back-button" onClick={onBack}>
          ← वापस
        </button>
        <h2>GraamSeva - {LANGUAGE_NAMES[language]}</h2>
      </div>

      <div className="voice-content">
        {step === 'info' ? (
          <div className="info-form">
            <h3>कृपया अपनी जानकारी दर्ज करें</h3>

            <div className="form-group">
              <label>आपका नाम</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="नाम लिखें"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>मोबाइल नंबर</label>
              <div className="phone-input-wrapper">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.slice(0, 10))}
                  placeholder="10 अंक दर्ज करें"
                  className="form-input"
                  maxLength="10"
                />
              </div>
            </div>

            <button className="continue-button" onClick={handleContinue}>
              आगे बढ़ें →
            </button>
          </div>
        ) : (
          <div className="voice-recording">
            <div className="recording-box">
              <div className={`voice-icon ${isRecording ? 'recording' : ''}`}>
                🎤
              </div>
              <p className="recording-text">
                {isRecording ? 'रिकॉर्डिंग चल रही है...' : 'अपनी समस्या बताएं'}
              </p>
              {isRecording && (
                <div className="recording-timer">{recordingTime}s</div>
              )}
            </div>

            <div className="recording-controls">
              {!isRecording ? (
                <button
                  className="record-button"
                  onClick={handleStartRecording}
                >
                  🔴 शुरू करें
                </button>
              ) : (
                <button className="stop-button" onClick={handleStopRecording}>
                  ⏹️ बंद करें
                </button>
              )}
            </div>

            {transcript && (
              <div className="transcript-box">
                <h4>आपकी बात:</h4>
                <p className="transcript-text">{transcript}</p>
                <div className="transcript-actions">
                  <button
                    className="re-record-button"
                    onClick={() => {
                      setTranscript('')
                      setRecordingTime(0)
                    }}
                  >
                    🔄 दोबारा रिकॉर्ड करें
                  </button>
                </div>
              </div>
            )}

            {transcript && (
              <button
                className="submit-button"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? '⏳ प्रक्रिया चल रही है...' : '✅ पुष्टि करें'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
