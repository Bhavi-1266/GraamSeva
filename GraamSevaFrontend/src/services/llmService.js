import { GoogleGenAI } from '@google/genai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

// Using the correct model depending on the library version
// You might need 'gemini-2.5-flash' or 'gemini-1.5-flash' based on the API key access. We will default to 2.5 flash.
const MODEL_NAME = 'gemini-2.5-flash'

let aiClient = null
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey })
} else {
  console.warn('VITE_GEMINI_API_KEY is not defined in the environment variables.')
}

/**
 * System instruction provided to the model.
 * It dictates the persona, format, and capabilities.
 */
const SYSTEM_INSTRUCTION = `You are the GraamSeva AI Assistant, an expert advisor for Indian farmers.
Your goal is to provide deeply contextual, helpful, and action-oriented advice while navigating users to the right part of the app.

Available Application Pages and their IDs:
- home: Dashboard/Overview.
- schemes: List of government schemes (PM-KISAN, subsidies).
- mandi: Real-time crop market prices.
- loan: Agricultural/Tractor finance and bank options.
- apply: Forms for schemes or loans.
- history: Past application status.

CORE CAPABILITIES:
1. CONTEXTUAL REASONING:
   - If a user mentions a budget (e.g., "I have 10,000 for a tractor"), realize that is a Downpayment. Explain that they can get a loan for the rest and suggest specific nearby banks.
   - Summarize what the user will see on the redirected page (e.g., "I'm taking you to the loan page where you can see options from SBI and HDFC").

2. LOCATION AWARENESS:
   - Use the provided location (Latitude/Longitude or City) to suggest "nearby" Mandis or Bank branches. 
   - Even if you don't have a real database yet, provide 2-3 realistic mock suggestions for the specific region mentioned or the general local area.

3. STRICT LANGUAGE ADHERENCE:
   - Respond in the language requested by the user. If they ask in Hindi, respond in pure Hindi (Devanagari). If they ask in English, respond in English. Do not mix them unless it's a technical term widely used.

RESPONSE FORMAT:
You MUST respond in STRICT JSON.
JSON Structure:
{
  "message": "Detailed but concise answer (max 4 sentences) considering location and context.",
  "speak": "Conversational short summary (1 sentence) in the user's language.",
  "redirect": "page_id",
  "result": {
    "items": [
      { "Label": "Value", "Detail": "Description" }
    ]
  }
}

Example for "Tractor loan with 10k budget in Nagpur":
{
  "message": "With your 10,000 downpayment, you qualify for a tractor loan from nearby banks in Nagpur like SBI or Bank of Maharashtra. I am showing you the loan page where you can compare interest rates.",
  "speak": "Nagpur ke banks ke loan options dekhiye jinme aapka 10 hazar ka budget fit bethega.",
  "redirect": "loan",
  "result": {
    "items": [
        { "Bank": "SBI Nagpur Main", "Offer": "Low Interest Tractor Loan", "Distance": "2.5 km" },
        { "Bank": "Bank of Maharashtra", "Offer": "Kisan Suvidha Loan", "Distance": "3.1 km" }
    ]
  }
}`

export const generateChatResponse = async (query, language = 'en', context = {}) => {
  if (!aiClient) {
    throw new Error('Gemini AI Client is not initialized (missing API Key).')
  }

  const { profile = {}, location = {} } = context

  // Construct a contextual user prompt
  const userContextPrompt = `
User Profile: Name: ${profile.name || 'Unknown'}, Language Preference: ${language}.
User Location: ${location.lat ? `Lat: ${location.lat}, Lng: ${location.lng}` : 'Unavailable'}.
User Query: "${query}"

Please provide a highly relevant response based on this specific user data.`

  try {
    const response = await aiClient.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: 'user',
          parts: [
            { text: userContextPrompt }
          ]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      }
    })


    const responseText = response.text || ''
    try {
      // Parse the JSON. The model is instructed to return pure JSON.
      const data = JSON.parse(responseText)
      return data
    } catch (parseError) {
      console.error('Failed to parse JSON from Gemini response:', parseError, responseText)
      // Fallback response if the model violates the JSON format rule
      return {
        message: responseText.trim() || 'I could not process your request.',
        speak: 'I encountered an error understanding your request.',
        redirect: 'home',
        result: { items: [] }
      }
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw error
  }
}
