# GraamSeva Frontend - Architecture & Integration Guide

## 🏗️ Frontend Architecture

### Component Hierarchy

```
App.jsx (Main Router)
├── HomePage
│   └── Language Selection
├── VoiceInputPage
│   ├── Info Form
│   └── Voice Recording
├── ServicesPage
│   └── Service Cards
├── EligibilityPage
│   ├── Benefits Section
│   ├── Requirements Section
│   ├── Documents Section
│   └── Next Steps
├── ApplicationPage
│   ├── Step 1: Land Info
│   ├── Step 2: Bank Details
│   ├── Step 3: Family Info
│   └── Success State
└── DashboardPage
    ├── KPI Cards
    ├── Activities Feed
    ├── Language Analytics
    ├── Quick Actions
    └── Scheme Performance
```

### State Management

**Current**: React Local State (useState)

**For Production**: Recommend Redux or Zustand
```javascript
// Global State Structure
{
  user: {
    name: String,
    mobile: String,
    language: String,
    profile: Object
  },
  application: {
    currentService: Object,
    formData: Object,
    status: String,
    referenceId: String
  },
  ui: {
    currentPage: String,
    loading: Boolean,
    error: String|null
  }
}
```

---

## 🔗 Backend Integration Points

### 1. **Voice Input Processing**

**Current**: Mock transcription
```javascript
// Mock Data (Current)
const mockTranscripts = {
  hi: 'मुझे PM-KISAN योजना के बारे में जानकारी चाहिए',
  bhoj: 'हम फसल बीमा के लिए आवेदन करना चाहते हैं',
  // ... more languages
}
```

**Azure Integration**: Replace with real Azure Speech API
```javascript
// Replace in VoiceInputPage.jsx
import { CognitiveServicesCredentials } from '@azure/ms-rest-js';
import { SpeechRecognitionServiceFactory } from 'microsoft-cognitiveservices-speech-sdk';

async function transcribeAudio(audioBlob, language) {
  try {
    const speechConfig = SpeechConfig.fromSubscriptionKey(
      AZURE_SPEECH_KEY,
      AZURE_SPEECH_REGION
    );
    speechConfig.speechRecognitionLanguage = getLanguageCode(language);
    
    const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechRecognizer(speechConfig, audioConfig);
    
    const result = await recognizer.recognizeOnceAsync();
    return result.text;
  } catch (error) {
    console.error('Speech recognition error:', error);
  }
}

// Language Code Mapping
const languageCodeMap = {
  hi: 'hi-IN',
  bhoj: 'hi-IN', // Bhojpuri uses Hindi language code
  awa: 'hi-IN',  // Awadhi uses Hindi language code
  odi: 'or-IN',
  mar: 'mr-IN',
  mai: 'hi-IN'
};
```

**API Endpoint**:
```
POST /api/speech/transcribe
Headers:
  - Authorization: Bearer {token}
  - Content-Type: audio/wav
Body:
  - audio: Blob
  - language: String
  - duration: Number

Response:
{
  "text": "transcribed text",
  "confidence": 0.95,
  "language": "hi",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 2. **Intent Routing (GPT-4o)**

**Current**: Direct service selection
```javascript
// Mock (Current)
onServiceSelect(service) {
  setSelectedService(service);
  setCurrentPage('eligibility');
}
```

**Azure OpenAI Integration**:
```javascript
// In ServicesPage.jsx or new IntentRouter.jsx
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

async function routeIntent(transcript, language) {
  const client = new OpenAIClient(
    `https://${AZURE_OPENAI_RESOURCE}.openai.azure.com/`,
    new AzureKeyCredential(AZURE_OPENAI_KEY)
  );

  const prompt = `
    Analyze this farmer's request in ${language} and determine which government scheme they're asking about.
    
    Request: "${transcript}"
    
    Return JSON:
    {
      "intendedScheme": "PM-KISAN|MGNREGA|PMFBY|...",
      "confidence": 0.95,
      "keyDetails": {
        "landSize": "2 hectares",
        "state": "UP",
        "// ...": "extracted info"
      }
    }
  `;

  const completion = await client.getCompletions(
    DEPLOYMENT_ID,
    prompt,
    { maxTokens: 500 }
  );

  return JSON.parse(completion.choices[0].text);
}
```

**API Endpoint**:
```
POST /api/intent/route
Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json
Body:
{
  "transcript": "string",
  "language": "hi|bhoj|awa|...",
  "context": {
    "previousSchemes": ["PM-KISAN"],
    "userProfile": {}
  }
}

