/**
 * New Schemes & Offers Service
 */

import { API_ENDPOINTS, buildURL } from './apiConfig'
import { getMockLatestOffers } from './mockData'
import apiClient from './apiClient'

class NewSchemesOffersService {
  async getNewSchemes(language = 'hi') {
    try {
      console.log('Fetching new schemes...')

      const url = buildURL(API_ENDPOINTS.NEW_SCHEMES.LIST)
      const response = await apiClient.get(url, {
        headers: { 'Accept-Language': language },
      })

      return {
        data: response,
        source: 'api',
      }
    } catch (error) {
      console.warn('New schemes API failed, using mock data:', error.message)

      return {
        data: getMockLatestOffers(language),
        source: 'mock',
      }
    }
  }
}

export default new NewSchemesOffersService()