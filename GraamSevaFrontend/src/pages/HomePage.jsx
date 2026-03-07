import { useState, useEffect } from 'react'
import { PAGES } from '../constants/appConfig'
import newSchemesOffersService from '../services/newSchemesOffers'
import '../styles/HomePage.css'

export default function HomePage({ tr, onNavigate, uiLanguage }) {
  const openText = 'Open'
  const [newOffers, setNewOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNewOffers()
  }, [uiLanguage])

  const loadNewOffers = async () => {
    try {
      setLoading(true)
      const result = await newSchemesOffersService.getNewSchemes(uiLanguage)
      setNewOffers(result.data)
      console.log(`New offers loaded from ${result.source}:`, result.data)
    } catch (err) {
      console.error('Failed to load new offers:', err)
    } finally {
      setLoading(false)
    }
  }

  const updatesTitle = 'Recent Updates'
  const regularTitle = 'Regular Updates'
  const optionsTitle = 'Home Options'
  const optionsHint = 'Open tabs and services'

  const latestUpdates = newOffers.filter((offer) => offer.type === 'new' || offer.type === 'update')
  const regularUpdates = newOffers.filter((offer) => offer.type !== 'new' && offer.type !== 'update')
  const homeOptions = PAGES.filter((page) => page.id !== 'home')

  return (
    <div className="home-layout">
      <section className="home-updates-panel rustic-card">
        <div className="home-panel-head">
          <h3>{updatesTitle}</h3>
          <span>{newOffers.length}</span>
        </div>

        {loading ? (
          <p className="home-loading-text">Loading updates...</p>
        ) : (
          <div className="updates-columns">
            <div className="updates-column">
              <h4>{updatesTitle}</h4>
              <div className="updates-list">
                {latestUpdates.map((offer) => (
                  <article key={offer.id} className="update-item">
                    <div className="update-item-head">
                      <strong>{offer.title}</strong>
                      <span>{offer.badge}</span>
                    </div>
                    <p>{offer.desc}</p>
                    {offer.date && <small>{offer.date}</small>}
                  </article>
                ))}
                {latestUpdates.length === 0 && (
                  <p className="home-empty-text">No updates available.</p>
                )}
              </div>
            </div>

            <div className="updates-column">
              <h4>{regularTitle}</h4>
              <div className="updates-list">
                {regularUpdates.map((offer) => (
                  <article key={offer.id} className="update-item regular">
                    <div className="update-item-head">
                      <strong>{offer.title}</strong>
                      <span>{offer.badge}</span>
                    </div>
                    <p>{offer.desc}</p>
                    {offer.date && <small>{offer.date}</small>}
                  </article>
                ))}
                {regularUpdates.length === 0 && (
                  <p className="home-empty-text">Regular list is empty.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <aside className="home-options-panel rustic-card">
        <div className="home-panel-head">
          <h3>{optionsTitle}</h3>
          <span>{homeOptions.length}</span>
        </div>

        <p className="home-options-hint">{optionsHint}</p>

        <div className="service-grid home-service-grid">
          {homeOptions.map((page) => (
            <button
              key={page.id}
              className="card service-card"
              onClick={() => onNavigate(page.id)}
            >
              <div className="card-content">
                <span className="material-icons">{page.icon}</span>
                <h6>{tr.pages[page.id]}</h6>
                <p>
                  {tr.pages[page.id]} {openText}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </div>
  )
}
