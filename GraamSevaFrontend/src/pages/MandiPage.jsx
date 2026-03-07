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

   return  <ul className="collection rounded-lg shadow-md p-4 bg-white">
    {mandiPrices.map((mandi) => (
      <li key={mandi.id} className="collection-item">

        {/* Mandi Name */}
        <div className="mb-2">
          <strong className="text-lg">{mandi.mandi}</strong>
          <p className="text-sm text-gray-500">{mandi.state}</p>
        </div>

        {/* Crop Prices */}
        {mandi.crops.map((crop, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-t pt-2 mt-2"
          >
            <div>
              <p className="font-medium">{crop.crop}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-green-700">{crop.price}</p>

              <p
                className={`text-xs ${
                  crop.trend === "up"
                    ? "text-green-600"
                    : crop.trend === "down"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {crop.trend === "up"
                  ? "↑"
                  : crop.trend === "down"
                  ? "↓"
                  : "→"}{" "}
                {crop.change}
              </p>
            </div>
          </div>
        ))}
      </li>
    ))}
  </ul>
}