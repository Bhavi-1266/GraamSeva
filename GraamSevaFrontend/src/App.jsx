import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEYS = {
  profile: 'gs_profile',
  history: 'gs_conversations',
}

const LANGUAGES = [
  { code: 'hi', label: 'Hindi' },
  { code: 'bho', label: 'Bhojpuri' },
  { code: 'awa', label: 'Awadhi' },
  { code: 'mr', label: 'Marathi' },
  { code: 'mai', label: 'Maithili' },
  { code: 'or', label: 'Odia' },
]

const PAGES = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'schemes', label: 'Schemes', icon: 'assignment' },
  { id: 'mandi', label: 'Mandi', icon: 'storefront' },
  { id: 'loan', label: 'Loan', icon: 'account_balance' },
  { id: 'apply', label: 'Apply', icon: 'description' },
  { id: 'history', label: 'History', icon: 'history' },
]

const PAGE_KEYWORDS = {
  schemes: ['scheme', 'yojna', 'subsidy', 'tractor'],
  mandi: ['mandi', 'rate', 'price', 'gehu', 'wheat', 'grain'],
  loan: ['loan', 'credit', 'kcc', 'finance'],
  apply: ['apply', 'application', 'form', 'register'],
}

const DEFAULT_CARD_DATA = {
  schemes: [
    { title: 'PM-KISAN', detail: 'Direct support: Rs 6,000/year' },
    { title: 'Farm Equipment Subsidy', detail: 'Up to 40% subsidy support' },
    { title: 'Kisan Credit Card', detail: 'Crop + equipment loan up to Rs 3 lakh' },
  ],
  mandi: [
    { title: 'Sitapur Mandi', detail: 'Wheat: Rs 2,320 / quintal' },
    { title: 'Hardoi Mandi', detail: 'Wheat: Rs 2,280 / quintal' },
    { title: 'Lucknow Mandi', detail: 'Wheat: Rs 2,400 / quintal' },
  ],
}

