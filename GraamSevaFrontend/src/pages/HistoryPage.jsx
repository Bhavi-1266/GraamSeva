import { useMemo } from 'react'
import { STORAGE_KEYS } from '../constants/appConfig'
import { t } from '../lib/i18n'

export default function HistoryPage({ tr, uiLanguage, chatThreads = [], onOpenChat, onClearHistory }) {
  const sortedThreads = useMemo(() => {
    return [...chatThreads].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [chatThreads])

  const clearHistory = () => {
    if (window.confirm(t(uiLanguage, 'historyConfirm'))) {
      localStorage.removeItem(STORAGE_KEYS.history)
      setHistory([])
    }
  }

  return (
    <div className="card rustic-card">
      <div className="card-content">
        <div className="flex justify-between items-center mb-3">
          <span className="card-title">{t(uiLanguage, 'pages.history')}</span>
          {history.length > 0 && (
            <button
              className="btn-small waves-effect red lighten-1"
              onClick={clearHistory}
            >
              {t(uiLanguage, 'historyClear')}
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p>{t(uiLanguage, 'historyEmpty')}</p>
        ) : (
          <ul className="collection">
            {history.map((item) => (
              <li className="collection-item" key={item.id}>
                <strong>{t(uiLanguage, 'you')}:</strong> {item.query}
                <br />
                <strong>{t(uiLanguage, 'ai')}:</strong> {item.response}
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
