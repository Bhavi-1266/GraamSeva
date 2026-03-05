import { PAGES } from '../constants/appConfig'

export default function HomePage({ tr, onNavigate, locationState, onRequestLocation, uiLanguage }) {
  const openText = tr.pages.home === 'होम' ? 'खोलें' : 'Open'
  const actionText = locationState.data ? tr.locationRefresh : tr.locationEnable

  return (
    <div>
      {/* <div className="card rustic-card">
        <div className="card-content">
          <span className="card-title">{tr.homeTitle}</span>
          <p>{tr.homeSubtitle}</p>
        </div>
      </div> */}

      {/* <div className="card rustic-card top-gap">
        <div className="card-content">
          <span className="card-title">{tr.locationTitle}</span>
          {locationState.status === 'requesting' && <p>{tr.locationPending}</p>}
          {locationState.error && <p className="location-error">{tr.locationError}</p>}
          {!locationState.data && locationState.status !== 'requesting' && !locationState.error && (
            <p>{tr.locationUnknown}</p>
          )}
          {locationState.data && (
            <p>
              {tr.locationUsing} <strong>{locationState.data.displayName || locationState.data.district || locationState.data.state}</strong>
            </p>
          )}
          <button className="btn waves-effect amber darken-3 top-gap" onClick={onRequestLocation}>
            {actionText}
          </button>
          
        </div>
      </div> */}

      <div className="service-grid">
        {PAGES.filter((p) => p.id !== 'history').map((page) => (
          <button key={page.id} className="card service-card" onClick={() => onNavigate(page.id)}>
            <div className="card-content">
              <span className="material-icons">{page.icon}</span>
              <h6>{tr.pages[page.id]}</h6>
              <p>{tr.pages[page.id]} {openText}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

