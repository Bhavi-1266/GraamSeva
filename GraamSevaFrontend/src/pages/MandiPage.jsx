import { useState, useEffect } from "react"
import mandiService from "../services/mandiService"

export default function MandiPage({ tr, uiLanguage }) {
  const [mandiPrices, setMandiPrices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMandiPrices()
  }, [uiLanguage])

  const loadMandiPrices = async () => {
    try {
      setLoading(true)
      const result = await mandiService.getMandiPrices(uiLanguage)
      setMandiPrices(result.data)
      console.log(`Mandi prices loaded from ${result.source}:`, result.data)
    } catch (err) {
      console.error("Failed to load mandi prices:", err)
    } finally {
      setLoading(false)
    }
  }

  const title = uiLanguage === 'hi' ? 'आज की मंडी भाव' : 'Today\'s Market Prices'

  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{title}</span>
        
        {loading ? (
          <div className="center-align py-4">
            <p>{uiLanguage === 'hi' ? 'मंडी भाव लोड हो रहे हैं...' : 'Loading market prices...'}</p>
          </div>
        ) : (
          <ul className="collection">
            {mandiPrices.map((item) => (
              <li key={item.id || item.title} className="collection-item">
                <div className="flex justify-between items-start">
                  <div>
                    <strong>{item.title}</strong>
                    <p className="text-sm text-gray-600">{item.location}</p>
                    <p className="text-xs text-gray-500">{item.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">{item.price}</p>
                    {item.change && (
                      <p className={`text-xs ${
                        item.trend === 'up' ? 'text-green-600' : 
                        item.trend === 'down' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'} {item.change}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}