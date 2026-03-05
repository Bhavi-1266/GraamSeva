/**
 * Voice Service
 * Handles voice transcription via Azure Speech or API
 * Falls back to mock data if API fails
 */

import { API_ENDPOINTS, buildURL } from './apiConfig'
import { MOCK_TRANSCRIPTS } from './mockData'
import apiClient from './apiClient'

class VoiceService {
  /**
   * Transcribe audio to text
   * @param {Blob} audioBlob - Audio file blob
   * @param {String} language - Language code (hi, bhoj, awa, etc)
   * @returns {Object} { text, confidence, language, timestamp }
   */
  async transcribeAudio(audioBlob, language) {
    try {
      console.log('Calling Voice Transcription API...')
      
      // Prepare FormData for audio upload
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')
      formData.append('language', language)
      
      // Call API endpoint
      const url = buildURL(API_ENDPOINTS.SPEECH.TRANSCRIBE)
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      console.log('Voice transcription successful:', data)
      
      return {
        text: data.text,
        confidence: data.confidence || 0.95,
        language: language,
        timestamp: new Date().toISOString(),
        source: 'api',
      }
    } catch (error) {
      console.warn('Voice API failed, using mock data:', error.message)
      
      // Fallback to mock data
      return {
        text: MOCK_TRANSCRIPTS[language] || MOCK_TRANSCRIPTS.en,
        confidence: 0.87,
        language: language,
        timestamp: new Date().toISOString(),
        source: 'mock',
      }
    }
  }

  /**
   * Convert text to speech
   * @param {String} text - Text to convert
   * @param {String} language - Language code
   * @returns {Object} { audioUrl, duration }
   */
  async textToSpeech(text, language) {
    try {
      console.log('Calling Text-to-Speech API...')
      
      const url = buildURL(API_ENDPOINTS.SPEECH.TTS)
      const response = await apiClient.post(url, {
        text,
        language,
      })

      return {
        audioUrl: response.audioUrl,
        duration: response.duration,
        source: 'api',
      }
    } catch (error) {
      console.warn('TTS API failed:', error.message)
      
      // Return mock audio URL
      return {
        audioUrl: 'https://mock-audio.graamseva.in/audio.mp3',
        duration: 5,
        source: 'mock',
      }
    }
  }

  /**
   * Record audio from microphone
   * @returns {Promise<Blob>} Audio blob
   */
  async recordAudio(duration = 60) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks = []

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/wav' })
          stream.getTracks().forEach((track) => track.stop())
          resolve(blob)
        }

        mediaRecorder.start()
        
        // Stop after duration
        setTimeout(() => {
          mediaRecorder.stop()
        }, duration * 1000)

        mediaRecorder.onerror = reject
      })
    } catch (error) {
      console.error('Audio recording failed:', error)
      throw new Error('Unable to access microphone: ' + error.message)
    }
  }
}

export default new VoiceService()
