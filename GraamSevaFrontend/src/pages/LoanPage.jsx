import { useState, useEffect } from "react"
import loanService from "../services/loanService"
import { t } from "../lib/i18n"

export default function LoanPage({ tr, uiLanguage }) {
  const [loanOptions, setLoanOptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLoanOptions()
  }, [uiLanguage])

  const loadLoanOptions = async () => {
    try {
      setLoading(true)
      const result = await loanService.getLoanOptions(uiLanguage)
      setLoanOptions(result.data)
      console.log(`Loan options loaded from ${result.source}:`, result.data)
    } catch (err) {
      console.error("Failed to load loan options:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{t(uiLanguage, 'loanTitle')}</span>
        <p className="mb-4 text-gray-600">{t(uiLanguage, 'loanSubtitle')}</p>

        {loading ? (
          <div className="center-align py-4">
            <p>{t(uiLanguage, 'loanLoading')}</p>
          </div>
        ) : (
          <ul className="collection top-gap">
            {loanOptions.map((item) => (
              <li key={item.id || item.title} className="collection-item">
                <div className="mb-2">
                  <strong className="text-lg">{item.title}</strong>
                  <div className="flex gap-3 mt-1 text-xs">
                    <span className="bg-blue-100 px-2 py-1 rounded">💰 {item.amount}</span>
                    <span className="bg-green-100 px-2 py-1 rounded">📊 {item.interest}</span>
                    <span className="bg-yellow-100 px-2 py-1 rounded">⏱️ {item.tenure}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{item.detail}</p>
                {item.eligibility && (
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>{t(uiLanguage, 'loanEligibility')}</strong> {item.eligibility}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}