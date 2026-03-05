import { PAGES } from '../constants/appConfig'

export default function HomePage({ tr, onNavigate }) {
  return (
    <div>
      <div className="card rustic-card">
        <div className="card-content">
          <span className="card-title">{tr.homeTitle}</span>
          <p>{tr.homeSubtitle}</p>
        </div>
      </div>

      <div className="service-grid">
        {PAGES.filter((p) => p.id !== 'history').map((page) => (
          <button key={page.id} className="card service-card" onClick={() => onNavigate(page.id)}>
            <div className="card-content">
              <span className="material-icons">{page.icon}</span>
              <h6>{tr.pages[page.id]}</h6>
              <p>{tr.pages[page.id]} {tr.pages.home === '???' ? '?????' : 'Open'}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}