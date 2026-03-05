import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { PAGES, STORAGE_KEYS, UI_LANGUAGE_MAP } from './constants/appConfig'
import { createAssistantReply } from './lib/assistant'
import { TRANSLATIONS, getCards, getUiLanguage } from './lib/i18n'
import { getLocationLabel, resolveCurrentLocation } from './lib/location'
import AssistantBar from './components/AssistantBar'
import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import SchemesPage from './pages/SchemesPage'
import MandiPage from './pages/MandiPage'
import LoanPage from './pages/LoanPage'
import ApplyPage from './pages/ApplyPage'
import HistoryPage from './pages/HistoryPage'

function App() {
  const [onboardingStep, setOnboardingStep] = useState('language')
  const [profile, setProfile] = useState({ name: '', mobile: '', language: '' })
  const [currentPage, setCurrentPage] = useState('home')
  const [voiceState, setVoiceState] = useState('idle')
  const [query, setQuery] = useState('')
  const [memoryIntent, setMemoryIntent] = useState('general')
  const [assistantState, setAssistantState] = useState({
    query: 'बोलकर अपनी समस्या बताइए।',
    response: 'मैं आपकी मदद के लिए तैयार हूँ।',
    suggestions: ['योजनाएं खोलें', 'मंडी भाव देखें', 'आवेदन शुरू करें'],
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
  const [locationState, setLocationState] = useState({
    status: 'idle',
    data: null,
    error: '',
  })

  useEffect(() => {
    const storedProfile = localStorage.getItem(STORAGE_KEYS.profile)
    const storedHistory = localStorage.getItem(STORAGE_KEYS.history)
    const storedLocation = localStorage.getItem(STORAGE_KEYS.location)

    if (storedProfile) {
      const parsed = JSON.parse(storedProfile)
      setProfile(parsed)
      setOnboardingStep('done')
    }

    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }

    if (storedLocation) {
      setLocationState({
        status: 'ready',
        data: JSON.parse(storedLocation),
        error: '',
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (locationState.data) {
      localStorage.setItem(STORAGE_KEYS.location, JSON.stringify(locationState.data))
    }
  }, [locationState.data])

  const uiLanguage = getUiLanguage(profile.language, UI_LANGUAGE_MAP)
  const tr = TRANSLATIONS[uiLanguage]
  const locationLabel = getLocationLabel(locationState.data)
  const cards = getCards(uiLanguage, locationLabel)

  const greeting = useMemo(() => {
    if (!profile.name) return tr.greeting
    return `${tr.greeting}, ${profile.name}`
  }, [profile.name, tr.greeting])

  const submitProfile = (event) => {
    event.preventDefault()
    const isMobileValid = /^\d{10}$/.test(profile.mobile)

    if (!profile.language || !profile.name.trim() || !isMobileValid) {
      window.alert(tr.invalidProfile)
      return
    }

    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile))
    setOnboardingStep('done')
  }

  const requestLocation = async () => {
    setLocationState((prev) => ({ ...prev, status: 'requesting', error: '' }))
    try {
      const resolved = await resolveCurrentLocation(profile.language || 'hi')
      setLocationState({ status: 'ready', data: resolved, error: '' })
    } catch {
      setLocationState((prev) => ({ ...prev, status: 'error', error: 'LOCATION_FAILED' }))
    }
  }

  useEffect(() => {
    if (onboardingStep === 'done' && locationState.status === 'idle' && !locationState.data) {
      requestLocation()
    }
  }, [onboardingStep, locationState.status, locationState.data])

  const runAssistant = (incomingQuery, source = 'text') => {
    if (!incomingQuery.trim()) return

    setVoiceState('processing')

    setTimeout(() => {
      const result = createAssistantReply({
        query: incomingQuery,
        page: currentPage,
        memoryIntent,
        lang: uiLanguage,
        pageLabels: tr.pages,
        cards,
        location: locationState.data,
      })

      setAssistantState({
        query: incomingQuery,
        response: result.response,
        suggestions: result.suggestions,
        cards: result.cards,
      })

      setMemoryIntent(result.intent || memoryIntent)
      setVoiceState(source === 'voice' ? 'speaking' : 'idle')

      if (result.redirect) setCurrentPage(result.redirect)

      setHistory((prev) => [
        {
          id: Date.now(),
          query: incomingQuery,
          response: result.response,
          page: tr.pages[currentPage] || currentPage,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 30))

      setQuery('')

      if (source === 'voice') {
        setTimeout(() => setVoiceState('idle'), 900)
      }
    }, 700)
  }

  const startMicFlow = () => {
    setVoiceState('listening')

    setTimeout(() => {
      const spoken = window.prompt(
        uiLanguage === 'hi' ? 'अपना कमांड बोलें (अभी टाइप करके दें):' : 'Speak command (type here for now):',
        uiLanguage === 'hi' ? 'मुझे ट्रैक्टर लेना है' : 'Mujhe tractor lena hai',
      )

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
      village: prev.village || (locationState.data?.village || locationState.data?.district || (uiLanguage === 'hi' ? 'रामपुर' : 'Rampur')),
      serviceNeeded:
        prev.serviceNeeded ||
        (memoryIntent === 'tractor'
          ? uiLanguage === 'hi'
            ? 'ट्रैक्टर सब्सिडी + लोन'
            : 'Tractor Subsidy + Loan'
          : uiLanguage === 'hi'
            ? 'पीएम-किसान मार्गदर्शन'
            : 'PM-KISAN Guidance'),
      notes:
        prev.notes ||
        (uiLanguage === 'hi'
          ? 'सहायक संदर्भ से ऑटो-कैप्चर किया गया।'
          : 'Auto-captured from assistant context.'),
    }))
  }

  const submitApplication = (event) => {
    event.preventDefault()

    if (!applicationForm.fullName || !applicationForm.village || !applicationForm.serviceNeeded) {
      window.alert(
        uiLanguage === 'hi'
          ? 'कृपया जमा करने से पहले जरूरी जानकारी भरें।'
          : 'Please fill required fields before submit.',
      )
      return
    }

    window.alert(
      uiLanguage === 'hi'
        ? 'आवेदन फ्रंटएंड प्रोटोटाइप में सेव हो गया। बैकएंड इंटीग्रेशन अगला कदम है।'
        : 'Application saved in frontend prototype. Backend integration can be added next.',
    )

    setApplicationForm({
      fullName: profile.name,
      village: '',
      serviceNeeded: '',
      notes: '',
    })
  }

  const renderPage = () => {
    if (currentPage === 'home') {
      return (
        <HomePage
          tr={tr}
          onNavigate={setCurrentPage}
          locationState={locationState}
          onRequestLocation={requestLocation}
          uiLanguage={uiLanguage}
        />
      )
    }

    if (currentPage === 'schemes') {
      const sectionCards = assistantState.cards.length ? assistantState.cards : cards.schemes
      return <SchemesPage title={uiLanguage === 'hi' ? 'सुझाई गई योजनाएं' : 'Recommended Schemes'} cards={sectionCards} />
    }

    if (currentPage === 'mandi') {
      const sectionCards = assistantState.cards.length ? assistantState.cards : cards.mandi
      return <MandiPage title={uiLanguage === 'hi' ? 'नजदीकी मंडी भाव' : 'Nearby Market Prices'} cards={sectionCards} />
    }

    if (currentPage === 'loan') {
      return (
        <LoanPage
          title={uiLanguage === 'hi' ? 'लोन आकलन' : 'Loan Estimator'}
          subtitle={
            uiLanguage === 'hi'
              ? '"मुझे ट्रैक्टर लोन चाहिए" बोलकर अनुमान तुरंत देखें।'
              : 'Ask: "Mujhe tractor loan chahiye" to auto-generate a suggested loan setup.'
          }
          cards={assistantState.cards}
        />
      )
    }

    if (currentPage === 'apply') {
      return (
        <ApplyPage
          uiLanguage={uiLanguage}
          applicationMode={applicationMode}
          setApplicationMode={setApplicationMode}
          applyVoiceAutofill={applyVoiceAutofill}
          applicationForm={applicationForm}
          setApplicationForm={setApplicationForm}
          submitApplication={submitApplication}
        />
      )
    }

    return <HistoryPage tr={tr} history={history} />
  }

  if (onboardingStep !== 'done') {
    return (
      <OnboardingPage
        tr={tr}
        profile={profile}
        setProfile={setProfile}
        onboardingStep={onboardingStep}
        setOnboardingStep={setOnboardingStep}
        onSubmit={submitProfile}
      />
    )
  }

  return (
    <div className="app-shell">
      <header className="top-header">
        <div>
          <h5>{tr.appName}</h5>
          <p>{greeting}</p>
        </div>
        <button className="btn-flat" onClick={() => setOnboardingStep('language')}>
          {tr.reset}
        </button>
      </header>

      <AssistantBar
        tr={tr}
        voiceState={voiceState}
        assistantState={assistantState}
        query={query}
        setQuery={setQuery}
        onMic={startMicFlow}
        onRunAssistant={runAssistant}
      />

      <main className="content-area">{renderPage()}</main>

      <nav className="bottom-nav">
        <div className="nav-wrapper brown darken-3">
       <ul className="grid grid-cols-6 w-full  text-white">
            {PAGES.map((page) => (
              <li key={page.id}>
                <button
                  className={`w-full border-none bg-transparent text-white/80 flex flex-col items-center justify-center 
                  min-h-[58px] text-[0.72rem] cursor-pointer py-2 px-1 gap-1
                  ${currentPage === page.id ? "text-yellow-100" : ""}`}
                  onClick={() => setCurrentPage(page.id)}
                >
                  <span className="material-icons text-[20px]">{page.icon}</span>
                  <small className="leading-none">{tr.pages[page.id]}</small>
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