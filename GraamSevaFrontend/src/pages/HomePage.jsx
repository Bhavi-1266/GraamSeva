import '../styles/HomePage.css'

const LANGUAGES = [
  { code: 'hi', name: 'हिन्दी', nativeName: 'Hindi' },
  { code: 'bhoj', name: 'भोजपुरी', nativeName: 'Bhojpuri' },
  { code: 'awa', name: 'अवधी', nativeName: 'Awadhi' },
  { code: 'odi', name: 'ଓଡିଆ', nativeName: 'Odia' },
  { code: 'mar', name: 'मराठी', nativeName: 'Marathi' },
  { code: 'mai', name: 'मैथिली', nativeName: 'Maithili' },
]

export default function HomePage({ onLanguageSelect }) {
  return (
    <div className="home-page">
      <div className="home-header">
        <h1 className="app-title">🌾 GraamSeva</h1>
        <p className="app-subtitle">
          भारत की सरकारी योजनाएं आपकी भाषा में
        </p>
        <p className="app-tagline">
          India's Government Schemes in Your Language
        </p>
      </div>

      <div className="home-content">
        <div className="intro-section">
          <p className="intro-text">
            👋 स्वागत है! GraamSeva आपको हजारों सरकारी योजनाओं तक पहुंचने में मदद करता है।
          </p>
          <p className="intro-text">
            अपनी भाषा चुनें और शुरू करें:
          </p>
        </div>

        <div className="language-selection">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className="language-button"
              onClick={() => onLanguageSelect(lang.code)}
            >
              <div className="lang-name">{lang.name}</div>
              <div className="lang-subtitle">{lang.nativeName}</div>
            </button>
          ))}
        </div>

        <div className="info-section">
          <h3>🎯 आप क्या पा सकते हैं?</h3>
          <div className="info-grid">
            <div className="info-card">
              <span className="info-icon">📱</span>
              <h4>PM-KISAN</h4>
              <p>किसान सम्मान निधि योजना</p>
            </div>
            <div className="info-card">
              <span className="info-icon">🛡️</span>
              <h4>Crop Insurance</h4>
              <p>पीएमएफबीवाई - फसल बीमा</p>
            </div>
            <div className="info-card">
              <span className="info-icon">💼</span>
              <h4>MGNREGA</h4>
              <p>महात्मा गांधी रोजगार गारंटी</p>
            </div>
            <div className="info-card">
              <span className="info-icon">🏦</span>
              <h4>Soil Health</h4>
              <p>मिट्टी स्वास्थ्य कार्ड योजना</p>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <p className="footer-text">
            📞 आप हमें मिस्ड कॉल भी दे सकते हैं: <strong>1234-567-8900</strong>
          </p>
          <p className="footer-subtext">
            शून्य डेटा लागत • आपकी भाषा में सेवा
          </p>
        </div>
      </div>
    </div>
  )
}
