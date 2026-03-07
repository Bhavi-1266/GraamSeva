import { useState, useEffect } from "react"
import schemeService from "../services/schemeService"
import "../styles/SchemesModal.css"

export default function SchemesPage({ uiLanguage }) {
  const [schemes, setSchemes] = useState([])
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchemes()
  }, [uiLanguage])

  const loadSchemes = async () => {
    try {
      setLoading(true)
      const result = await schemeService.getAllSchemes(uiLanguage)
      setSchemes(result.data)
      console.log(`Schemes loaded from ${result.source}:`, result.data)
    } catch (err) {
      console.error("Failed to load schemes:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleClick = async (item) => {
    try {
      const result = await schemeService.getSchemeById(item.id, uiLanguage)
      setSelectedScheme(result.data)
    } catch (err) {
      console.error("Failed to load scheme details", err)
    }
  }

  const closeModal = () => setSelectedScheme(null)

  const title = uiLanguage === "hi" ? "Government Schemes" : "Government Schemes"

  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{title}</span>

        {loading ? (
          <div className="center-align py-4">
            <p>Loading schemes...</p>
          </div>
        ) : (
          <ul className="collection">
            {schemes.map((item) => (
              <li
                key={item.id}
                className="collection-item cursor-pointer hover:bg-gray-100"
                onClick={() => handleClick(item)}
              >
                <strong>{item.name || item.title}</strong>
                <p>{item.desc || item.detail}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedScheme && (
        <div className="scheme-modal-overlay" onClick={closeModal}>
          <div className="scheme-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="scheme-modal-close"
              aria-label="Close scheme details"
            >
              X
            </button>

            <h3 className="scheme-modal-title">{selectedScheme.name}</h3>
            <p className="scheme-modal-desc">{selectedScheme.desc}</p>

            <p className="scheme-modal-meta">
              <strong>Government:</strong> {selectedScheme.governmentLevel}
            </p>

            <p className="scheme-modal-section">Benefits</p>
            <ul className="scheme-modal-list">
              {selectedScheme.benefits?.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <p className="scheme-modal-section">Eligibility</p>
            <ul className="scheme-modal-list">
              <li>Gender: {selectedScheme.eligibility?.gender}</li>
              <li>Marital Status: {selectedScheme.eligibility?.maritalStatus}</li>
              <li>Income Limit: {selectedScheme.eligibility?.incomeLimit}</li>
              <li>Land Requirement: {selectedScheme.eligibility?.landRequired}</li>
            </ul>

            <p className="scheme-modal-section">Documents Required</p>
            <ul className="scheme-modal-list">
              {selectedScheme.documents?.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>

            <p className="scheme-modal-section">How to Apply</p>
            <ul className="scheme-modal-list scheme-modal-list-last">
              {selectedScheme.howToApply?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>

            <div className="scheme-modal-actions">
              <button className="scheme-modal-action primary">Apply for Scheme</button>
              <button className="scheme-modal-action secondary">Ask Eligibility</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
