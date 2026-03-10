# 🌾 GraamSeva: AI-Powered Rural Empowerment 🇮🇳

> **Bridging the Digital Divide for 700M+ Citizens through Voice and AI.**

GraamSeva is a state-of-the-art AI platform designed specifically for rural Indian farmers. It simplifies and democratizes access to government welfare schemes using advanced **Large Language Models (LLM)**, **Real-time Geolocation**, and **Voice-to-Voice Interaction**.

---

## ✨ Key Features

### 🤖 Intelligent AI Chatbot (Gemini Powered)
The heart of GraamSeva is an **LLM-driven Assistant** that:
- **Understands Context**: "I have 10k for a tractor" → Identifies as a downpayment and suggests loans.
- **Smart Redirection**: Automatically navigates users to Mandis, Loans, or Scheme pages based on intent.
- **Strict Localization**: Responds in the user's preferred language (Hindi, Bhojpuri, Awadhi, Odia, Marathi, Maithili).

### 📍 Location-Aware Intelligence
- **Nearby Discovery**: Integrated with browser Geolocation to suggest the closest Mandis (markets) and Bank branches.
- **Dynamic Data**: Real-time price and distance estimation based on actual user coordinates.

### 🎤 Voice-First Interface
- **Low Literacy Optimized**: No typing required. Users speak in their native tongue.
- **Web Speech API**: Browser-native, high-performance transcription.

### 🌐 Regional Language Support
- **Inclusive Access**: Users can switch the entire interface to their preferred regional language.
- **Full Interface Translation**: Schemes, chatbot responses, and all translatable UI elements adapt automatically.
- **Supported Languages**: Hindi, Bhojpuri, Awadhi, Marathi, Maithili, Odia, and English.

### 📊 Operator Dashboard
- **CSC Management**: Real-time KPI monitoring, language distribution analytics, and application tracking for village operators.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User((Farmer / User)) -->|Voice/Text| UI[React Frontend]
    UI -->|Query + Context| LLM[Google Gemini API]
    UI -->|Geolocation| Loc[Browser Geolocation API]
    
    subgraph "AI Content Engine"
    LLM --> Intent{Intent Router}
    Intent -->|Mandi Query| Mandi[Market Price Page]
    Intent -->|Loan Query| Loan[Loan Suggestion Page]
    Intent -->|Scheme Query| Schemes[Government Schemes Page]
    end
    
    subgraph "Local Storage & State"
    UI --> State[React Context/State]
    State --> Cache[LocalStorage Thread Caching]
    end
    
    Mandi --> DB[(Govt/Bank APIs)]
    Loan --> DB
    Schemes --> DB
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Backend** | Django 6.0 + Django REST Framework |
| **AI / LLM** | Google Gemini 2.5 Flash |
| **Database** | SQLite (Development), PostgreSQL (Production-ready) |
| **Styling** | Tailwind CSS, Responsive Grid |
| **Icons** | Material Design Icons |

---

## 🚀 Quick Setup

### 1. Prerequisites
- Node.js (v18+)
- npm
- django

### 2. Installation

#### Frontend Setup
```bash
# Navigate to the frontend directory
cd GraamSevaFrontend

# Install dependencies
npm install
```

#### Backend Setup
```bash
# Navigate to the backend directory
cd Backend/GraamSevaBackend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install django djangorestframework

# Run migrations
python manage.py migrate

# Create superuser (optional, for admin panel)
python manage.py createsuperuser
```

### 3. Environment Configuration
Create a `.env` file in `GraamSevaFrontend/` and add your Gemini API Key:
```env
VITE_GEMINI_API_KEY="your_google_gemini_api_key"
```

### 4. Run Development Server

#### Start Frontend (React + Vite)
```bash
cd GraamSevaFrontend
npm run dev
```
Open `http://localhost:5173` to explore.

#### Start Backend (Django REST API)
```bash
cd Backend/GraamSevaBackend
source venv/bin/activate
python manage.py runserver
```
Backend API available at `http://localhost:8000`  
Django Admin panel: `http://localhost:8000/admin`

---

## 📂 Project Structure
```text
rnicrosoftHackathon/
├── GraamSevaFrontend/          # React Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI (AssistantBar, etc.)
│   │   ├── pages/              # 12+ Feature Pages (Mandi, Loan, Dashboard)
│   │   ├── services/           # LLM, Voice, API Client logic
│   │   ├── constants/          # App configuration & language maps
│   │   └── lib/                # i18n and Utility helpers
│   ├── .env                    # API Keys (Git ignored)
│   └── vite.config.js          # Build configuration
│
├── Backend/                    # Django REST API Backend
│   └── GraamSevaBackend/
│       ├── manage.py
│       ├── GraamSevaBackend/   # Project settings & configuration
│       │   ├── settings.py     # Django settings with REST framework config
│       │   ├── urls.py         # API route definitions
│       │   ├── wsgi.py         # Production WSGI server
│       │   └── asgi.py         # Async WSGI server
│       └── venv/               # Python virtual environment
│
└── README.md                   # This file
```

---

## Backend API Integration

The Django REST API (`Backend/GraamSevaBackend`) provides core services:

### Key API Endpoints (Planned/Available)
- **Schemes**: GET `/api/schemes`, `/api/schemes/:id`, `/api/schemes/search`
- **Eligibility**: POST `/api/eligibility/check`, GET `/api/eligibility/criteria/:schemeId`
- **Applications**: POST `/api/applications`, GET `/api/applications/:id`
- **Intent Routing**: POST `/api/intent/route`, `/api/intent/classify`
- **Mandis**: GET `/api/mandis`, `/api/mandis/nearby`
- **Loans**: GET `/api/loans`, POST `/api/loans/compare`

### Frontend-Backend Communication
The React frontend communicates with the backend via `apiClient.js` and `apiConfig.js`:
- Base URL configured via `VITE_API_BASE_URL` environment variable
- Fallback to mock data when APIs are unavailable
- Error handling and retry logic built-in

---


- **Untracked Secrets**: `.env` is removed from Git history and excluded via `.gitignore`.
- **API Safety**: LLM responses are parsed strictly to prevent injection.

---

## 🏆 Acknowledgments
Built by **Team Bada Pikachu** (IIT Roorkee) for the **AI Unlocked Hackathon**.

*"Serving the roots of India with the power of the cloud."*