Response:
{
  "intendedScheme": "String",
  "confidence": Number,
  "alternativeSchemes": ["String"],
  "keyDetails": Object,
  "nextAction": "String"
}
```

---

### 3. **Scheme Information & Eligibility**

**Current**: Static mock data
```javascript
// Mock (Current)
const ELIGIBILITY_CRITERIA = {
  1: { title: "...", requirements: [...] }
}
```

**Backend Integration**:
```javascript
// Replace with API calls
async function getSchemeDetails(schemeId, language) {
  const response = await fetch(`/api/schemes/${schemeId}`, {
    headers: { 'Accept-Language': language }
  });
  return response.json();
}

async function checkEligibility(userId, schemeId, formData) {
  const response = await fetch('/api/eligibility/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userId,
      schemeId,
      landArea: formData.landArea,
      income: formData.annualIncome,
      // ... other fields
    })
  });
  return response.json();
}
```

**API Endpoints**:
```
GET /api/schemes/{schemeId}
  Response: { title, description, benefits, requirements, documents }

GET /api/schemes?state={state}&language={lang}
  Response: [ { id, name, icon, eligible, details } ]

POST /api/eligibility/check
  Request: { userId, schemeId, formData }
  Response: { eligible, score, missingRequirements, feedback }
```

---

### 4. **Application Submission**

**Current**: Mock submission
```javascript
// Mock (Current)
const handleSubmit = async () => {
  setIsProcessing(true);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  setSubmitted(true);
};
```

**Real Integration**:
```javascript
async function submitApplication(formData, userProfile, service) {
  const applicationPayload = {
    userId: userProfile.id,
    schemeId: service.id,
    language: userProfile.language,
    personalInfo: {
      name: userProfile.name,
      mobile: userProfile.mobileNumber
    },
    applicationData: {
      landArea: formData.landArea,
      landType: formData.landType,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber, // encrypted
      ifscCode: formData.ifscCode,
      familyMembers: formData.familyMembers,
      annualIncome: formData.annualIncome
    },
    submittedAt: new Date().toISOString(),
    consent: {
      dataSharing: true,
      smsUpdates: true,
      termsAccepted: true
    }
  };

  const response = await fetch('/api/applications/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(applicationPayload)
  });

  const result = await response.json();
  return {
    referenceId: result.referenceId,
    expectedApprovalTime: result.expectedApprovalTime,
    nextSteps: result.nextSteps
  };
}
```

**API Endpoint**:
```
POST /api/applications/submit
Request Headers:
  - Authorization: Bearer {token}
  - Content-Type: application/json
  
Request Body:
{
  "userId": "String",
  "schemeId": "String",
  "language": "String",
  "personalInfo": {...},
  "applicationData": {...},
  "consent": {...}
}

Response:
{
  "referenceId": "GS-2024-XXXXX",
  "status": "submitted|pending|approved",
  "timeline": "7-15 days",
  "estimatedAmount": 6000,
  "smsNotification": "+919876543210",
  "trackingUrl": "https://graamseva.in/track/..."
}
```

---

### 5. **Missed-Call IVR System**

**Integration with Exotel + Azure**:
```javascript
// Webhook endpoint to handle missed calls
app.post('/api/ivr/missed-call', async (req, res) => {
  const { phoneNumber, callTime } = req.body;
  
  // 1. Log the call
  await logMissedCall(phoneNumber, callTime);
  
  // 2. Route to voice service
  const userLanguage = await getUserLanguagePreference(phoneNumber);
  
  // 3. Trigger callback
  await queueCallback({
    phoneNumber,
    language: userLanguage,
    callType: 'missed-call-callback'
  });
  
  res.json({ status: 'processed' });
});

