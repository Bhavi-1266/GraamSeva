/**
 * Scheme Service
 * Handles scheme data retrieval and management
 */

import { API_ENDPOINTS, buildURL } from './apiConfig'
import { MOCK_SCHEMES } from './mockData'
import apiClient from './apiClient'

class SchemeService {
  /**
   * Get all schemes
   * @param {String} language - Language code for localization
   * @returns {Array} List of schemes
   */
  async getAllSchemes(language = 'hi') {
    try {
      console.log('Fetching schemes from API...')
      
      const url = buildURL(API_ENDPOINTS.SCHEMES.LIST)
      const response = await apiClient.get(url, {
        headers: { 'Accept-Language': language },
      })

      console.log('Schemes fetched successfully:', response)
      return {
        data: response.schemes || response,
        source: 'api',
      }
    } catch (error) {
      console.warn('Schemes API failed, using mock data:', error.message)
      
      return {
        data: MOCK_SCHEMES,
        source: 'mock',
      }
    }
  }

  /**
   * Get scheme by ID
   * @param {Number} schemeId - Scheme ID
   * @param {String} language - Language code
   * @returns {Object} Scheme details
   */
  async getSchemeById(schemeId, language = 'hi') {
    try {
      console.log(`Fetching scheme ${schemeId} from API...`)
      
      const url = buildURL(API_ENDPOINTS.SCHEMES.GET_BY_ID.replace(':id', schemeId))
      const response = await apiClient.get(url, {
        headers: { 'Accept-Language': language },
      })

      return {
        data: response,
        source: 'api',
      }
    } catch (error) {
      console.warn(`Scheme ${schemeId} API failed, using mock data:`, error.message)
      
      const scheme = MOCK_SCHEMES.find((s) => s.id === schemeId)
      return {
        data: scheme || MOCK_SCHEMES[0],
        source: 'mock',
      }
    }
  }

  /**
   * Search schemes
   * @param {String} query - Search query
   * @param {String} language - Language code
   * @returns {Array} Search results
   */
  async searchSchemes(query, language = 'hi') {
    try {
      console.log('Searching schemes API...')
      
      const url = buildURL(API_ENDPOINTS.SCHEMES.SEARCH)
      const response = await apiClient.post(url, {
        query,
        language,
      })

      return {
        data: response.results || response,
        source: 'api',
      }
    } catch (error) {
      console.warn('Search API failed, filtering mock data:', error.message)
      
      const results = MOCK_SCHEMES.filter(
        (scheme) =>
          scheme.name.toLowerCase().includes(query.toLowerCase()) ||
          scheme.desc.toLowerCase().includes(query.toLowerCase())
      )

      return {
        data: results,
        source: 'mock',
      }
    }
  }

  /**
   * Get schemes by state
   * @param {String} state - State code
   * @param {String} language - Language code
   * @returns {Array} Schemes for the state
   */
  async getSchemesByState(state, language = 'hi') {
    try {
      console.log(`Fetching schemes for state: ${state}`)
      
      const url = buildURL(API_ENDPOINTS.SCHEMES.BY_STATE.replace(':state', state))
      const response = await apiClient.get(url, {
        headers: { 'Accept-Language': language },
      })

      return {
        data: response.schemes || response,
        source: 'api',
      }
    } catch (error) {
      console.warn(`State schemes API failed for ${state}, using mock data:`, error.message)
      
      return {
        data: MOCK_SCHEMES,
        source: 'mock',
      }
    }
  }

  /**
   * Get popular schemes
   * @param {String} language - Language code
   * @returns {Array} Popular schemes
   */
  async getPopularSchemes(language = 'hi') {
    try {
      console.log('Fetching popular schemes...')
      
      const url = buildURL(API_ENDPOINTS.SCHEMES.POPULAR)
      const response = await apiClient.get(url, {
        headers: { 'Accept-Language': language },
      })

      return {
        data: response.schemes || response,
        source: 'api',
      }
    } catch (error) {
      console.warn('Popular schemes API failed, using mock data:', error.message)
      
      return {
        data: MOCK_SCHEMES.slice(0, 3),
        source: 'mock',
      }
    }
  }
}

export default new SchemeService()
