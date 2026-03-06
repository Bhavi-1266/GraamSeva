/**
 * New Schemes Service
 */

import { API_ENDPOINTS, buildURL } from "./apiConfig"
import { MOCK_LATEST_OFFERS } from "./mockData"
import apiClient from "./apiClient"

class NewSchemesOffersService {

  async getNewSchemes(language = "hi") {
    try {
      console.log("Fetching new schemes...")

      const url = buildURL(API_ENDPOINTS.NEW_SCHEMES.LIST)

      const response = await apiClient.get(url, {
        headers: { "Accept-Language": language },
      })

      return {
        data: response,
        source: "api",
      }

    } catch (error) {
      console.warn("New schemes API failed, using mock data:", error.message)

      return {
        data: MOCK_LATEST_OFFERS || [],
        source: "mock",
      }
    }
  }

}

export default new NewSchemesOffersService()