// Callback handling
async function initiateCallback(phoneNumber, language) {
  const ivrsConfig = {
    phoneNumber,
    language,
    flow: 'missed_call_response',
    timeout: 120 // 2 minutes
  };
  
  await exotelClient.makeCall(ivrsConfig);
}
```

---

### 6. **Dashboard Analytics**

**Current**: Mock statistics
```javascript
// Mock (Current)
const DASHBOARD_STATS = {
  todaysCalls: 247,
  applicationsProcessed: 1340,
  amountUnlocked: '₹68,50,000',
};
```

**Real Integration**:
```javascript
async function fetchDashboardStats(operatorId, filters = {}) {
  const response = await fetch(
    `/api/dashboard/stats?operator=${operatorId}&period=${filters.period||'today'}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
}

async function fetchRecentActivities(operatorId, limit = 10) {
  const response = await fetch(
    `/api/activities/recent?limit=${limit}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
}

// WebSocket for real-time updates
const ws = new WebSocket('wss://api.graamseva.in/dashboard/live');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  updateDashboardStats(update);
};
```

---

## 🔐 Authentication & Security

### OAuth 2.0 Flow for Mobile Users

```javascript
// Mobile OTP Authentication
async function sendOTP(mobileNumber) {
  const response = await fetch('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ mobile: mobileNumber })
  });
  return response.json(); // { requestId, expiresIn }
}

async function verifyOTP(mobileNumber, otp, requestId) {
  const response = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      mobile: mobileNumber,
      otp,
      requestId
    })
  });
  
  const { token, user } = await response.json();
  localStorage.setItem('authToken', token);
  return user;
}

// Aadhaar Verification (Optional)
async function verifyAadhaar(aadhaarNumber, name) {
  const response = await fetch('/api/auth/verify-aadhaar', {
    method: 'POST',
    body: JSON.stringify({
      aadhaarNumber,
      name
    })
  });
  return response.json();
}
```

---

## 📦 Environment Variables

Create `.env.local` file:

```env
# Azure Services
VITE_AZURE_SPEECH_KEY=your_key_here
VITE_AZURE_SPEECH_REGION=centralindia
VITE_AZURE_OPENAI_KEY=your_key_here
VITE_AZURE_OPENAI_RESOURCE=your_resource_name
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4o

# Backend API
VITE_API_BASE_URL=https://api.graamseva.in
VITE_API_TIMEOUT=30000

# Analytics
VITE_ANALYTICS_KEY=your_key_here
VITE_ENVIRONMENT=development|production

# Feature Flags
VITE_ENABLE_VOICE_INPUT=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_DASHBOARD=true
```

---

## 🧪 Testing Integration Points

### Unit Tests (Jest + React Testing Library)
```javascript
// Example: VoiceInputPage.test.jsx
describe('VoiceInputPage', () => {
  test('submits form with user data', async () => {
    const mock = jest.fn();
    render(
      <VoiceInputPage 
        language="hi" 
        onComplete={mock}
      />
    );
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('नाम लिखें'), {
      target: { value: 'राम कुमार' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('आगे बढ़ें'));
    
    expect(mock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'राम कुमार'
      })
    );
  });
});
```

### E2E Tests (Cypress)
```javascript
// Example: e2e/application-flow.cy.js
describe('Complete Application Flow', () => {
  it('can submit application from start to finish', () => {
    cy.visit('/');
    cy.contains('हिन्दी').click();
    
    // Fill voice input
    cy.get('input[name="name"]').type('राम कुमार');
    cy.get('input[name="mobileNumber"]').type('9876543210');
    cy.contains('आगे बढ़ें').click();
    
    // Select service
    cy.contains('PM-KISAN').parent().contains('जानकारी लें').click();
    
    // Check eligibility
    cy.contains('मेरी योग्यता जांचें').click();
    cy.contains('आप पात्र हैं').should('be.visible');
    
    // Submit application
    cy.contains('आवेदन शुरू करें').click();
  });
});
```

---

## 🚀 Deployment

### Build & Deploy
```bash
# Development
npm run dev

# Production Build
npm run build

# Preview Production Build
npm run preview

# Deploy to Azure Static Web Apps
az staticwebapp create \
  --name graamseva-frontend \
  --resource-group india-hackathon \
  --source https://github.com/your-repo/GraamSevaFrontend \
  --location centralindia \
  --branch main
```

---

## 📊 Monitoring & Analytics

### Application Insights Integration
```javascript
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: VITE_APP_INSIGHTS_KEY,
    enableAutoRouteTracking: true
  }
});

appInsights.trackPageView({
  name: 'HomePage',
  uri: window.location.pathname
});

// Track user actions
appInsights.trackEvent({
  name: 'SchemeSelected',
  properties: {
    scheme: 'PM-KISAN',
    language: 'hi'
  }
});
```

---

This architecture provides a scalable, secure, and production-ready foundation for GraamSeva!
