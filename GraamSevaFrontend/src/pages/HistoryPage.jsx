import { useState, useEffect } from 'react'
import { formatTime } from '../lib/assistant'
import { STORAGE_KEYS } from '../constants/appConfig'

export default function HistoryPage({ tr, uiLanguage }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEYS.history)
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory))
      }
    } catch (err) {
      console.error("Failed to load history:", err)
    }
  }

  const clearHistory = () => {
    const confirmMsg = uiLanguage === 'hi' 
      ? 'क्या आप सभी इतिहास हटाना चाहते हैं?' 
      : 'Are you sure you want to clear all history?'
    
    if (window.confirm(confirmMsg)) {
      localStorage.removeItem(STORAGE_KEYS.history)
      setHistory([])
    }
  }

  return (
    <div className="card rustic-card">
      <div className="card-content">
        <div className="flex justify-between items-center mb-3">
          <span className="card-title">{tr.pages.history}</span>
          {history.length > 0 && (
            <button 
              className="btn-small waves-effect red lighten-1"
              onClick={clearHistory}
            >
              {uiLanguage === 'hi' ? 'साफ करें' : 'Clear'}
            </button>
          )}
        </div>
        
        {history.length === 0 ? (
          <p>{tr.noHistory || (uiLanguage === 'hi' ? 'कोई इतिहास नहीं है।' : 'No history available.')}</p>
        ) : (
          <ul className="collection">
            {history.map((item) => (
              <li className="collection-item" key={item.id}>
                <strong>{tr.you || (uiLanguage === 'hi' ? 'आप' : 'You')}:</strong> {item.query}
                <br />
                <strong>{tr.ai || (uiLanguage === 'hi' ? 'AI' : 'AI')}:</strong> {item.response}
                <div className="history-meta">
                  {item.page} | {formatTime(item.timestamp)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}