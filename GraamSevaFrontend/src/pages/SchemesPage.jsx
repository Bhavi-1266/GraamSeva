import { useState, useEffect } from "react"
import schemeService from "../services/schemeService"
import { t } from "../lib/i18n"

export default function SchemesPage({ tr, uiLanguage }) {
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

  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{t(uiLanguage, 'schemesTitle')}</span>

        {loading ? (
          <div className="center-align py-4">
            <p>{t(uiLanguage, 'schemesLoading')}</p>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            className="relative w-[92%] max-w-lg max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-2">{selectedScheme.name}</h3>
            <p className="text-sm text-gray-700 mb-3">{selectedScheme.desc}</p>
            <p className="text-sm mb-2">
              <strong>Government:</strong> {selectedScheme.governmentLevel}
            </p>

            <p className="font-semibold mt-2">Benefits</p>
            <ul className="list-disc ml-5 text-sm mb-3">
              {selectedScheme.benefits?.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <p className="font-semibold">Eligibility</p>
            <ul className="list-disc ml-5 text-sm mb-3">
              <li>Gender: {selectedScheme.eligibility?.gender}</li>
              <li>Marital Status: {selectedScheme.eligibility?.maritalStatus}</li>
              <li>Income Limit: {selectedScheme.eligibility?.incomeLimit}</li>
              <li>Land Requirement: {selectedScheme.eligibility?.landRequired}</li>
            </ul>

            <p className="font-semibold">Documents Required</p>
            <ul className="list-disc ml-5 text-sm mb-3">
              {selectedScheme.documents?.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>

            <p className="font-semibold">How to Apply</p>
            <ul className="list-disc ml-5 text-sm mb-4">
              {selectedScheme.howToApply?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>

            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                {t(uiLanguage, 'applySubmit')}
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {t(uiLanguage, 'applyTitle')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}