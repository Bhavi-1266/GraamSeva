# GraamSeva Frontend - Prototype

🌾 **AI-powered Multi-Service Platform for Rural India**

A modern, voice-first web application prototype for GraamSeva that helps farmers and rural citizens access government schemes in their native language.

## 🎯 Features

### 1. **Home Page** 
- Language selection (6 Indian languages: Hindi, Bhojpuri, Awadhi, Odia, Marathi, Maithili)
- Beautiful onboarding with scheme highlights
- Responsive design optimized for low-bandwidth networks

### 2. **Voice Input Page**
- User information collection (Name, Mobile Number)
- Voice recording simulation for transcription
- Multi-language voice input support
- Transcript display with re-record capability

### 3. **Services Page**
- List of 20+ government schemes
- Eligibility indicators (✓ Eligible / ✗ Not Eligible)
- Service cards with detailed information
- Quick access to scheme details

### 4. **Eligibility Checker**
- Expandable eligibility requirements
- Real-time eligibility verification
- Benefit details and required documents
- Next steps guidance

### 5. **Application Form**
- Multi-step form (3 steps) with progress tracking
- Land information collection
- Bank details (IFSC, Account Number)
- Family information
- Terms & conditions acceptance

### 6. **Success Page**
- Application confirmation with reference number
- Timeline expectations
- Next action items
- Option to apply for more schemes

### 7. **CSC Operator Dashboard**
- Real-time statistics (calls, applications, unlocked funds)
- Recent activity monitoring
- Language distribution analytics
- Quick action buttons
- Scheme performance table
- Approval rate tracking

## 📱 Supported Schemes

- **PM-KISAN** - Farmer Direct Benefit Transfer
- **Crop Insurance (PMFBY)** - Crop Loss Protection
- **MGNREGA** - 100 Days Guaranteed Employment
- **Soil Health Card** - Soil Testing & Subsidies
- **Dairy Subsidy** - Livestock Support
- **Farmer Credit Card** - Low-Interest Loans

## 🎨 Design Principles

✅ **Low-Literacy First** - Large buttons, simple navigation, emojis for clarity
✅ **Voice-Centric** - Primary input method is voice in regional dialects
✅ **Offline-Ready** - PWA architecture for 2G connectivity
✅ **Regional Languages** - Full support for 10+ Indian languages
✅ **Accessibility** - High contrast, readable fonts, touch-friendly

## 🚀 Getting Started

### Installation

```bash
cd GraamSevaFrontend
npm install
```

### Development

```bash
npm run dev
```

The app will start on `http://localhost:5174/`

### Build

```bash
npm build
```

### Lint

```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── pages/
│   ├── HomePage.jsx           # Language selection & intro
│   ├── VoiceInputPage.jsx      # Voice recording & transcription
│   ├── ServicesPage.jsx        # Scheme listing
│   ├── EligibilityPage.jsx     # Eligibility checker
│   ├── ApplicationPage.jsx     # Multi-step application form
│   └── DashboardPage.jsx       # CSC operator dashboard
├── styles/
│   ├── HomePage.css
│   ├── VoiceInputPage.css
│   ├── ServicesPage.css
│   ├── EligibilityPage.css
│   ├── ApplicationPage.css
│   └── DashboardPage.css
├── App.jsx                     # Main app container & routing
└── main.jsx                    # Entry point
```

## 🎨 Color Scheme

- **Primary Purple**: `#667eea` → `#764ba2` (gradient)
- **Success Green**: `#06D6A0`
- **Warning Yellow**: `#FFB703`
- **Danger Red**: `#E63946`
- **Light Background**: `#F7F7F7`

## 💡 Current Features (Prototype)

✅ Multi-language UI (6 Indian languages)
✅ Voice input simulation with mock transcripts
✅ Service eligibility checking
✅ Multi-step application forms
✅ CSC operator dashboard
✅ Responsive design (mobile-first)
✅ Smooth animations & transitions
✅ Success confirmation with reference tracking

## 🔄 User Flow

```
Home (Language Selection)
    ↓
Voice Input (Name & Mobile)
    ↓
Services (Scheme Listing)
    ↓
Eligibility (Check Suitability)
    ↓
Application (Multi-step Form)
    ↓
Success (Confirmation & Next Steps)
```

## 🏗️ Backend Integration Points

The frontend is ready to integrate with:

1. **Azure AI Speech** - Voice transcription in dialects
2. **Azure OpenAI** - Intent routing & form generation
3. **Government Portal APIs** - Scheme information & eligibility
4. **IVRS System** - Missed-call callbacks
5. **Banking APIs** - Account verification
6. **Notification Service** - SMS/email updates

## 📊 Mock Data

All current data is mocked for demonstration:
- Services list (20+ schemes)
- Eligibility criteria
- Application form fields
- Dashboard statistics
- Recent activities

## 🎯 Next Steps for Production

1. **Backend Integration**
   - Connect to Azure services for speech & AI
   - Integrate with government scheme APIs
   - Set up real database

2. **Authentication**
   - Mobile OTP verification
   - Aadhaar integration
   - Session management

3. **Offline Support**
   - Service workers for PWA
   - Local data caching
   - Sync on reconnect

4. **Testing**
   - Unit tests with Jest
   - Integration tests
   - User testing with target audience

5. **Performance**
   - Code splitting
   - Image optimization
   - Lazy loading

6. **Security**
   - HTTPS enforcement
   - XSS protection
   - CSRF tokens
   - Data encryption

## 📞 Support

For issues or questions:
- Email: `support@graamseva.in`
- Phone: `1234-567-8900` (24/7)

## 🙏 Credits

Built by **Bada Pikachu** team @ IIT Roorkee
- **Bhavy** - Backend & Azure Architecture
- **Prachet** - API Integrations
- **Kabeer** - AI/NLP Pipeline
- **Stuti** - Frontend & UX Design

## 📄 License

This project is developed for the AI Unlocked Hackathon (AI for India Track)

---

**GraamSeva: Bridging the Gap Between Government and Citizens** 🌾
