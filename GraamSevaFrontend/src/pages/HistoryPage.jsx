import { formatTime } from '../lib/assistant'

export default function HistoryPage({ tr, history }) {
  return (
    <div className="card rustic-card">
      <div className="card-content">
        <span className="card-title">{tr.pages.history}</span>
        {history.length === 0 ? (
          <p>{tr.noHistory}</p>
        ) : (
          <ul className="collection">
            {history.map((item) => (
              <li className="collection-item" key={item.id}>
                <strong>{tr.you}:</strong> {item.query}
                <br />
                <strong>{tr.ai}:</strong> {item.response}
                <div className="history-meta">{item.page} | {formatTime(item.timestamp)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}