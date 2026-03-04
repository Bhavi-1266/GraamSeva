# GraamSeva Frontend - Feature Documentation

## 📘 Complete Feature Guide

### 🏠 **Home Page** (`HomePage.jsx`)

**Purpose**: Language selection and application introduction

**Features**:
- 6 language options displayed as large buttons
- Scheme categories overview (4 quick info cards)
- Missed-call number information
- Gradient purple background with accessible color contrast
- Mobile-responsive grid layout

**User Journey**:
```
User Opens App
    ↓
Sees all 6 language options
    ↓
Clicks preferred language
    ↓
Navigates to Voice Input Page
```

**Supported Languages**:
- 🇮🇳 हिन्दी (Hindi)
- 🇮🇳 भोजपुरी (Bhojpuri)
- 🇮🇳 अवधी (Awadhi)
- 🇮🇳 ଓଡିଆ (Odia)
- 🇮🇳 मराठी (Marathi)
- 🇮🇳 मैथिली (Maithili)

---

### 🎤 **Voice Input Page** (`VoiceInputPage.jsx`)

**Purpose**: Collect user information and simulate voice recording

**Features**:
- Two-step process (Info → Recording)
- Form validation before proceeding
- Mock voice recording with timer
- Transcript visualization
- Re-record capability

**Step 1: Information Collection**
```
Input Fields:
├── Name (आपका नाम)
├── Mobile Number (+91 format, 10 digits)
└── Continue Button
```

**Step 2: Voice Recording**
```
Actions:
├── 🔴 Start Recording
│   └── Timer shows elapsed seconds
│   └── Voice icon pulses during recording
│   └── Max 60 seconds
├── ⏹️ Stop Recording
│   └── Generates mock transcript
│   └── Shows detected text
└── Options:
    ├── 🔄 Re-record
    └── ✅ Confirm & Proceed
```

**Mock Transcripts** (by language):
- Hindi: "मुझे PM-KISAN योजना के बारे में जानकारी चाहिए"
- Bhojpuri: "हम फसल बीमा के लिए आवेदन करना चाहते हैं"
- Odia: "ମୁଁ MGNREGA ରେଜିଷ୍ଟ୍ରେସନ ସମ୍ପର୍କରେ ଜାଣିବାକୁ ଚାହୁଁ"

**Data Structure**:
```javascript
{
  name: String,
  mobileNumber: String (10 digits),
  language: String (code),
  transcript: String,
  timestamp: ISO DateTime
}
```

---

### 📋 **Services Page** (`ServicesPage.jsx`)

**Purpose**: Display available government schemes based on eligibility

**Features**:
- Service cards with icons and descriptions
- Eligibility badges (✓ Eligible / ✗ Not Eligible)
- 6 sample schemes with real details
- Quick access to scheme information
- Personalized greeting with user's name

**Sample Schemes**:
```
1. PM-KISAN
   Icon: 🌾
   Benefit: ₹6,000 वार्षिक सहायता
   Status: Eligible

2. Crop Insurance (PMFBY)
   Icon: 🛡️
   Benefit: फसल नुकसान की सुरक्षा
   Status: Eligible

3. MGNREGA
   Icon: 💼
   Benefit: 100 दिन की गारंटीशुदा कार्य
   Status: Eligible

4. Soil Health Card
   Icon: 🌱
   Benefit: मिट्टी परीक्षण और सहायता
   Status: Not Eligible

5. Dairy Subsidy
   Icon: 🐄
   Benefit: ₹10,000 तक की सहायता
   Status: Eligible

6. Farmer Credit Card
   Icon: 🏦
   Benefit: आसान ब्याज दरों पर ऋण
   Status: Eligible
```

**Card Layout**:
```
[Icon] [Name + Description] [Icon] [Status Badge] [Action Button]
```

**Interactions**:
- Click on eligible scheme → Navigate to Eligibility Checker
- Disabled schemes show grayed out state
- Hover effects for visual feedback

---

### ✅ **Eligibility Page** (`EligibilityPage.jsx`)

**Purpose**: Check eligibility and provide scheme information

