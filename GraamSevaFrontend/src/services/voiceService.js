/**
 * Voice Service
 * Handles live microphone speech recognition via the Web Speech API (browser-native, free)
 * Falls back to mock data when the API is unavailable
 */

import { API_ENDPOINTS, buildURL } from './apiConfig'
import { MOCK_TRANSCRIPTS } from './mockData'
import apiClient from './apiClient'

// BCP-47 locales for the Web Speech API
const LOCALE_MAP = {
  hi: 'hi-IN',
  bhoj: 'hi-IN',   // fallback to Hindi
  awa: 'hi-IN',    // fallback to Hindi
  odi: 'or-IN',    // Odia
  mar: 'mr-IN',
  mai: 'hi-IN',    // fallback to Hindi
  en: 'en-IN',
}

const getSpeechRecognition = () =>
  window.SpeechRecognition || window.webkitSpeechRecognition || null

class VoiceService {
  /**
   * Live microphone → text via Web Speech API
   * Used by HomePage (recognizeAndTranslate) and VoiceInputPage (transcribeAudio)
   */
  async recognizeAndTranslate(language, onInterimResult) {
    const SpeechRecognition = getSpeechRecognition()

    if (!SpeechRecognition) {
      throw new Error(
        'Web Speech API is not supported in this browser. Please use Chrome or Edge.'
      )
    }

    return new Promise((resolve, reject) => {
      const recognition = new SpeechRecognition()
      recognition.lang = LOCALE_MAP[language] || 'hi-IN'
      recognition.interimResults = true // Enable live preview
      recognition.maxAlternatives = 1
      recognition.continuous = false

      let finalTranscript = ''

      recognition.onresult = async (event) => {
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        // Send live preview characters back to the UI
        if (onInterimResult && interimTranscript) {
          onInterimResult(interimTranscript)
        }

        // If it's the final result, translate it
        if (event.results[event.results.length - 1].isFinal) {
          let translatedText = finalTranscript

          // Use free Google Translate API if not English
          if (language !== 'en' && finalTranscript.trim()) {
            try {
              const res = await fetch(
                `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${language}&tl=en&dt=t&q=${encodeURIComponent(finalTranscript)}`
              )
              const data = await res.json()
              translatedText = data[0].map((item) => item[0]).join('')
            } catch (err) {
              console.warn('Free Translation API failed:', err)
            }
          }

          resolve({
            text: finalTranscript,
            translatedText: translatedText,
            confidence: event.results[event.results.length - 1][0].confidence || 0.9,
            language,
            timestamp: new Date().toISOString(),
            source: 'web-speech-api',
          })
        }
      }

      recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      recognition.onnomatch = () => {
        reject(new Error('No speech was recognised. Please try again.'))
      }

      recognition.start()
    })
  }

  /**
   * Transcribe audio — delegates to live mic recognition
   * Kept for API compatibility with VoiceInputPage
   */
  async transcribeAudio(_audioBlob, language) {
    try {
      return await this.recognizeAndTranslate(language)
    } catch (error) {
      console.warn('Web Speech API failed, using mock data:', error.message)
      return {
        text: MOCK_TRANSCRIPTS[language] || MOCK_TRANSCRIPTS.en,
        confidence: 0.87,
        language,
        timestamp: new Date().toISOString(),
        source: 'mock',
      }
    }
  }

  /**
   * Text-to-Speech (backend API)
   */
  async textToSpeech(text, language) {
    try {
      const url = buildURL(API_ENDPOINTS.SPEECH.TTS)
      const response = await apiClient.post(url, { text, language })
      return {
        audioUrl: response.audioUrl,
        duration: response.duration,
        source: 'api',
      }
    } catch (error) {
      console.warn('TTS API failed:', error.message)
      return {
        audioUrl: 'https://mock-audio.graamseva.in/audio.mp3',
        duration: 5,
        source: 'mock',
      }
    }
  }

  /**
   * Record audio from microphone
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
        setTimeout(() => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop()
          }
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
