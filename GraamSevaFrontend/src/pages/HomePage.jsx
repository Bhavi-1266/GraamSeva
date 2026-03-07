import { useState, useEffect } from 'react'
import { PAGES } from '../constants/appConfig'
import newSchemesOffersService from '../services/newSchemesOffers'
import { t } from '../lib/i18n'

export default function HomePage({ tr, onNavigate, uiLanguage, profile }) {
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
          <p className="text-center text-gray-500">
            {t(uiLanguage, 'homeLoading')}
          </p>
        ) : (
          <div className="flex gap-4 min-w-max">
            {newOffers.map((offer) => (
              <div
                key={offer.id}
                className="min-w-[220px] bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col gap-1"
              >
                <h4 className="font-semibold text-sm">{offer.title}</h4>
                <p className="text-xs text-gray-600">{offer.desc}</p>
                <span className="text-[10px] bg-green-200 w-fit px-2 py-1 rounded">
                  {offer.badge}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="service-grid">
        {PAGES.filter((p) => p.id !== "history").map((page) => (
          <button
            key={page.id}
            className="card service-card"
            onClick={() => onNavigate(page.id)}
          >
            <div className="card-content">
              <span className="material-icons">{page.icon}</span>
              <h6>{t(uiLanguage, `pages.${page.id}`)}</h6>
              <p>
                {t(uiLanguage, `pages.${page.id}`)} {t(uiLanguage, 'homeOpen')}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}