**Features**:
- Collapsible sections (Benefits, Requirements, Documents, Steps)
- Real-time eligibility verification
- 4 main sections with expandable content
- Color-coded requirement status
- Next action guidance

**Section 1: Benefits**
```
Examples for PM-KISAN:
✓ ₹2,000 हर चार महीने में
✓ ₹6,000 प्रति वर्ष
✓ सीधे बैंक में
```

**Section 2: Requirements**
```
Verification Status:
├── ✓ (Verified) - भारतीय नागरिक होना चाहिए
├── ✓ (Verified) - खेती योग्य जमीन होनी चाहिए
├── ✓ (Verified) - 2 हेक्टेयर तक की जमीन
└── ? (Pending) - आधार निर्भर बैंक खाता
```

**Eligibility Result**:
```
Verified Count ≥ 2 → "🎉 आप पात्र हैं!"
Otherwise → "ℹ️ कुछ शर्तें पूरी नहीं हैं"
```

**Section 3: Documents**
```
Required Documents:
📋 आधार कार्ड
📋 जमीन के कागजात
📋 बैंक खाते की जानकारी
📋 मोबाइल नंबर
```

**Section 4: Next Steps**
```
Timeline Guidance:
फॉर्म भरने के बाद 30 दिन में ₹2,000 खाते में आएंगे
```

---

### 📝 **Application Form** (`ApplicationPage.jsx`)

**Purpose**: Collect scheme application details

**Features**:
- Multi-step form (3 steps)
- Progress bar visualization
- Form validation
- Terms & conditions
- Success confirmation with reference

**Step-by-Step Process**:

**Step 1: Land Information**
```
Fields:
├── कुल कृषि योग्य जमीन (Dropdown)
│   └── Options: 0.5, 1, 1.5, 2 hectares
└── जमीन का प्रकार (Dropdown)
    └── Options: Owned, Leased, Shared
```

**Step 2: Bank Details**
```
Fields:
├── बैंक का नाम (Text Input)
│   └── Placeholder: "जैसे: SBI, HDFC आदि"
├── खाता संख्या (Text Input)
│   └── 12-digit account number
└── IFSC कोड (Text Input)
    └── Format: "SBIN0001234"
```

**Step 3: Family Information**
```
Fields:
├── परिवार के सदस्यों की संख्या (Dropdown)
│   └── Options: 1, 2, 3, 4, 5+
├── वार्षिक आय (Dropdown)
│   └── Ranges: ₹1L, ₹2L, ₹3L, ₹5L
└── Terms & Conditions (Checkbox)
    └── "मैं सत्यापित करता हूं कि दी गई सभी जानकारी सही है।"
```

**Progress Visualization**:
```
Step 1: ████████░░ 33%
Step 2: █████████░ 66%
Step 3: ██████████ 100%
```

**Navigation**:
- Previous Button (disabled on Step 1)
- Next Button (Steps 1-2)
- Submit Button (Step 3)

---

### ✨ **Success Page** (After Application)

**Purpose**: Confirm application submission

**Features**:
- Success animation
- Application reference number
- Timeline expectations
- Next action items
- Option to apply for more schemes

**Success Message Structure**:
```
✅ आवेदन सफलतापूर्वक जमा हुआ!

Your Reference: GS-2024-XXXXX

Timeline: ⏱️ 7-15 दिन

Next Steps:
✓ Application forwarded to regional office
✓ Officer will contact in 3-5 days
✓ Bring original documents to block office
✓ Funds transfer within 7 days of approval
```

---

### 📊 **CSC Operator Dashboard** (`DashboardPage.jsx`)

**Purpose**: Real-time impact monitoring and management

**Features**:
- Real-time statistics with KPIs
- Recent activity feed
- Language distribution analytics
- Quick action buttons
- Scheme performance comparison
- Responsive grid layout

**Section 1: KPI Cards**
```
📞 Today's Calls: 247
📋 Applications Processed: 1,340
💰 Amount Unlocked: ₹68,50,000
✅ Approval Rate: 87%
```

