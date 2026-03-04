import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage'
import VoiceInputPage from './pages/VoiceInputPage'
import ServicesPage from './pages/ServicesPage'
import EligibilityPage from './pages/EligibilityPage'
import DashboardPage from './pages/DashboardPage'
import ApplicationPage from './pages/ApplicationPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang)
    setCurrentPage('voice-input')
  }

  const handleVoiceComplete = (data) => {
    setUserProfile(data)
    setCurrentPage('services')
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setCurrentPage('eligibility')
  }

  const handleApplyNow = () => {
    setCurrentPage('application')
  }

  const handleNavigateTo = (page) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onLanguageSelect={handleLanguageSelect} />
      case 'voice-input':
        return (
          <VoiceInputPage
            language={selectedLanguage}
            onComplete={handleVoiceComplete}
            onBack={() => setCurrentPage('home')}
          />
        )
      case 'services':
        return (
          <ServicesPage
            userProfile={userProfile}
            language={selectedLanguage}
            onServiceSelect={handleServiceSelect}
            onBack={() => setCurrentPage('home')}
          />
        )
      case 'eligibility':
        return (
          <EligibilityPage
            service={selectedService}
            userProfile={userProfile}
            language={selectedLanguage}
            onApplyNow={handleApplyNow}
            onBack={() => setCurrentPage('services')}
          />
        )
      case 'application':
        return (
          <ApplicationPage
            service={selectedService}
            userProfile={userProfile}
            language={selectedLanguage}
            onBack={() => setCurrentPage('eligibility')}
          />
        )
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigateTo} />
      default:
        return <HomePage onLanguageSelect={handleLanguageSelect} />
    }
  }

  return <div className="app-container">{renderPage()}</div>
}

export default App