function formatTime(ts) {
  return new Date(ts).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function detectRedirect(query) {
  const lower = query.toLowerCase()
  return Object.keys(PAGE_KEYWORDS).find((page) =>
    PAGE_KEYWORDS[page].some((keyword) => lower.includes(keyword)),
  )
}

function createAssistantReply({ query, page, memoryIntent }) {
  const lower = query.toLowerCase()
  const redirect = detectRedirect(query)

  if (redirect && redirect !== page) {
    return {
      response: `Taking you to ${redirect}. I will keep the same request in context.`,
      suggestions: ['Show top options', 'Start voice mode', 'Open application form'],
      redirect,
      cards: [],
      intent: redirect,
    }
  }

  if ((lower.includes('kitni subsidy') || lower.includes('how much subsidy')) && memoryIntent === 'tractor') {
    return {
      response: 'For tractor support, subsidy usually ranges from 30% to 40% based on state and category.',
      suggestions: ['Check my eligibility', 'Open tractor schemes', 'Apply now'],
      cards: [
        { title: 'SMAM Support', detail: 'Up to 40% subsidy on equipment purchase' },
        { title: 'State Tractor Subsidy', detail: 'Fixed support up to Rs 1.5 lakh (state dependent)' },
      ],
      intent: 'tractor',
    }
  }

  if (page === 'schemes') {
    if (lower.includes('tractor')) {
      return {
        response: 'You may be eligible for tractor subsidy and low-interest farm equipment loan.',
        suggestions: ['Apply Tractor Subsidy', 'Check Loan Eligibility', 'Find Nearby Dealer'],
        cards: [
          { title: 'SMAM Tractor Support', detail: 'Subsidy up to 40%' },
          { title: 'State Tractor Subsidy', detail: 'Support up to Rs 1.5 lakh' },
          { title: 'Kisan Credit Card Loan', detail: 'Up to Rs 3 lakh loan support' },
        ],
        intent: 'tractor',
      }
    }

    return {
      response: 'I can help with subsidy, crop insurance, PM-KISAN, and MGNREGA scheme guidance.',
      suggestions: ['PM-KISAN details', 'Crop insurance help', 'Open application flow'],
      cards: DEFAULT_CARD_DATA.schemes,
      intent: 'scheme_general',
    }
  }

  if (page === 'mandi') {
    if (lower.includes('gehu') || lower.includes('wheat')) {
      return {
        response: 'Latest nearby wheat rates are available below.',
        suggestions: ['Show rice price', 'Check tomorrow trend', 'Open nearest mandi'],
        cards: DEFAULT_CARD_DATA.mandi,
        intent: 'wheat_rate',
      }
    }

    return {
      response: 'Tell me your crop name and I will show market rates around your area.',
      suggestions: ['Wheat rate', 'Paddy rate', 'Maize rate'],
      cards: DEFAULT_CARD_DATA.mandi,
      intent: 'mandi_general',
    }
  }

  if (page === 'loan') {
    if (lower.includes('tractor')) {
      return {
        response: 'Estimated tractor loan setup is prepared below for quick application.',
        suggestions: ['Use KCC option', 'Compare NABARD loan', 'Move to apply form'],
        cards: [
          { title: 'Recommended Amount', detail: 'Rs 4,00,000' },
          { title: 'Estimated Interest', detail: '6% per year (indicative)' },
          { title: 'Best Fit', detail: 'Kisan Credit Card + NABARD linked products' },
        ],
        intent: 'tractor',
      }
    }

    return {
      response: 'Share loan purpose and amount. I will suggest the right government-backed option.',
      suggestions: ['Crop loan', 'Tractor loan', 'Irrigation loan'],
      cards: [],
      intent: 'loan_general',
    }
  }

  if (page === 'apply') {
    return {
      response: 'You can submit details by typing now, or use mic/call flow for assisted application.',
      suggestions: ['Auto-fill via voice', 'Call support agent', 'Submit application'],
      cards: [],
      intent: memoryIntent || 'apply',
    }
  }

  return {
    response: 'I can route you to schemes, mandi rates, loan estimate, and application support.',
    suggestions: ['Open schemes', 'Open mandi', 'Start application'],
    cards: [],
    intent: memoryIntent || 'general',
  }
}

function App() {
  const [onboardingStep, setOnboardingStep] = useState('language')
  const [profile, setProfile] = useState({ name: '', mobile: '', language: '' })
  const [currentPage, setCurrentPage] = useState('home')
  const [voiceState, setVoiceState] = useState('idle')
  const [query, setQuery] = useState('')
  const [memoryIntent, setMemoryIntent] = useState('general')
  const [assistantState, setAssistantState] = useState({
    query: 'Bolkar apni samasya bataiye.',
    response: 'Main aapko schemes, mandi, loan aur application me help karunga.',
    suggestions: ['Open schemes', 'Check mandi price', 'Start application'],
    cards: [],
  })
  const [history, setHistory] = useState([])
  const [applicationMode, setApplicationMode] = useState('typing')
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    village: '',
    serviceNeeded: '',
    notes: '',
  })

  useEffect(() => {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.profile)
    const storedHistory = localStorage.getItem(STORAGE_KEYS.history)

    if (storedProfile) {
      const parsed = JSON.parse(storedProfile)
      setProfile(parsed)
      setOnboardingStep('done')
    }

    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history))
  }, [history])

  const greeting = useMemo(() => {
    if (!profile.name) return 'Namaste'
    return `Namaste, ${profile.name}`
  }, [profile.name])

  const submitProfile = (event) => {
    event.preventDefault()
    const isMobileValid = /^\d{10}$/.test(profile.mobile)

    if (!profile.language || !profile.name.trim() || !isMobileValid) {
      window.alert('Please select language, enter name, and provide a valid 10-digit mobile number.')
      return
    }

    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile))
    setOnboardingStep('done')
  }

  const runAssistant = (incomingQuery, source = 'text') => {
    if (!incomingQuery.trim()) return

    setVoiceState('processing')

    setTimeout(() => {
      const result = createAssistantReply({ query: incomingQuery, page: currentPage, memoryIntent })
      setAssistantState({
        query: incomingQuery,
        response: result.response,
        suggestions: result.suggestions,
        cards: result.cards,
      })

      setMemoryIntent(result.intent || memoryIntent)
      setVoiceState(source === 'voice' ? 'speaking' : 'idle')

      if (result.redirect) {
        setCurrentPage(result.redirect)
      }

      const record = {
        id: Date.now(),
        query: incomingQuery,
        response: result.response,
        page: currentPage,
        timestamp: new Date().toISOString(),
      }

      setHistory((prev) => [record, ...prev].slice(0, 30))
      setQuery('')

      if (source === 'voice') {
        setTimeout(() => setVoiceState('idle'), 900)
      }
    }, 700)
  }

  const startMicFlow = () => {
    setVoiceState('listening')

    setTimeout(() => {
      const spoken = window.prompt('Speak command (type here for now):', 'Mujhe tractor lena hai')
      if (!spoken) {
        setVoiceState('idle')
        return
      }
      runAssistant(spoken, 'voice')
    }, 600)
  }

  const applyVoiceAutofill = () => {
    setApplicationMode('voice')
    setApplicationForm((prev) => ({
      ...prev,
      fullName: prev.fullName || profile.name,
      village: prev.village || 'Rampur',
      serviceNeeded: prev.serviceNeeded || (memoryIntent === 'tractor' ? 'Tractor Subsidy + Loan' : 'PM-KISAN Guidance'),
      notes: prev.notes || 'Auto-captured from assistant context.',
    }))
  }

  const submitApplication = (event) => {
    event.preventDefault()
    if (!applicationForm.fullName || !applicationForm.village || !applicationForm.serviceNeeded) {
      window.alert('Please fill required fields before submit.')
      return
    }

    window.alert('Application saved in frontend prototype. Backend integration can be added next.')
    setApplicationForm({
      fullName: profile.name,
      village: '',
      serviceNeeded: '',
      notes: '',
    })
  }

  const renderPageContent = () => {
    if (currentPage === 'home') {
      return (
        <div>
          <div className="card rustic-card">
            <div className="card-content">
              <span className="card-title">{greeting}</span>
              <p>Choose a service below or ask the assistant at the top. Voice can redirect you anywhere.</p>
            </div>
          </div>

          <div className="service-grid">
            {PAGES.filter((p) => p.id !== 'history').map((page) => (
              <button key={page.id} className="card service-card" onClick={() => setCurrentPage(page.id)}>
                <div className="card-content">
                  <span className="material-icons">{page.icon}</span>
                  <h6>{page.label}</h6>
                  <p>Open {page.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (currentPage === 'schemes') {
      const cards = assistantState.cards.length ? assistantState.cards : DEFAULT_CARD_DATA.schemes
      return (
        <div className="card rustic-card">
          <div className="card-content">
            <span className="card-title">Recommended Schemes</span>
            <ul className="collection">
              {cards.map((item) => (
                <li key={item.title} className="collection-item">
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }

    if (currentPage === 'mandi') {
      const cards = assistantState.cards.length ? assistantState.cards : DEFAULT_CARD_DATA.mandi
      return (
        <div className="card rustic-card">
          <div className="card-content">
            <span className="card-title">Nearby Market Prices</span>
            <ul className="collection">
              {cards.map((item) => (
                <li key={item.title} className="collection-item">
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }

    if (currentPage === 'loan') {
      return (
        <div className="card rustic-card">
          <div className="card-content">
            <span className="card-title">Loan Estimator</span>
            <p>Ask: "Mujhe tractor loan chahiye" to auto-generate a suggested loan setup.</p>
            {(assistantState.cards || []).length > 0 && (
              <ul className="collection top-gap">
                {assistantState.cards.map((item) => (
                  <li key={item.title} className="collection-item">
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )
    }

    if (currentPage === 'apply') {
      return (
        <div className="card rustic-card">
          <div className="card-content">
            <span className="card-title">Apply for Service</span>

            <div className="mode-row">
              <button className={`btn-small ${applicationMode === 'typing' ? 'amber darken-3' : 'brown lighten-1'}`} onClick={() => setApplicationMode('typing')}>
                Typing
              </button>
              <button className={`btn-small ${applicationMode === 'voice' ? 'amber darken-3' : 'brown lighten-1'}`} onClick={applyVoiceAutofill}>
                Voice
              </button>
              <button className={`btn-small ${applicationMode === 'call' ? 'amber darken-3' : 'brown lighten-1'}`} onClick={() => setApplicationMode('call')}>
                Call
              </button>
            </div>

            {applicationMode === 'call' ? (
              <div className="call-box">
                <p>Call assisted center: <strong>1800-120-4455</strong></p>
                <p>An operator can complete the same form over phone.</p>
              </div>
            ) : (
              <form onSubmit={submitApplication} className="top-gap">
                <div className="input-field">
                  <input
                    id="fullName"
                    value={applicationForm.fullName}
                    onChange={(e) => setApplicationForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  />
                  <label className="active" htmlFor="fullName">Full Name</label>
                </div>
                <div className="input-field">
                  <input
                    id="village"
                    value={applicationForm.village}
                    onChange={(e) => setApplicationForm((prev) => ({ ...prev, village: e.target.value }))}
                  />
                  <label className="active" htmlFor="village">Village</label>
                </div>
                <div className="input-field">
                  <input
                    id="serviceNeeded"
                    value={applicationForm.serviceNeeded}
                    onChange={(e) => setApplicationForm((prev) => ({ ...prev, serviceNeeded: e.target.value }))}
                  />
                  <label className="active" htmlFor="serviceNeeded">Service Needed</label>
                </div>
                <div className="input-field">
                  <textarea
                    id="notes"
                    className="materialize-textarea"
                    value={applicationForm.notes}
                    onChange={(e) => setApplicationForm((prev) => ({ ...prev, notes: e.target.value }))}
                  />
                  <label className="active" htmlFor="notes">Notes</label>
                </div>
                <button type="submit" className="btn waves-effect amber darken-3">Submit Application</button>
              </form>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="card rustic-card">
        <div className="card-content">
          <span className="card-title">Past Conversations</span>
          {history.length === 0 ? (
            <p>No conversation yet.</p>
          ) : (
            <ul className="collection">
              {history.map((item) => (
                <li className="collection-item" key={item.id}>
                  <strong>You:</strong> {item.query}
                  <br />
                  <strong>AI:</strong> {item.response}
                  <div className="history-meta">{item.page} | {formatTime(item.timestamp)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  if (onboardingStep !== 'done') {
    return (
      <div className="onboarding-wrap">
        <div className="card onboarding-card">
          <div className="card-content">
            <h4>GraamSeva</h4>
            <p>Voice-first support for rural citizens.</p>

            {onboardingStep === 'language' ? (
              <div className="top-gap">
                <p className="section-label">Choose your language</p>
                <div className="chip-grid">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      className={`chip selectable-chip ${profile.language === lang.code ? 'selected-chip' : ''}`}
                      onClick={() => {
                        setProfile((prev) => ({ ...prev, language: lang.code }))
                        setOnboardingStep('profile')
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={submitProfile} className="top-gap">
                <div className="input-field">
                  <input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  />
                  <label className="active" htmlFor="name">Name</label>
                </div>
                <div className="input-field">
                  <input
                    id="mobile"
                    value={profile.mobile}
                    maxLength={10}
                    onChange={(e) => setProfile((prev) => ({ ...prev, mobile: e.target.value.replace(/\D/g, '') }))}
                  />
                  <label className="active" htmlFor="mobile">Mobile Number</label>
                </div>
                <button className="btn waves-effect amber darken-3" type="submit">Continue</button>
                <button type="button" className="btn-flat" onClick={() => setOnboardingStep('language')}>Back</button>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="top-header">
        <div>
          <h5>GraamSeva</h5>
          <p>{greeting}</p>
        </div>
        <button className="btn-flat" onClick={() => setOnboardingStep('language')}>Reset</button>
      </header>

      <section className="assistant-box card">
        <div className="card-content">
          <div className="assistant-head">
            <div>
              <strong>GraamSeva Assistant</strong>
              <p className="voice-state">State: {voiceState}</p>
            </div>
            <button className="btn-floating amber darken-3" onClick={startMicFlow}>
              <span className="material-icons">mic</span>
            </button>
          </div>

          <p className="dialog-line"><strong>You:</strong> {assistantState.query}</p>
          <p className="dialog-line"><strong>AI:</strong> {assistantState.response}</p>

          <div className="suggestion-row">
            {assistantState.suggestions.map((s) => (
              <button key={s} className="chip selectable-chip" onClick={() => runAssistant(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="assistant-input-row">
            <input
              className="browser-default"
              placeholder="Type your question"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runAssistant(query)}
            />
            <button className="btn waves-effect amber darken-3" onClick={() => runAssistant(query)}>Send</button>
          </div>
        </div>
      </section>

      <main className="content-area">{renderPageContent()}</main>

      <nav className="bottom-nav">
        <div className="nav-wrapper brown darken-3">
          <ul className="bottom-tabs">
            {PAGES.map((page) => (
              <li key={page.id}>
                <button
                  className={`tab-btn ${currentPage === page.id ? 'tab-active' : ''}`}
                  onClick={() => setCurrentPage(page.id)}
                >
                  <span className="material-icons">{page.icon}</span>
                  <small>{page.label}</small>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default App