**Section 2: Recent Activities**
```
4 Recent Applications with Status:
├── Name | Scheme | Status | Amount | Time
├── राम कुमार | PM-KISAN | ✅ Approved | ₹2,000 | 2 hours ago
├── रीता देवी | Crop Insurance | ⏳ Processing | ₹15,000 | 4 hours ago
├── मोहन सिंह | MGNREGA | ❓ Pending | ₹309/day | 6 hours ago
└── दुर्गा वर्मा | Soil Health | ❌ Rejected | - | 8 hours ago
```

**Section 3: Language Analytics**
```
हिन्दी: ████████████░ 1,200
भोजपुरी: █████████░░░ 850
अवधी: ███████░░░░░ 650
ओडिया: ██████░░░░░░ 520
मराठी: █████░░░░░░░ 420
```

**Section 4: Quick Actions**
```
Buttons (2x2 Grid):
├── ➕ New Application
├── 🔍 Check Status
├── 📊 Reports
└── 🎤 IVR Test
```

**Section 5: Scheme Performance**
```
Table Format:
Scheme | Applications | Approved | Rate | Amount
────────────────────────────────────────────────
PM-KISAN | 450 | 405 | 90% | ₹24.3L
MGNREGA | 320 | 250 | 78% | ₹25.8L
Crop Insurance | 180 | 140 | 78% | ₹14.2L
Soil Health | 120 | 95 | 79% | ₹3.7L
```

---

## 🎨 Design System

### **Typography**
```css
Font Family: Segoe UI, Helvetica Neue, -apple-system, BlinkMacSystemFont
Base Size: 16px (1rem)

Sizes:
- H1: 2rem (32px)
- H2: 1.5rem (24px)
- H3: 1.2rem (19.2px)
- Body: 1rem (16px)
- Small: 0.9rem (14.4px)
- Tiny: 0.85rem (13.6px)
```

### **Color Palette**
```
Primary: #667eea → #764ba2 (Gradient Purple)
Success: #06D6A0 (Green)
Warning: #FFB703 (Orange)
Danger: #E63946 (Red)
Light: #F7F7F7 (Light Gray)
Dark: #2D2D2D (Dark Gray)
Gray: #A0A0A0 (Medium Gray)
```

### **Spacing**
```
Scale: 8px base unit
- xs: 0.5rem (4px)
- sm: 0.8rem (6.4px)
- md: 1.2rem (9.6px)
- lg: 1.5rem (12px)
- xl: 2rem (16px)
- 2xl: 3rem (24px)
```

### **Border Radius**
```
- sm: 6px
- md: 8px
- lg: 12px
- xl: 16px
- full: 20px (pills)
```

---

## 🔄 Application Data Flow

```
HomePage
  └─→ [Language Selected]
       └─→ VoiceInputPage
            └─→ [User Info + Voice]
                 └─→ ServicesPage
                      └─→ [Service Selected]
                           └─→ EligibilityPage
                                └─→ [Check Eligibility]
                                     └─→ ApplicationPage
                                          └─→ [Form Submitted]
                                               └─→ Success Page
                                                    └─→ [Reference Generated]
                                                         └─→ HomePage [New Scheme]
```

---

## 🚀 Performance Optimizations

1. **Code Splitting**: Each page is a separate component
2. **CSS Modules**: Scoped styling per component
3. **Lazy Loading**: Components load on demand
4. **Animations**: GPU-accelerated CSS transforms
5. **Mobile First**: Responsive design from 320px
6. **Touch Friendly**: Min 44px tap targets

---

## ♿ Accessibility Features

✅ Semantic HTML structure
✅ High contrast ratios (WCAG AA compliant)
✅ Large touch targets for mobile
✅ Keyboard navigation support
✅ Screen reader friendly labels
✅ Language selection for non-English speakers
✅ Clear error messages
✅ Progress indicators for forms

---

## 📱 Responsive Design

```
Mobile (320px - 480px)
  └─ Single column layout
     └─ Large buttons & touch targets
        └─ Vertical navigation
           └─ Stacked forms

Tablet (481px - 1024px)
  └─ Two column layout
     └─ Optimized card sizing
        └─ Grid layouts

Desktop (1025px+)
  └─ Full grid system
     └─ Horizontal layouts
        └─ Dashboard overview
```

---

This prototype provides a solid foundation for the production GraamSeva application!
