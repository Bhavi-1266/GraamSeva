import { useEffect, useMemo, useState } from "react"
import "./App.css"
import { PAGES, STORAGE_KEYS, UI_LANGUAGE_MAP } from "./constants/appConfig"
import { TRANSLATIONS, getUiLanguage } from "./lib/i18n"
import OnboardingPage from "./pages/OnboardingPage"
import HomePage from "./pages/HomePage"
import SchemesPage from "./pages/SchemesPage"
import MandiPage from "./pages/MandiPage"
import LoanPage from "./pages/LoanPage"
import ApplyPage from "./pages/ApplyPage"
import HistoryPage from "./pages/HistoryPage"

function App() {

  const [onboardingStep, setOnboardingStep] = useState("language")
  const [profile, setProfile] = useState({ name: "", mobile: "", language: "" })
  const [currentPage, setCurrentPage] = useState("home")

  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantPopup, setAssistantPopup] = useState(null)

  const uiLanguage = getUiLanguage(profile.language, UI_LANGUAGE_MAP)
  const tr = TRANSLATIONS[uiLanguage]

  /*
  -----------------------------
  ASSISTANT REQUEST
  -----------------------------
  */

  const runAssistant = async (incomingQuery) => {

    if (!incomingQuery?.trim()) return

    try {

      const controller = new AbortController()

      const timeout = setTimeout(() => controller.abort(), 5000)

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          query: incomingQuery,
          language: uiLanguage
        })
      })

      clearTimeout(timeout)

      if (!res.ok) throw new Error("API error")

      let data = await res.json()

      if (!data || !data.result) {
        data = MOCK_ASSISTANT_RESPONSE
      }

      handleAssistantResponse(data)

    } catch (err) {

      console.warn("Assistant failed, using mock:", err)

      handleAssistantResponse(MOCK_ASSISTANT_RESPONSE)

    }
  }

  /*
  -----------------------------
  ASSISTANT RESPONSE
  -----------------------------
  */

  const handleAssistantResponse = (data) => {

    setAssistantPopup(data.result)

    if (data.redirect) {
      setCurrentPage(data.redirect)
    }

    if (data.speak) {

      const speech = new SpeechSynthesisUtterance(data.speak)

      speech.lang = uiLanguage === "hi" ? "hi-IN" : "en-US"

      window.speechSynthesis.speak(speech)
    }

  }

  /*
  -----------------------------
  LOAD PROFILE
  -----------------------------
  */

  useEffect(() => {

    const storedProfile = localStorage.getItem(STORAGE_KEYS.profile)

    if (storedProfile) {

      const parsed = JSON.parse(storedProfile)

      setProfile(parsed)

      setOnboardingStep("done")

    }

  }, [])

  /*
  -----------------------------
  GREETING
  -----------------------------
  */

  const greeting = useMemo(() => {

    if (!profile.name) return tr.greeting

    return `${tr.greeting}, ${profile.name}`

  }, [profile.name, tr.greeting])

  /*
  -----------------------------
  PROFILE SUBMIT
  -----------------------------
  */

  const submitProfile = (event) => {

    event.preventDefault()

    const isMobileValid = /^\d{10}$/.test(profile.mobile)

    if (!profile.language || !profile.name.trim() || !isMobileValid) {

      window.alert(tr.invalidProfile)

      return

    }

    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile))

    setOnboardingStep("done")

  }

  /*
  -----------------------------
  PAGE RENDERER
  -----------------------------
  */

  const renderPage = () => {

    switch (currentPage) {

      case "home":
        return <HomePage tr={tr} onNavigate={setCurrentPage} uiLanguage={uiLanguage} profile={profile} />

      case "schemes":
        return <SchemesPage tr={tr} uiLanguage={uiLanguage} />

      case "mandi":
        return <MandiPage tr={tr} uiLanguage={uiLanguage} />

      case "loan":
        return <LoanPage tr={tr} uiLanguage={uiLanguage} />

      case "apply":
        return <ApplyPage tr={tr} uiLanguage={uiLanguage} profile={profile} />

      case "history":
        return <HistoryPage tr={tr} uiLanguage={uiLanguage} />

      default:
        return <HomePage tr={tr} onNavigate={setCurrentPage} uiLanguage={uiLanguage} profile={profile} />

    }

  }

  /*
  -----------------------------
  ONBOARDING
  -----------------------------
  */

  if (onboardingStep !== "done") {

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

  /*
  -----------------------------
  MAIN UI
  -----------------------------
  */

  return (

    <div className="app-shell">

      <header className="top-header">

        <div>
          <h5>{tr.appName}</h5>
          <p>{greeting}</p>
        </div>

        <button className="btn-flat" onClick={() => setOnboardingStep("language")}>
          {tr.reset}
        </button>

      </header>

      

      <AssistantPopup
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        onRunAssistant={runAssistant}
      />

      <AssistantResultPopup
        data={assistantPopup}
        onClose={() => setAssistantPopup(null)}
      />

      <main className="content-area">
        <AssistantIsland
        onRunAssistant={runAssistant}
        onOpen={() => setAssistantOpen(true)}
      />
        {renderPage()}
      </main>

      <nav className="bottom-nav">

        <div className="nav-wrapper brown darken-3">

          <ul className="grid grid-cols-6 w-full text-white">

            {PAGES.map((page) => (

              <li key={page.id}>

                <button
                  className={`w-full border-none bg-transparent text-white/80 flex flex-col items-center justify-center 
                  min-h-[58px] text-[0.72rem] cursor-pointer py-2 px-1 gap-1
                  ${currentPage === page.id ? "text-yellow-100" : ""}`}
                  onClick={() => setCurrentPage(page.id)}
                >

                  <span className="material-icons text-[20px]">
                    {page.icon}
                  </span>

                  <small className="leading-none">
                    {tr.pages[page.id]}
                  </small>

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


/*
---------------------------------------
ASSISTANT ISLAND
---------------------------------------
*/

function AssistantIsland({ onOpen, onRunAssistant }) {

  const [query, setQuery] = useState("")

  const submit = () => {

    if (!query.trim()) return

    onRunAssistant(query)

    setQuery("")

  }

  return (

    <div >

      <div className="flex items-center gap-2 bg-white shadow-lg px-4 py-2 mb-3 rounded-full">

        <button onClick={onOpen}>
          <span className="material-icons">smart_toy</span>
        </button>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Ask GraamSeva..."
          className="outline-none text-sm w-[150px]"
        />

        <button onClick={submit}>
          <span className="material-icons">send</span>
        </button>

        <button>
          <span className="material-icons">mic</span>
        </button>

      </div>

    </div>

  )
}


/*
---------------------------------------
ASSISTANT POPUP CHAT
---------------------------------------
*/

function AssistantPopup({ open, onClose, onRunAssistant }) {

  const [query, setQuery] = useState("")

  if (!open) return null

  return (

    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end">

      <div className="bg-white w-full max-w-lg rounded-t-xl p-4">

        <div className="flex justify-between mb-3">
          <h4>GraamSeva Assistant</h4>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">

          {["loan chahiye", "barish kab aayegi", "tractor subsidy", "mandi bhav"].map((p) => (

            <button
              key={p}
              onClick={() => onRunAssistant(p)}
              className="chip"
            >
              {p}
            </button>

          ))}

        </div>

        <div className="flex gap-2">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onRunAssistant(query)}
            className="border rounded px-3 py-2 flex-1"
            placeholder="Ask anything..."
          />

          <button
            className="btn amber"
            onClick={() => onRunAssistant(query)}
          >
            Send
          </button>

        </div>

      </div>

    </div>

  )
}


/*
---------------------------------------
RESULT POPUP
---------------------------------------
*/

function AssistantResultPopup({ data, onClose }) {

  if (!data) return null

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">

        <h5 className="text-lg font-semibold mb-3">
          Results
        </h5>

        {data.items?.map((item, i) => (

          <div key={i} className="bg-gray-50 p-3 rounded mb-2">

            {Object.entries(item).map(([k, v]) => (

              <p key={k} className="text-sm">
                <strong>{k}:</strong> {v}
              </p>

            ))}

          </div>

        ))}

        <button className="btn amber mt-4" onClick={onClose}>
          Close
        </button>

      </div>

    </div>

  )
}


/*
---------------------------------------
MOCK RESPONSE
---------------------------------------
*/

const MOCK_ASSISTANT_RESPONSE = {

  message: "These are some tractor loan options you may consider.",

  speak: "Here are some tractor loan options.",

  redirect: "loan",

  result: {

    items: [

      {
        Bank: "SBI Tractor Loan",
        Amount: "₹5,00,000",
        Interest: "7%",
        Tenure: "5 years"
      },

      {
        Bank: "HDFC Tractor Finance",
        Amount: "₹4,50,000",
        Interest: "7.5%",
        Tenure: "4 years"
      },

      {
        Bank: "NABARD Farm Equipment Loan",
        Amount: "₹6,00,000",
        Interest: "6.8%",
        Tenure: "6 years"
      }

    ]

  }

}