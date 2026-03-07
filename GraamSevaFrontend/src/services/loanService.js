/**
 * Loan Service
 * Handles loan options and calculator data retrieval
 */

import { API_ENDPOINTS, buildURL } from './apiConfig'
import { MOCK_LOAN_OPTIONS } from './mockData'
import apiClient from './apiClient'

class LoanService {
  /**
   * Get loan options
   * @param {String} language - Language code for localization
   * @param {String} loanType - Optional filter by loan type
   * @returns {Object} { data: Array, source: 'api'|'mock' }
   */
  async getLoanOptions(language = 'hi', loanType = null) {
    try {
      console.log('Fetching loan options from API...')
      
      const url = buildURL(API_ENDPOINTS.LOANS?.LIST || '/api/loans')
      const response = await apiClient.get(url, {
        headers: { 'Accept-Language': language },
        params: loanType ? { type: loanType } : {},
      })

      console.log('Loan options fetched successfully:', response)
      return {
        data: response.loans || response.data || response,
        source: 'api',
      }
    } catch (error) {
      console.warn('Loan API failed, using mock data:', error.message)
      
      return {
        data: MOCK_LOAN_OPTIONS,
        source: 'mock',
      }
    }
  }

  /**
   * Calculate loan EMI
   * @param {Number} amount - Loan amount
   * @param {Number} interest - Annual interest rate
   * @param {Number} tenure - Tenure in months
   * @returns {Object} { data: Object, source: 'api'|'mock' }
   */
  async calculateEMI(amount, interest, tenure) {
    try {
      console.log('Calculating EMI from API...')
      
      const url = buildURL(API_ENDPOINTS.LOANS?.CALCULATE || '/api/loans/calculate')
      const response = await apiClient.post(url, {
        amount,
        interest,
        tenure,
      })

      console.log('EMI calculated successfully:', response)
      return {
        data: response,
        source: 'api',
      }
    } catch (error) {
      console.warn('EMI calculation API failed, using local calculation:', error.message)
      
      // Local EMI calculation formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
      const monthlyRate = (interest / 100) / 12
      const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
                  (Math.pow(1 + monthlyRate, tenure) - 1)
      const totalAmount = emi * tenure
      const totalInterest = totalAmount - amount
      
      return {
        data: {
          emi: Math.round(emi),
          totalAmount: Math.round(totalAmount),
          totalInterest: Math.round(totalInterest),
          principal: amount,
          tenure,
          interest,
        },
        source: 'mock',
      }
    }
  }
}

export default new LoanService()
