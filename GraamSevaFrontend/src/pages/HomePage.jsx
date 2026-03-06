import { PAGES } from "../constants/appConfig"
import { useState, useEffect } from "react"
import newSchemesOffersService from "../services/newSchemesOffers"

export default function HomePage({ tr, onNavigate, locationState, onRequestLocation, uiLanguage }) {

  const openText = tr.pages.home === "होम" ? "खोलें" : "Open"

  const [newOffers, setNewOffers] = useState([])

  useEffect(() => {
    loadNewOffers()
    console.log("HomePage loaded, fetching new offers...")
  }, [uiLanguage])

  const loadNewOffers = async () => {
    try {
      const result = await newSchemesOffersService.getNewSchemes(uiLanguage)

      setNewOffers(result.data)

      console.log(`New offers loaded from ${result.source}:`, result.data)
    } catch (err) {
      console.error("Failed to load new offers:", err)
    }
  }

  return (
    <div>

 <div className="bg-white p-4 rounded-lg mb-6 overflow-x-auto">
  <div className="flex gap-4 min-w-max">

    {newOffers.map((offer) => (
      <div
        key={offer.id}
        className="min-w-[220px] bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col gap-1"
      >

        <h4 className="font-semibold text-sm">
          {offer.title}
        </h4>

        <p className="text-xs text-gray-600">
          {offer.desc}
        </p>

        <span className="text-[10px] bg-green-200 w-fit px-2 py-1 rounded">
          {offer.badge}
        </span>
      </div>
    ))}

  </div>
</div>

      <div className="service-grid">
        {PAGES.filter((p) => p.id !== "history").map((page) => (
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

    </div>
  )
}